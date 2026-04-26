"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createLocation } from "@/lib/actions/location"
import { toast } from "sonner"
import { Plus, MapPin } from "lucide-react"

export function CreateLocationDialog({ factionSlug }: { factionSlug: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const name = formData.get("name") as string

    try {
      const res = await createLocation(factionSlug, name)
      if (res.success) {
        toast.success(`Standort "${name}" wurde registriert!`)
        setOpen(false)
      }
    } catch (error) {
      toast.error("Fehler beim Erstellen des Standorts")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4" /> Standort hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            Neue Wache / Stützpunkt
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bezeichnung des Standorts</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="z.B. Sandy Shores Medical Center" 
              required 
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Wird gespeichert..." : "Standort speichern"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}