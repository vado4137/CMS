"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateMemberDetails } from "@/lib/actions/member"
import { toast } from "sonner"
import { Save } from "lucide-react"

export function ServiceNotesForm({ factionSlug, memberId, initialNotes }: { factionSlug: string, memberId: string, initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateMemberDetails(factionSlug, memberId, { notes })
      toast.success("Dienstakte aktualisiert")
    } catch (e) {
      toast.error("Fehler beim Speichern")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Textarea 
        placeholder="Schreibe hier wichtige Informationen über den Officer hinein..."
        className="min-h-[400px] bg-slate-50 border-none focus-visible:ring-blue-500 resize-none p-4"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4" />
          {loading ? "Wird gespeichert..." : "Akte speichern"}
        </Button>
      </div>
    </div>
  )
}