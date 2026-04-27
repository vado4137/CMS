"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { de } from "date-fns/locale"
import { CalendarActionDialog } from "./CalendarActionDialog"
import { DateRange } from "react-day-picker"
import { isSameDay } from "date-fns"
// NEU: Import für Button und Icon
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function InteractiveCalendarView({ 
  factionSlug, canManageTrainings, absences, members, trainingTypes, trainings 
}: any) {
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const trainingDays = trainings
    ?.filter((t: any) => t.scheduledDate)
    .map((t: any) => new Date(t.scheduledDate)) || []

  // Handler für Klicks auf die Tage
  const handleDayClick = (day: Date, modifiers: any, e: React.MouseEvent) => {
    // e.detail counts the clicks. 2 = double-click
    if (e.detail === 2) {
      setIsDialogOpen(true)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-sm border">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange} // Single-Click updates range and details
          onDayClick={handleDayClick} // Double-Click opens dialog
          locale={de}
          className="rounded-md w-full"
          modifiers={{ hasTraining: trainingDays }}
          modifiersClassNames={{
            hasTraining: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-emerald-500 after:rounded-full font-bold text-emerald-700",
          }}
        />
      </div>

      <div className="lg:col-span-5 space-y-6"> {/* Abstand auf space-y-6 erhöht */}
        
        {/* NEU: Header-Container mit Titel und dem neuen Button */}
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Details für {range?.from?.toLocaleDateString("de-DE") || "heute"}
          </h3>
          {/* HIER: Der neue Button */}
          <Button 
            size="sm" 
            onClick={() => setIsDialogOpen(true)} 
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Aktion
          </Button>
        </div>
        
        <div className="space-y-2 mt-4">
          {range?.from && trainings
            ?.filter((t: any) => isSameDay(new Date(t.scheduledDate), range.from!))
            .map((t: any) => (
              <div key={t.id} className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-xs font-bold text-emerald-700">{t.trainingType.name}</p>
                <p className="text-[10px] text-emerald-600">Ausbilder: {t.instructor?.lastName}</p>
                <p className="text-[10px] font-medium mt-1">{t.students?.length || 0} Teilnehmer</p>
              </div>
            ))}
            
          {/* Fallback if no trainings found */}
          {range?.from && trainings?.filter((t: any) => isSameDay(new Date(t.scheduledDate), range.from!)).length === 0 && (
            <p className="text-xs text-slate-400 italic">Keine Trainings an diesem Tag.</p>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-[10px] font-bold text-blue-800 uppercase mb-1">Anleitung</p>
          <p className="text-[11px] text-blue-700 leading-relaxed">
            • <b>Einfacher Klick:</b> Termine in dieser Liste anzeigen.<br/>
            • <b>Doppelklick</b> oder <b>Button oben rechts:</b> Neues Training oder Abwesenheit eintragen.
          </p>
        </div>
      </div>

      <CalendarActionDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        selectedRange={range}
        factionSlug={factionSlug}
        canManageTrainings={canManageTrainings}
        members={members}
        trainingTypes={trainingTypes}
      />
    </div>
  )
}