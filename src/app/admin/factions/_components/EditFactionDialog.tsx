"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateFaction } from "@/lib/actions/faction"
import { toast } from "sonner"
import { Edit2, Loader2 } from "lucide-react"

export function EditFactionDialog({ faction }: { faction: any }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string

    try {
      await updateFaction(faction.id, { name, slug })
      toast.success("Fraktion aktualisiert")
      setOpen(false)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fraktion bearbeiten</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input name="name" defaultValue={faction.name} required />
          </div>
          <div className="space-y-2">
            <Label>Slug (URL Kürzel)</Label>
            <Input name="slug" defaultValue={faction.slug} required />
          </div>
          <Button type="submit" className="w-full bg-blue-600" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Speichern"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}