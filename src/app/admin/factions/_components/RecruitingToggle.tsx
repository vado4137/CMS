"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toggleRecruiting } from "@/lib/actions/faction"
import { toast } from "sonner"

export function RecruitingToggle({ factionId, initialStatus }: { factionId: string, initialStatus: boolean }) {
  const [enabled, setEnabled] = useState(initialStatus)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    const result = await toggleRecruiting(factionId, enabled)
    
    if (result.success) {
      setEnabled(!enabled)
      toast.success("Status aktualisiert")
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        checked={enabled} 
        onCheckedChange={handleToggle} 
        disabled={loading} 
      />
      <Label className="text-xs font-medium">
        {enabled ? "Bewerbungen OFFEN" : "Bewerbungen ZU"}
      </Label>
    </div>
  )
}