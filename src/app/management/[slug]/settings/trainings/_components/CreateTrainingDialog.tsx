"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { createTraining } from "@/lib/actions/training"
import { toast } from "sonner"
import { Plus, GraduationCap } from "lucide-react"

export function CreateTrainingDialog({ factionSlug }: { factionSlug: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const name = formData.get("name") as string
    const shortName = formData.get("shortName") as string

    try {
      const res = await createTraining(factionSlug, name, shortName)
      if (res.success) {
        toast.success(`Zertifikat "${name}" zum Katalog hinzugefügt!`)
        setOpen(false)
      }
    } catch (error) {
      toast.error("Fehler beim Erstellen der Ausbildung")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4" /> Ausbildung anlegen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            Neuer Lehrgang
          </DialogTitle>
          <DialogDescription>
            Erstelle eine Qualifikation, die Mitgliedern in ihrer Dienstakte zugewiesen werden kann.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bezeichnung der Ausbildung</Label>
            <Input id="name" name="name" placeholder="z.B. Atemschutzgeräteträger" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortName">Kürzel / Zertifikat</Label>
            <Input id="shortName" name="shortName" placeholder="z.B. AGT" />
            <p className="text-[10px] text-muted-foreground italic">Wird als kompaktes Badge in der Mitgliederliste angezeigt.</p>
          </div>
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
            {loading ? "Wird registriert..." : "Lehrgang speichern"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}