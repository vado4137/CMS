import { auth } from "@/auth"
import { redirect } from "next/navigation"
import db from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function OnboardingPage() {
  const session = await auth()

  // 1. Security Check: Nur für eingeloggte User
  if (!session?.user) redirect("/api/auth/signin")

  // 2. Falls der User schon Member ist, schick ihn ins Dashboard
  // (In einem echten Multi-Faction-System würde man hier eine Auswahl zeigen)
  const existingMember = await db.member.findFirst({
    where: { userId: session.user.id }
  })
  
  if (existingMember) redirect("/dashboard")

  // 3. Server Action für den Form-Submit
  async function createCharacter(formData: FormData) {
    "use server"
    const session = await auth()
    if (!session?.user?.id) return

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const badgeNumber = parseInt(formData.get("badgeNumber") as string)

    // Für den ersten Test suchen wir uns die erste verfügbare Fraktion (LSPD)
    // und den ersten verfügbaren Rang
    const faction = await db.faction.findFirst()
    const rank = await db.rank.findFirst({ where: { factionId: faction?.id } })

    if (faction && rank) {
      await db.member.create({
        data: {
          userId: session.user.id,
          factionId: faction.id,
          rankId: rank.id,
          firstName,
          lastName,
          badgeNumber,
          status: "ACTIVE"
        }
      })
      redirect(`/management/${faction.slug}`)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Charakter-Erstellung</CardTitle>
          <CardDescription>
            Verknüpfe deine Discord-Identität mit deinem IC-Charakter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCharacter} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname</Label>
                <Input id="firstName" name="firstName" placeholder="Max" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname</Label>
                <Input id="lastName" name="lastName" placeholder="Mustermann" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="badgeNumber">Dienstnummer</Label>
              <Input id="badgeNumber" name="badgeNumber" type="number" placeholder="z.B. 42" required />
            </div>
            <Button type="submit" className="w-full">Dienst antreten</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}