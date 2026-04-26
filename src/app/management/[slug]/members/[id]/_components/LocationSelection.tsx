"use client"

import { useState } from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { updateMemberDetails } from "@/lib/actions/member"
import { toast } from "sonner"
import { MapPin, Loader2 } from "lucide-react"

interface Props {
  factionSlug: string
  memberId: string
  currentLocationId: string | null
  locations: { id: string, name: string }[]
}

// WICHTIG: Das "export" muss hier stehen!
export function LocationSelection({ factionSlug, memberId, currentLocationId, locations }: Props) {
  const [loading, setLoading] = useState(false)

  const handleLocationChange = async (newLocationId: string) => {
    if (newLocationId === currentLocationId) return
    
    setLoading(true)
    try {
      const res = await updateMemberDetails(factionSlug, memberId, { locationId: newLocationId })
      if (res.success) {
        toast.success("Standort erfolgreich zugewiesen")
      }
    } catch (e) {
      toast.error("Fehler beim Zuweisen des Standorts")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
        <MapPin className="w-3 h-3" /> Stationierung
      </label>
      <div className="relative">
        <Select 
          onValueChange={handleLocationChange} 
          defaultValue={currentLocationId || undefined} 
          disabled={loading}
        >
          <SelectTrigger className="w-full h-9 bg-slate-50 border-none shadow-none text-sm">
            <SelectValue placeholder="Wache auswählen..." />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loading && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
          </div>
        )}
      </div>
    </div>
  )
}