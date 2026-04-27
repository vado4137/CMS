"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { joinTraining } from "@/lib/actions/training"
import { toast } from "sonner"
import { LogIn, Loader2 } from "lucide-react"

export function JoinTrainingButton({ requestId, factionSlug }: { requestId: string, factionSlug: string }) {
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    setLoading(true)
    try {
      await joinTraining(factionSlug, requestId)
      toast.success("Du hast dich für die Ausbildung eingeschrieben!")
    } catch (e: any) {
      toast.error(e.message || "Fehler beim Beitreten")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleJoin} 
      disabled={loading}
      variant="outline"
      size="sm"
      className="gap-2 border-blue-200 hover:bg-blue-50 text-blue-600"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogIn className="w-3 h-3" />}
      Teilnehmen
    </Button>
  )
}