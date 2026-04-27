"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plane, GraduationCap } from "lucide-react"
import { AbsenceForm } from "../../my-profile/_components/AbsenceForm"
import { CreateTrainingDialog } from "../../settings/trainings/_components/CreateTrainingDialog"
import { DateRange } from "react-day-picker" // NEU: Import für Zeiträume

interface Props {
    isOpen: boolean
    selectedRange: DateRange | undefined
    onClose: () => void
    factionSlug: string
    canManageTrainings: boolean
    members: any[]         // Neu
    trainingTypes: any[]   // Neu
  }

  export function CalendarActionDialog({ 
    isOpen, selectedRange, onClose, factionSlug, canManageTrainings, members, trainingTypes 
  }: Props) {
  const [mode, setMode] = useState<"choice" | "absence" | "training">("choice")

  // Der Dialog öffnet sich, sobald mindestens ein Startdatum (from) vorhanden ist
  if (!selectedRange?.from) return null

  // Wir resetten den Mode, wenn der Dialog geschlossen wird
  const handleClose = () => {
    setMode("choice")
    onClose()
  }

  if (!isOpen) return null

  // Text für die Anzeige des Zeitraums erstellen
  const dateString = selectedRange?.from
    ? selectedRange.to 
      ? `${selectedRange.from.toLocaleDateString("de-DE")} bis ${selectedRange.to.toLocaleDateString("de-DE")}`
      : selectedRange.from.toLocaleDateString("de-DE")
    : ""
    
  return (
    <Dialog open={!!selectedRange?.from} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Aktion für: {dateString}</DialogTitle>
          <DialogDescription>Was möchtest du für diesen Zeitraum tun?</DialogDescription>
        </DialogHeader>

        {mode === "choice" && (
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 border-2 hover:border-blue-500 hover:bg-blue-50"
              onClick={() => setMode("absence")}
            >
              <Plane className="w-6 h-6 text-blue-600" />
              <span>Abwesenheit melden</span>
            </Button>

            {canManageTrainings && (
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 border-2 hover:border-emerald-500 hover:bg-emerald-50"
                onClick={() => setMode("training")}
              >
                <GraduationCap className="w-6 h-6 text-emerald-600" />
                <span>Neue Ausbildung erstellen</span>
              </Button>
            )}
          </div>
        )}

        {mode === "absence" && (
          <div className="pt-4">
            {/* GEÄNDERT: Wir übergeben initialRange statt initialStartDate */}
            <AbsenceForm factionSlug={factionSlug} initialRange={selectedRange} />
            <Button variant="ghost" onClick={() => setMode("choice")} className="w-full mt-4 text-xs">Zurück zur Auswahl</Button>
          </div>
        )}

            {mode === "training" && (
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">Erstelle eine neue Ausbildung für einen Officer.</p>
            {/* Hier werden die Listen nun an den Dialog übergeben */}
            <CreateTrainingDialog 
                factionSlug={factionSlug}
                trainingTypes={trainingTypes}
                // WICHTIG: Hier muss das Datum aus der Range übergeben werden!
                selectedDate={selectedRange?.from} 
                />
            <Button variant="ghost" onClick={() => setMode("choice")} className="w-full mt-4 text-xs">Zurück zur Auswahl</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}