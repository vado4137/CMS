import db from "@/lib/db"
import { verifySettingsAccess } from "@/lib/dal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { FactionDiscordSettingsForm } from "./_components/FactionDiscordSettingsForm"
import { decryptIfEncrypted } from "@/lib/encryption"

const factionDiscordSchema = z.object({
  customGuildId: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  logsChannelId: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  abmeldungChannelId: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  ausbildungChannelId: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
})

export default async function DiscordFactionSettingsPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const member = await verifySettingsAccess(slug)

  const systemConfig = await db.systemConfig.findUnique({
    where: { id: "system" },
    select: { useGlobalDiscord: true },
  })
  const useGlobalDiscord = systemConfig?.useGlobalDiscord ?? true
  const factionConfig = await db.faction.findUnique({
    where: { id: member.factionId },
    select: { customGuildId: true, customChannels: true },
  })
  const customChannels = (factionConfig?.customChannels ?? {}) as Partial<Record<string, string>>

  async function saveFactionDiscordAction(formData: FormData) {
    "use server"

    const secureMember = await verifySettingsAccess(slug)
    const currentSystemConfig = await db.systemConfig.findUnique({
      where: { id: "system" },
      select: { useGlobalDiscord: true },
    })

    if (currentSystemConfig?.useGlobalDiscord) {
      return {
        success: false,
        error: "Bearbeitung ist deaktiviert, solange Global Discord aktiv ist.",
      }
    }

    const parsed = factionDiscordSchema.safeParse({
      customGuildId: String(formData.get("customGuildId") ?? ""),
      logsChannelId: String(formData.get("logsChannelId") ?? ""),
      abmeldungChannelId: String(formData.get("abmeldungChannelId") ?? ""),
      ausbildungChannelId: String(formData.get("ausbildungChannelId") ?? ""),
    })

    if (!parsed.success) {
      return { success: false, error: "Ungueltige Eingaben." }
    }

    const v = parsed.data
    const customChannelsPayload = Object.fromEntries(
      (
        [
          ["logs", v.logsChannelId],
          ["abmeldung", v.abmeldungChannelId],
          ["ausbildung", v.ausbildungChannelId],
        ] as const
      ).filter(([, value]) => typeof value === "string" && value.length > 0),
    )

    await db.faction.update({
      where: { id: secureMember.factionId },
      data: {
        customGuildId: v.customGuildId,
        customChannels: customChannelsPayload,
      },
    })

    revalidatePath(`/management/${slug}/settings/discord`)
    return { success: true }
  }

  async function testFactionDiscordAction(formData: FormData) {
    "use server"

    await verifySettingsAccess(slug)
    const currentSystemConfig = await db.systemConfig.findUnique({
      where: { id: "system" },
      select: { useGlobalDiscord: true },
    })

    if (currentSystemConfig?.useGlobalDiscord) {
      return {
        success: false,
        error: "Test deaktiviert, solange Global Discord aktiv ist.",
      }
    }

    const parsed = factionDiscordSchema.safeParse({
      customGuildId: String(formData.get("customGuildId") ?? ""),
      logsChannelId: String(formData.get("logsChannelId") ?? ""),
      abmeldungChannelId: String(formData.get("abmeldungChannelId") ?? ""),
      ausbildungChannelId: String(formData.get("ausbildungChannelId") ?? ""),
    })

    if (!parsed.success || !parsed.data.customGuildId) {
      return { success: false, error: "Bitte zuerst eine gueltige Guild ID eintragen." }
    }

    const tokenConfig = await db.systemConfig.findUnique({
      where: { id: "system" },
      select: { discordBotToken: true },
    })

    if (!tokenConfig?.discordBotToken) {
      return { success: false, error: "Kein Bot-Token in der SystemConfig hinterlegt." }
    }

    const token = decryptIfEncrypted(tokenConfig.discordBotToken)
    const headers = { Authorization: `Bot ${token}` }

    try {
      const guildRes = await fetch(`https://discord.com/api/v10/guilds/${parsed.data.customGuildId}`, {
        headers,
        cache: "no-store",
      })
      if (!guildRes.ok) {
        return { success: false, error: "Bot hat keinen Zugriff auf die angegebene Guild." }
      }
    } catch {
      return { success: false, error: "Guild-Test fehlgeschlagen." }
    }

    const checks: Array<{ key: string; id?: string }> = [
      { key: "Logs", id: parsed.data.logsChannelId },
      { key: "Abmeldung", id: parsed.data.abmeldungChannelId },
      { key: "Ausbildung", id: parsed.data.ausbildungChannelId },
    ]

    for (const check of checks) {
      if (!check.id) continue
      try {
        const channelRes = await fetch(`https://discord.com/api/v10/channels/${check.id}`, {
          headers,
          cache: "no-store",
        })
        if (!channelRes.ok) {
          return { success: false, error: `${check.key} Channel nicht erreichbar oder ungueltig.` }
        }
      } catch {
        return { success: false, error: `${check.key} Channel nicht erreichbar oder ungueltig.` }
      }
    }

    return { success: true }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Discord Einstellungen</h2>
        <p className="text-muted-foreground text-sm">
          Fraktionsbezogene Discord-Konfiguration fuer {member.faction.name}.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Global Discord Status
            <Badge variant={useGlobalDiscord ? "destructive" : "secondary"}>
              {useGlobalDiscord ? "aktiv" : "deaktiviert"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {useGlobalDiscord
            ? "Global Discord ist aktiv. Ein Superadmin hat die fraktionsspezifische Bearbeitung deaktiviert."
            : "Global Discord ist deaktiviert. Fraktionsspezifische Bearbeitung ist erlaubt."}
        </CardContent>
      </Card>

      <FactionDiscordSettingsForm
        disabled={useGlobalDiscord}
        action={saveFactionDiscordAction}
        testAction={testFactionDiscordAction}
        initialValues={{
          customGuildId: factionConfig?.customGuildId ?? "",
          logsChannelId: customChannels.logs ?? "",
          abmeldungChannelId: customChannels.abmeldung ?? "",
          ausbildungChannelId: customChannels.ausbildung ?? "",
        }}
      />
    </div>
  )
}

