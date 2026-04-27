"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTraining } from "@/lib/actions/training"
import { toast } from "sonner"
import { GraduationCap, Loader2 } from "lucide-react"

export function CreateTrainingDialog({ factionSlug, trainingTypes }: any) {
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState("")

  async function handleSubmit() {
    if (!selectedType) return toast.error("Bitte wähle einen Ausbildungstyp aus.")
    
    setLoading(true)
    try {
      // Nur noch die typeId senden - memberId wird weggelassen
      await createTraining(factionSlug, { 
        typeId: selectedType 
      })
      toast.success("Offenes Training wurde im Kalender erstellt")
    } catch (e) {
      toast.error("Fehler beim Erstellen")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-slate-400">
          Welche Ausbildung bietest du an?
        </label>
        <Select onValueChange={setSelectedType}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Ausbildungstyp wählen..." />
          </SelectTrigger>
          <SelectContent>
            {trainingTypes?.map((t: any) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={handleSubmit} 
        className="w-full bg-emerald-600 hover:bg-emerald-700" 
        disabled={loading || !selectedType}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Angebot veröffentlichen"}
      </Button>
    </div>
  )
}