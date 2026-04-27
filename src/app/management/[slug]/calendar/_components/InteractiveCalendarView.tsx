"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { de } from "date-fns/locale"
import { CalendarActionDialog } from "./CalendarActionDialog"
import { DateRange } from "react-day-picker" // Wichtiger Import für Zeiträume

export function InteractiveCalendarView({ factionSlug, canManageTrainings, absences, members, trainingTypes }: any) {
  // Wir speichern jetzt eine DateRange statt eines einzelnen Datums
  const [range, setRange] = useState<DateRange | undefined>(undefined)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-sm border">
        <Calendar
          mode="range" // Von "single" auf "range" geändert
          selected={range}
          onSelect={setRange}
          locale={de}
          className="rounded-md w-full"
          classNames={{
            day_today: "bg-blue-100 text-blue-900 font-bold",
            day_selected: "bg-blue-600 text-white hover:bg-blue-600 focus:bg-blue-600",
            day_range_middle: "bg-blue-50 text-blue-900", // Optische Markierung für die Tage dazwischen
          }}
        />
      </div>

      <div className="lg:col-span-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Status Heute</h3>
        <p className="text-xs text-slate-500 italic">Klicke zwei Daten im Kalender an, um einen Zeitraum zu wählen.</p>
      </div>

      {/* Wir übergeben die Range an den Dialog */}
      <CalendarActionDialog 
        selectedRange={range}
        onClose={() => setRange(undefined)}
        factionSlug={factionSlug}
        canManageTrainings={canManageTrainings}
        members={members}
        trainingTypes={trainingTypes}
      />
    </div>
  )
}