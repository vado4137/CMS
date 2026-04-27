"use client"

import { useState } from "react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu" // HIER: Fehlende Imports hinzugefügt
import { Button } from "@/components/ui/button"
import { updateTrainingStatus } from "@/lib/actions/training"
import { TrainingStatus } from "@prisma/client"
import { toast } from "sonner"
import { Loader2, ChevronDown } from "lucide-react"
import { FinishTrainingDialog } from "./FinishTrainingDialog" // HIER: Dialog importieren

interface Props {
  factionSlug: string
  request: any // GEÄNDERT: Wir übergeben das ganze Objekt für den Dialog
  currentStatus: TrainingStatus
}

export function TrainingStatusDropdown({ factionSlug, request, currentStatus }: Props) {
  const [loading, setLoading] = useState(false)
  const [showFinishDialog, setShowFinishDialog] = useState(false)

  const handleStatusChange = async (status: string) => {
    if (status === "FINISH") {
      setShowFinishDialog(true)
      return
    }
    
    setLoading(true)
    try {
      await updateTrainingStatus(factionSlug, request.id, status as any)
      toast.success("Status aktualisiert")
    } catch (e) {
      toast.error("Fehler beim Aktualisieren")
    } finally {
      setLoading(true)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 gap-1 text-[10px] uppercase font-bold">
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : currentStatus}
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleStatusChange("PLANNING")}>Planung</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>Laufend</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("FINISH")} className="text-emerald-600 font-bold">
            Abgeschlossen
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("DNF")} className="text-red-600">
            Abgebrochen (DNF)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Der Dialog für den selektiven Abschluss */}
      {showFinishDialog && (
        <FinishTrainingDialog 
          open={showFinishDialog}
          onOpenChange={setShowFinishDialog}
          request={request}
          factionSlug={factionSlug}
        />
      )}
    </>
  )
}