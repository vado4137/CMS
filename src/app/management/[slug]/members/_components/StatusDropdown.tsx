"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateMemberStatus } from "@/lib/actions/member"
import { toast } from "sonner"

export function StatusDropdown({ factionSlug, memberId, currentStatus }: { factionSlug: string, memberId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false)

  const handleChange = async (newStatus: string) => {
    setLoading(true)
    try {
      await updateMemberStatus(factionSlug, memberId, newStatus)
      toast.success("Status aktualisiert")
    } catch (e) {
      toast.error("Fehler beim Status-Update")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Select onValueChange={handleChange} defaultValue={currentStatus} disabled={loading}>
      <SelectTrigger className="w-[130px] h-8 text-[10px] uppercase font-bold">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ACTIVE" className="text-emerald-600 font-bold">Aktiv</SelectItem>
        <SelectItem value="VACATION" className="text-blue-600 font-bold">Urlaub</SelectItem>
        <SelectItem value="SUSPENDED" className="text-red-600 font-bold">Suspendiert</SelectItem>
      </SelectContent>
    </Select>
  )
}