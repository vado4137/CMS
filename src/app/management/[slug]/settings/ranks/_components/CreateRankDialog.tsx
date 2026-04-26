"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createRank } from "@/lib/actions/rank"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export function CreateRankDialog({ factionSlug }: { factionSlug: string }) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string
    const level = parseInt(formData.get("level") as string)

    const res = await createRank(factionSlug, name, level)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Rang erstellt!")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Rang hinzufügen</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neuen Dienstgrad erschaffen</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name des Rangs</Label>
            <Input name="name" placeholder="z.B. Sergeant" required />
          </div>
          <div className="space-y-2">
            <Label>Hierarchie-Level (0-100)</Label>
            <Input name="level" type="number" placeholder="Höher = Mächtiger" required />
          </div>
          <Button type="submit" className="w-full">Erstellen</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}