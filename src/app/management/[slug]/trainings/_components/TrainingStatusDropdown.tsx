"use client"

import { useState } from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { updateTrainingStatus } from "@/lib/actions/training"
import { TrainingStatus } from "@prisma/client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Props {
  factionSlug: string
  requestId: string
  currentStatus: TrainingStatus
}

export function TrainingStatusDropdown({ factionSlug, requestId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: TrainingStatus) => {
    if (newStatus === currentStatus) return
    
    setLoading(true)
    try {
      const res = await updateTrainingStatus(factionSlug, requestId, newStatus)
      if (res.success) {
        toast.success(`Status auf ${newStatus} aktualisiert`)
      }
    } catch (e: any) {
      toast.error(e.message || "Fehler beim Aktualisieren")
    } finally {
      setLoading(false)
    }
  }

  // Hilfsfunktion für Farben der Status-Indikatoren
  const getStatusColor = (status: TrainingStatus) => {
    switch (status) {
      case "OFFEN": return "bg-slate-400"
      case "PLANNING": return "bg-blue-400"
      case "PENDING": return "bg-amber-400"
      case "FINISH": return "bg-emerald-500"
      case "DNF": return "bg-red-500"
      default: return "bg-slate-200"
    }
  }

  return (
    <div className="relative inline-block w-[140px]">
      <Select 
        defaultValue={currentStatus} 
        onValueChange={(val) => handleStatusChange(val as TrainingStatus)}
        disabled={loading}
      >
        <SelectTrigger className="h-8 text-[10px] font-bold uppercase tracking-tighter border-none bg-slate-50">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(currentStatus)}`} />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="OFFEN" className="text-[10px] font-bold uppercase">Offen</SelectItem>
          <SelectItem value="PLANNING" className="text-[10px] font-bold uppercase">Planning</SelectItem>
          <SelectItem value="PENDING" className="text-[10px] font-bold uppercase">Pending</SelectItem>
          <SelectItem value="FINISH" className="text-[10px] font-bold uppercase text-emerald-600">Finish</SelectItem>
          <SelectItem value="DNF" className="text-[10px] font-bold uppercase text-red-600">DNF</SelectItem>
        </SelectContent>
      </Select>
      
      {loading && (
        <div className="absolute -right-6 top-2">
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
        </div>
      )}
    </div>
  )
}