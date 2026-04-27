"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { updateTrainingStatus } from "@/lib/actions/training"
import { toast } from "sonner"
import { CheckCircle2, Users } from "lucide-react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: any
  factionSlug: string
}

export function FinishTrainingDialog({ open, onOpenChange, request, factionSlug }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(request.students.map((s: any) => s.id))
  const [loading, setLoading] = useState(false)

  const handleToggle = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleSelectAll = () => {
    setSelectedIds(request.students.map((s: any) => s.id))
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      await updateTrainingStatus(factionSlug, request.id, "FINISH", selectedIds)
      toast.success("Training erfolgreich abgeschlossen")
      onOpenChange(false)
    } catch (e) {
      toast.error("Fehler beim Speichern")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Ergebnis eintragen
          </DialogTitle>
          <DialogDescription>
            Wähle aus, welche Teilnehmer die Ausbildung "{request.trainingType.name}" erfolgreich bestanden haben.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Teilnehmerliste</span>
            <Button variant="ghost" size="sm" className="h-6 text-[10px] uppercase" onClick={handleSelectAll}>
              Alle auswählen
            </Button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {request.students.map((student: any) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold border">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <span className="text-sm font-medium">{student.firstName} {student.lastName}</span>
                </div>
                <Checkbox 
                  checked={selectedIds.includes(student.id)} 
                  onCheckedChange={() => handleToggle(student.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button className="bg-emerald-600" onClick={handleFinish} disabled={loading}>
            Bestanden ({selectedIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}