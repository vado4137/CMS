"use client"

import { useState } from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { updateMemberRank } from "@/lib/actions/member"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Props {
  factionSlug: string
  memberId: string
  currentRankId: string
  availableRanks: { id: string, name: string, level: number }[]
}

export function PromotionDropdown({ factionSlug, memberId, currentRankId, availableRanks }: Props) {
  const [loading, setLoading] = useState(false)

  const handleRankChange = async (newRankId: string) => {
    if (newRankId === currentRankId) return
    
    setLoading(true)
    try {
      const res = await updateMemberRank(factionSlug, memberId, newRankId)
      if (res.success) {
        toast.success("Rang erfolgreich aktualisiert")
      }
    } catch (error) {
      toast.error("Fehler bei der Beförderung")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
      <Select onValueChange={handleRankChange} defaultValue={currentRankId} disabled={loading}>
        <SelectTrigger className="w-[180px] h-8 text-xs">
          <SelectValue placeholder="Rang wählen" />
        </SelectTrigger>
        <SelectContent>
          {availableRanks.map((rank) => (
            <SelectItem key={rank.id} value={rank.id} className="text-xs">
              Lvl {rank.level}: {rank.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}