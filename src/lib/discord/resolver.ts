import db from "@/lib/db"
import { decryptIfEncrypted } from "@/lib/encryption"

export async function getDiscordDestination(factionId: string, type: 'logs' | 'abmeldung' | 'ausbildung') {
  // 1. Hole System- und Fraktions-Konfiguration
  const config = await db.systemConfig.findUnique({ where: { id: "system" } });
  const faction = await db.faction.findUnique({ 
    where: { id: factionId },
    select: { customGuildId: true, customChannels: true }
  });

  // 2. Fallunterscheidung: Global vs. Individuell
  if (config?.useGlobalDiscord) {
    const channels = config.globalChannelSettings as any;
    return { 
      guildId: config.globalGuildId, 
      channelId: channels?.[type] 
    };
  } 

  const customChannels = faction?.customChannels as any;
  return { 
    guildId: faction?.customGuildId, 
    channelId: customChannels?.[type] 
  };
}

export async function getDiscordBotToken(): Promise<string | null> {
  const config = await db.systemConfig.findUnique({
    where: { id: "system" },
    select: { discordBotToken: true },
  })

  if (!config?.discordBotToken) return null
  return decryptIfEncrypted(config.discordBotToken)
}