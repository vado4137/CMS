"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { reportAbsence } from "@/lib/actions/absence"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarIcon, Loader2, Plane } from "lucide-react"
import { toast } from "sonner"
import { DateRange } from "react-day-picker" // WICHTIG: Import hinzufügen

// 1. Das Interface anpassen
interface AbsenceFormProps {
  factionSlug: string;
  initialRange?: DateRange; // Von initialStartDate (Date) zu initialRange (DateRange)
}

export function AbsenceForm({ factionSlug, initialRange }: AbsenceFormProps) {
  // 2. Den State auf DateRange umstellen
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: initialRange?.from || new Date(),
    to: initialRange?.to
  })
  
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  // 3. Reaktivität hinzufügen: Wenn im Kalender ein neuer Bereich gewählt wird
  useEffect(() => {
    if (initialRange) {
      setDateRange(initialRange);
    }
  }, [initialRange]);

  const handleSubmit = async () => {
    // Validierung: Wir brauchen Start UND Ende für einen Zeitraum
    if (!dateRange?.from || !dateRange?.to) {
      return toast.error("Bitte wähle einen vollständigen Zeitraum (von-bis) aus.")
    }
    
    setLoading(true)
    try {
      await reportAbsence(factionSlug, { 
        startDate: dateRange.from, 
        endDate: dateRange.to, 
        reason 
      })
      toast.success("Abwesenheit wurde eingetragen.")
      setReason("")
    } catch (e) {
      toast.error("Fehler beim Speichern.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-2 mb-2">
        <Plane className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold uppercase tracking-tight">Abwesenheit melden</h3>
      </div>
      
      <div className="grid gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Zeitraum</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal h-10 bg-white">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    `${format(dateRange.from, "dd.MM.")} - ${format(dateRange.to, "dd.MM.yyyy")}`
                  ) : (
                    format(dateRange.from, "dd.MM.yyyy")
                  )
                ) : (
                  <span>Zeitraum wählen</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range" // Wichtig für die Auswahl in der Form
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                locale={de}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Grund (Optional)</label>
          <Textarea 
            placeholder="z.B. Urlaub, Fortbildung, Privat..." 
            className="bg-white resize-none h-20 border-slate-200"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 shadow-md">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Meldung abschicken
        </Button>
      </div>
    </div>
  )
}