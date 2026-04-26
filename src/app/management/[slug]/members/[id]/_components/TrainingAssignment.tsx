"use client"

import * as React from "react"
import { Check, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { updateMemberTrainings } from "@/lib/actions/training"
import { toast } from "sonner"

interface Props {
  factionSlug: string
  memberId: string
  allTrainings: { id: string, name: string, shortName: string | null }[]
  selectedIds: string[]
}

export function TrainingAssignment({ factionSlug, memberId, allTrainings, selectedIds }: Props) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const toggleTraining = async (trainingId: string) => {
    setLoading(true)
    const isSelected = selectedIds.includes(trainingId)
    const newIds = isSelected 
      ? selectedIds.filter(id => id !== trainingId)
      : [...selectedIds, trainingId]

    try {
      await updateMemberTrainings(factionSlug, memberId, newIds)
      toast.success("Qualifikationen aktualisiert")
    } catch (e) {
      toast.error("Fehler beim Zuweisen")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full h-9 border-dashed flex gap-2">
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
          Zertifikat ausstellen
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          {allTrainings.map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTraining(t.id)}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-slate-100 text-sm ${
                selectedIds.includes(t.id) ? "bg-emerald-50 text-emerald-700" : ""
              }`}
            >
              <span>{t.name} {t.shortName && `(${t.shortName})`}</span>
              {selectedIds.includes(t.id) && <Check className="w-4 h-4" />}
            </div>
          ))}
          {allTrainings.length === 0 && (
            <p className="text-xs text-muted-foreground p-2 text-center italic">Keine Ausbildungen definiert.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}