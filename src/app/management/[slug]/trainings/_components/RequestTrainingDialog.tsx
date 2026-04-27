"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createTrainingRequest } from "@/lib/actions/training"
import { toast } from "sonner"
import { Plus, GraduationCap, Loader2 } from "lucide-react"

interface Props {
  factionSlug: string
  trainingTypes: { id: string, name: string }[]
}

export function RequestTrainingDialog({ factionSlug, trainingTypes }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedTypeId, setSelectedTypeId] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTypeId) return toast.error("Bitte wähle eine Ausbildung aus.")

    setLoading(true)
    try {
      const res = await createTrainingRequest(factionSlug, selectedTypeId)
      if (res.success) {
        toast.success("Ausbildungsanfrage erfolgreich eingereicht!")
        setOpen(false)
        setSelectedTypeId("")
      }
    } catch (error: any) {
      toast.error(error.message || "Fehler beim Einreichen der Anfrage")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Ausbildung anfragen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Weiterbildung beantragen
          </DialogTitle>
          <DialogDescription>
            Wähle die gewünschte Ausbildung aus dem Katalog. Ein Ausbilder wird sich nach der Prüfung bei dir melden.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="trainingType">Verfügbare Ausbildungen</Label>
            <Select onValueChange={setSelectedTypeId} value={selectedTypeId}>
              <SelectTrigger id="trainingType" className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Ausbildung auswählen..." />
              </SelectTrigger>
              <SelectContent>
                {trainingTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
                {trainingTypes.length === 0 && (
                  <p className="text-xs text-center p-2 text-slate-400 italic">
                    Aktuell keine Ausbildungen verfügbar.
                  </p>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
            >
              Abbrechen
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedTypeId}
              className="bg-blue-600 hover:bg-blue-700 min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Wird gesendet...
                </>
              ) : (
                "Anfrage senden"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}