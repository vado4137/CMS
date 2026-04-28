"use client"

import * as React from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type ActionResult = { success: boolean; error?: string }
type TestActionResult = { success: boolean; error?: string; botName?: string }

export function DiscordSettingsForm(props: {
  action: (formData: FormData) => Promise<ActionResult>
  testAction: () => Promise<TestActionResult>
  initialValues: {
    useGlobalDiscord: boolean
    globalGuildId: string
    logsChannelId: string
    abmeldungChannelId: string
    ausbildungChannelId: string
  }
}) {
  const [useGlobalDiscord, setUseGlobalDiscord] = React.useState(props.initialValues.useGlobalDiscord)
  const [isPending, startTransition] = React.useTransition()
  const [isTesting, startTestTransition] = React.useTransition()

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    // Ensure boolean arrives in a deterministic way.
    fd.set("useGlobalDiscord", useGlobalDiscord ? "true" : "false")

    startTransition(async () => {
      const res = await props.action(fd)
      if (res?.success) toast.success("Gespeichert.")
      else toast.error(res?.error ?? "Speichern fehlgeschlagen.")
    })
  }

  const onTestConnection = () => {
    startTestTransition(async () => {
      const res = await props.testAction()
      if (res?.success) {
        toast.success(`Verbindung erfolgreich. Bot: ${res.botName ?? "Unbekannt"}`)
        return
      }
      toast.error(res?.error ?? "Verbindungstest fehlgeschlagen.")
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SystemConfig</CardTitle>
        <CardDescription>Konfiguriere den globalen Discord-Bot und Channels.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="discordBotToken">Discord Bot Token</Label>
            <Input
              id="discordBotToken"
              name="discordBotToken"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••••••••••"
            />
            <p className="text-xs text-muted-foreground">
              Leer lassen, um den bestehenden Token beizubehalten.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-1">
              <div className="font-medium">Globales Discord aktiv</div>
              <div className="text-sm text-muted-foreground">
                Wenn deaktiviert, werden keine globalen Channel-IDs verwendet.
              </div>
            </div>
            <Switch checked={useGlobalDiscord} onCheckedChange={setUseGlobalDiscord} />
            <input type="hidden" name="useGlobalDiscord" value={useGlobalDiscord ? "true" : "false"} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="globalGuildId">Global Guild ID</Label>
            <Input
              id="globalGuildId"
              name="globalGuildId"
              placeholder="123456789012345678"
              defaultValue={props.initialValues.globalGuildId}
            />
          </div>

          {useGlobalDiscord ? (
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="logsChannelId">Logs Channel ID</Label>
                <Input
                  id="logsChannelId"
                  name="logsChannelId"
                  placeholder="123456789012345678"
                  defaultValue={props.initialValues.logsChannelId}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="abmeldungChannelId">Abmeldung Channel ID</Label>
                <Input
                  id="abmeldungChannelId"
                  name="abmeldungChannelId"
                  placeholder="123456789012345678"
                  defaultValue={props.initialValues.abmeldungChannelId}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ausbildungChannelId">Ausbildung Channel ID</Label>
                <Input
                  id="ausbildungChannelId"
                  name="ausbildungChannelId"
                  placeholder="123456789012345678"
                  defaultValue={props.initialValues.ausbildungChannelId}
                />
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isPending || isTesting}>
              {isPending ? "Speichere..." : "Speichern"}
            </Button>
            <Button type="button" variant="outline" onClick={onTestConnection} disabled={isPending || isTesting}>
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Teste...
                </>
              ) : (
                "Verbindung testen"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

