"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deleteOwnTrainingRequest } from "@/lib/actions/training"
import { toast } from "sonner"
import { Loader2, Trash2 } from "lucide-react"

export function DeleteOwnTrainingButton({ requestId, factionSlug }: { requestId: string; factionSlug: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteOwnTrainingRequest(factionSlug, requestId)
      toast.success("Deine Ausbildungsanfrage wurde gelöscht.")
    } catch (error: any) {
      toast.error(error?.message || "Löschen fehlgeschlagen.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDelete}
      disabled={loading}
      variant="outline"
      size="sm"
      className="gap-2 border-red-200 hover:bg-red-50 text-red-600"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
      Löschen
    </Button>
  )
}

