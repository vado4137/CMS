"use client"

import * as React from "react"
import { Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { updateMemberDepartments } from "@/lib/actions/member"
import { toast } from "sonner"

interface Props {
  factionSlug: string
  memberId: string
  allDepartments: { id: string, name: string, shortName: string | null }[]
  selectedIds: string[]
}

export function DepartmentAssignment({ factionSlug, memberId, allDepartments, selectedIds }: Props) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const toggleDept = async (deptId: string) => {
    setLoading(true)
    const isSelected = selectedIds.includes(deptId)
    const newIds = isSelected 
      ? selectedIds.filter(id => id !== deptId)
      : [...selectedIds, deptId]

    try {
      await updateMemberDepartments(factionSlug, memberId, newIds)
      toast.success("Abteilung aktualisiert")
    } catch (e) {
      toast.error("Fehler beim Zuweisen")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed flex gap-1">
          <Plus className="w-3 h-3" />
          {selectedIds.length === 0 ? "Zuweisen" : `${selectedIds.length} Abteilungen`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start" side="bottom">
        <div className="space-y-1">
          {allDepartments.map((dept) => (
            <div
              key={dept.id}
              onClick={() => toggleDept(dept.id)}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-slate-100 text-sm ${
                selectedIds.includes(dept.id) ? "bg-blue-50 text-blue-700" : ""
              }`}
            >
              <span>{dept.name} {dept.shortName && `(${dept.shortName})`}</span>
              {selectedIds.includes(dept.id) && <Check className="w-4 h-4" />}
            </div>
          ))}
          {allDepartments.length === 0 && (
            <p className="text-xs text-muted-foreground p-2 text-center italic">
              Keine Abteilungen angelegt.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}