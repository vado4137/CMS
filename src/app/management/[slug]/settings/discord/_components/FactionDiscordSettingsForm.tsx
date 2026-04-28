"use client"

import * as React from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type ActionResult = { success: boolean; error?: string }
type TestResult = { success: boolean; error?: string }

export function FactionDiscordSettingsForm(props: {
  disabled: boolean
  action: (formData: FormData) => Promise<ActionResult>
  testAction: (formData: FormData) => Promise<TestResult>
  initialValues: {
    customGuildId: string
    logsChannelId: string
    abmeldungChannelId: string
    ausbildungChannelId: string
  }
}) {
  const [isPending, startTransition] = React.useTransition()
  const [isTesting, startTestTransition] = React.useTransition()

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await props.action(fd)
      if (res?.success) toast.success("Discord-Einstellungen gespeichert.")
      else toast.error(res?.error ?? "Speichern fehlgeschlagen.")
    })
  }

  const onTest: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const form = e.currentTarget.form
    if (!form) return
    const fd = new FormData(form)

    startTestTransition(async () => {
      const res = await props.testAction(fd)
      if (res?.success) toast.success("Verbindung erfolgreich getestet.")
      else toast.error(res?.error ?? "Verbindungstest fehlgeschlagen.")
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraktions-Discord</CardTitle>
        <CardDescription>Lege Guild- und Channel-IDs fuer diese Fraktion fest.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="customGuildId">Guild ID</Label>
            <Input
              id="customGuildId"
              name="customGuildId"
              placeholder="123456789012345678"
              defaultValue={props.initialValues.customGuildId}
              disabled={props.disabled}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="logsChannelId">Logs Channel ID</Label>
            <Input
              id="logsChannelId"
              name="logsChannelId"
              placeholder="123456789012345678"
              defaultValue={props.initialValues.logsChannelId}
              disabled={props.disabled}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="abmeldungChannelId">Abmeldung Channel ID</Label>
            <Input
              id="abmeldungChannelId"
              name="abmeldungChannelId"
              placeholder="123456789012345678"
              defaultValue={props.initialValues.abmeldungChannelId}
              disabled={props.disabled}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ausbildungChannelId">Ausbildung Channel ID</Label>
            <Input
              id="ausbildungChannelId"
              name="ausbildungChannelId"
              placeholder="123456789012345678"
              defaultValue={props.initialValues.ausbildungChannelId}
              disabled={props.disabled}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={props.disabled || isPending || isTesting}>
              {isPending ? "Speichere..." : "Speichern"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={props.disabled || isPending || isTesting}
              onClick={onTest}
            >
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

