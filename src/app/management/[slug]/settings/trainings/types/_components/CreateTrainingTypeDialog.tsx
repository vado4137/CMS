"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTrainingType } from "@/lib/actions/training" // Nutzt die Typ-Erstellung
import { toast } from "sonner"
import { Plus, BookOpen, Loader2 } from "lucide-react"

export function CreateTrainingTypeDialog({ factionSlug }: { factionSlug: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    try {
      // Ruft die Server Action mit Name und Beschreibung auf
      const res = await createTrainingType(factionSlug, name, description)
      if (res.success) {
        toast.success(`Der Typ "${name}" wurde erfolgreich erstellt.`)
        setOpen(false)
      }
    } catch (error: any) {
      toast.error(error.message || "Fehler beim Erstellen")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <Plus className="w-4 h-4" /> Typ hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Neuer Ausbildungstyp
          </DialogTitle>
          <DialogDescription>
            Definiere einen Lehrgang, der später im Kalender angeboten werden kann.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name der Ausbildung</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="z.B. Atemschutzgeräteträger (AGT)" 
              required 
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Kurzbeschreibung / Inhalte</Label>
            <Input 
              id="description" 
              name="description" 
              placeholder="z.B. Theorie & Praxis im Brandcontainer..." 
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Wird gespeichert...
                </>
              ) : (
                "Im Katalog speichern"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}