"use client"

import { Button } from "@/components/ui/button"
import { deleteFaction } from "@/lib/actions/faction"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export function DeleteFactionButton({ id, name }: { id: string, name: string }) {
  async function handleDelete() {
    if (!confirm(`Möchtest du die Fraktion "${name}" wirklich löschen?`)) return

    try {
      await deleteFaction(id)
      toast.success("Fraktion gelöscht")
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete}
      className="h-8 w-8 text-slate-400 hover:text-red-600"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}