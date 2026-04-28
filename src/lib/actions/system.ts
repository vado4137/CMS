"use server"

import db from "@/lib/db"
import { ensureSuperAdmin } from "@/lib/admin-check"
import { revalidatePath } from "next/cache"
import { decryptIfEncrypted, encrypt } from "@/lib/encryption"
import { Client, GatewayIntentBits } from "discord.js"

export async function updateSystemConfig(data: {
  discordBotToken?: string;
  useGlobalDiscord: boolean;
  globalGuildId?: string;
  globalChannelSettings: any;
}) {
  await ensureSuperAdmin();

  const payload: {
    useGlobalDiscord: boolean
    globalGuildId?: string
    globalChannelSettings: any
    discordBotToken?: string
  } = {
    useGlobalDiscord: data.useGlobalDiscord,
    globalGuildId: data.globalGuildId,
    globalChannelSettings: data.globalChannelSettings,
  }

  if (typeof data.discordBotToken === "string" && data.discordBotToken.trim().length > 0) {
    payload.discordBotToken = encrypt(data.discordBotToken.trim())
  }

  await db.systemConfig.upsert({
    where: { id: "system" },
    update: payload,
    create: { id: "system", ...payload },
  });

  revalidatePath("/admin/settings/discord");
  return { success: true };
}

export async function testDiscordConnection() {
  await ensureSuperAdmin()

  const config = await db.systemConfig.findUnique({
    where: { id: "system" },
    select: { discordBotToken: true, globalGuildId: true },
  })

  if (!config?.discordBotToken) {
    return { success: false, error: "Kein Discord Bot Token konfiguriert." }
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  })

  try {
    const token = decryptIfEncrypted(config.discordBotToken)
    await client.login(token)

    if (config.globalGuildId) {
      try {
        await client.guilds.fetch(config.globalGuildId)
      } catch {
        return {
          success: false,
          error: "Login erfolgreich, aber kein Zugriff auf die hinterlegte Global Guild.",
        }
      }
    }

    return {
      success: true,
      botName: client.user?.tag ?? client.user?.username ?? "Unbekannter Bot",
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (/invalid token/i.test(message)) {
      return { success: false, error: "Invalid Token" }
    }

    if (/intents/i.test(message)) {
      return { success: false, error: "Login fehlgeschlagen: Intents fehlen oder sind falsch konfiguriert." }
    }

    return { success: false, error: `Discord-Verbindung fehlgeschlagen: ${message}` }
  } finally {
    client.destroy()
  }
}