"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Building2 } from "lucide-react"
import { createDepartment } from "@/lib/actions/departments"

export function CreateDepartmentDialog({ factionSlug }: { factionSlug: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const name = formData.get("name") as string
    const shortName = formData.get("shortName") as string

    try {
      const res = await createDepartment(factionSlug, name, shortName)
      if (res.success) {
        toast.success(`Abteilung ${name} erstellt!`)
        setOpen(false)
      }
    } catch (error) {
      toast.error("Fehler beim Erstellen der Abteilung")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Abteilung gründen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Neue Spezialisierung
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name der Abteilung</Label>
            <Input id="name" name="name" placeholder="z.B. Rettungsdienst" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortName">Kürzel (optional)</Label>
            <Input id="shortName" name="shortName" placeholder="z.B. RD" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Gründung läuft..." : "Abteilung registrieren"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}