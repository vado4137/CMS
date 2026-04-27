"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { joinFaction } from "@/lib/actions/faction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2, UserPlus } from "lucide-react"

export function JoinFactionDialog({ faction }: { faction: any }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const badgeNumber = parseInt(formData.get("badgeNumber") as string);

    try {
      // Wir rufen die Server Action mit den IC-Namen auf
      const result = await joinFaction(faction.id, { firstName, lastName, badgeNumber });
      
      if (result.success) {
        toast.success(`Willkommen beim ${faction.name}!`)
        setOpen(false)
        router.push(`/management/${faction.slug}`) // Direkt zum neuen Dashboard
      }
    } catch (e: any) {
      toast.error(e.message || "Fehler beim Beitritt")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2">
          <UserPlus className="w-4 h-4" />
          Jetzt beitreten
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Beitritt: {faction.name}</DialogTitle>
          <DialogDescription>
            Gib deinen In-Character Namen an, um den Dienst als Rekrut anzutreten.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Vorname</Label>
              <Input 
                id="firstName" 
                name="firstName" 
                placeholder="z.B. Max" 
                required 
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname</Label>
              <Input 
                id="lastName" 
                name="lastName" 
                placeholder="z.B. Mustermann" 
                required 
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="badgeNumber">Dienstnummer (Badge)</Label>
                <Input 
                    id="badgeNumber" 
                    name="badgeNumber" 
                    type="number" // Nur Zahlen erlauben
                    placeholder="z.B. 42" 
                    required 
                    disabled={loading}
                />
                </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-[10px] text-blue-700 leading-tight">
              <b>Hinweis:</b> Mit dem Beitritt wirst du automatisch als 
              <b> Rekrut (Rang 0)</b> eingestuft.
            </p>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Verarbeitung...
              </>
            ) : (
              "Mitgliedschaft bestätigen"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}