"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTraining } from "@/lib/actions/training" // Import korrigiert
import { toast } from "sonner"
import { GraduationCap, Loader2 } from "lucide-react"

export function CreateTrainingDialog({ factionSlug, members, trainingTypes }: any) {
  const [loading, setLoading] = useState(false)
  const [selectedMember, setSelectedMember] = useState("")
  const [selectedType, setSelectedType] = useState("")

  async function handleSubmit() {
    if (!selectedMember || !selectedType) return toast.error("Bitte alles ausfüllen")
    
    setLoading(true)
    try {
      await createTraining(factionSlug, { 
        memberId: selectedMember, 
        typeId: selectedType 
      })
      toast.success("Ausbildung eingetragen")
    } catch (e) {
      toast.error("Fehler beim Speichern")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-slate-400">Officer auswählen</label>
        <Select onValueChange={setSelectedMember}>
          <SelectTrigger className="bg-white"><SelectValue placeholder="Officer..." /></SelectTrigger>
          <SelectContent>
            {members?.map((m: any) => (
              <SelectItem key={m.id} value={m.id}>{m.firstName} {m.lastName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-slate-400">Ausbildungstyp</label>
        <Select onValueChange={setSelectedType}>
          <SelectTrigger className="bg-white"><SelectValue placeholder="Typ..." /></SelectTrigger>
          <SelectContent>
            {trainingTypes?.map((t: any) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} className="w-full bg-emerald-600" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Als Offen eintragen"}
      </Button>
    </div>
  )
}