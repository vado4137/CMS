import { ensureSuperAdmin } from "@/lib/admin-check"
import db from "@/lib/db"
import { testDiscordConnection, updateSystemConfig } from "@/lib/actions/system"
import { z } from "zod"
import { DiscordSettingsForm } from "./_components/DiscordSettingsForm"

const formSchema = z.object({
  discordBotToken: z
    .string()
    .trim()
    .min(1)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  useGlobalDiscord: z.coerce.boolean(),
  globalGuildId: z
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

export default async function DiscordSystemSettingsPage() {
  await ensureSuperAdmin()

  const config = await db.systemConfig.findUnique({
    where: { id: "system" },
  })

  async function saveAction(formData: FormData) {
    "use server"

    await ensureSuperAdmin()

    const raw = {
      discordBotToken: String(formData.get("discordBotToken") ?? "").trim() || undefined,
      useGlobalDiscord: String(formData.get("useGlobalDiscord") ?? "false") === "true",
      globalGuildId: String(formData.get("globalGuildId") ?? "").trim() || undefined,
      logsChannelId: String(formData.get("logsChannelId") ?? "").trim() || undefined,
      abmeldungChannelId: String(formData.get("abmeldungChannelId") ?? "").trim() || undefined,
      ausbildungChannelId: String(formData.get("ausbildungChannelId") ?? "").trim() || undefined,
    }

    const parsed = formSchema.safeParse(raw)
    if (!parsed.success) {
      return { success: false, error: "Ungültige Eingaben." as const }
    }

    const v = parsed.data
    const globalChannelSettings = v.useGlobalDiscord
      ? Object.fromEntries(
          (
            [
              ["logs", v.logsChannelId],
              ["abmeldung", v.abmeldungChannelId],
              ["ausbildung", v.ausbildungChannelId],
            ] as const
          ).filter(([, value]) => typeof value === "string" && value.length > 0),
        )
      : {}

    return await updateSystemConfig({
      discordBotToken: v.discordBotToken,
      useGlobalDiscord: v.useGlobalDiscord,
      globalGuildId: v.globalGuildId,
      globalChannelSettings,
    })
  }

  const channels = (config?.globalChannelSettings ?? {}) as Partial<Record<string, string>>

  return (
    <div className="container mx-auto p-6 md:p-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-black uppercase">Discord Settings</h1>
        <p className="text-muted-foreground">
          Systemweite Discord-Konfiguration (nur Super-Admins).
        </p>
      </header>

      <DiscordSettingsForm
        action={saveAction}
        testAction={testDiscordConnection}
        initialValues={{
          useGlobalDiscord: config?.useGlobalDiscord ?? true,
          globalGuildId: config?.globalGuildId ?? "",
          logsChannelId: channels.logs ?? "",
          abmeldungChannelId: channels.abmeldung ?? "",
          ausbildungChannelId: channels.ausbildung ?? "",
        }}
      />
    </div>
  )
}

