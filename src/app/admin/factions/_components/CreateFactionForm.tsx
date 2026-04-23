"use client"

import { useState } from "react"
import { createFaction } from "@/lib/actions/faction"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FactionType } from "@prisma/client"

export function CreateFactionForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await createFaction(formData)
    setLoading(false)

    if (result.success) {
      alert("Fraktion erfolgreich erstellt!")
      window.location.reload() // Einfacher Refresh um die Liste zu aktualisieren
    } else {
      alert(result.error || "Fehler beim Erstellen")
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 border p-6 rounded-xl bg-white shadow-sm">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Fraktions-Name</Label>
          <Input id="name" name="name" placeholder="z.B. Los Santos Police Dept." required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL-Slug (kleingeschrieben, z.B. lspd)</Label>
          <Input id="slug" name="slug" placeholder="z.B. lspd" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Fraktions-Typ</Label>
        <Select name="type" defaultValue="NEUTRAL">
          <SelectTrigger>
            <SelectValue placeholder="Typ wählen" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(FactionType).map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea id="description" name="description" placeholder="Kurze Info zur Fraktion" />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Wird erstellt..." : "Fraktion erstellen"}
      </Button>
    </form>
  )
}