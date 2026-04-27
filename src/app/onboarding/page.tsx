import { auth } from "@/auth"
import { redirect } from "next/navigation"
import db from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { SubmitButton } from "./_components/SubmitButton"

export default async function OnboardingPage(props: { 
  searchParams: Promise<{ error?: string }> 
}) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;
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
  
    // 1. Die Fraktion festlegen (Standardmäßig SAFD)
    const faction = await db.faction.findFirst({ where: { slug: "safd" } })
    if (!faction) return // Fehlerbehandlung falls keine Faction existiert
  
    // 2. VALIDIERUNG: Prüfen, ob die Dienstnummer bereits vergeben ist
    const badgeExists = await db.member.findFirst({
      where: {
        factionId: faction.id,
        badgeNumber: badgeNumber
      }
    })
  
    if (badgeExists) {
      // In einer einfachen Server Action können wir hier eine Fehlermeldung loggen
      // oder den User mit einem Fehler-Parameter zurückschicken
      console.error("Dienstnummer bereits vergeben!")
      return redirect("/onboarding?error=badge_taken")
    }
  
    // 3. RANG-CHECK: Den niedrigsten Rang (Level 0) finden
    const startRank = await db.rank.findFirst({ 
      where: { 
        factionId: faction.id,
        level: 0 
      },
      orderBy: { level: 'asc' }
    })
  
    if (faction && startRank) {
      await db.member.create({
        data: {
          userId: session.user.id,
          factionId: faction.id,
          rankId: startRank.id,
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
        {error === "badge_taken" && (
            <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Fehler</AlertTitle>
              <AlertDescription>
                Diese Dienstnummer ist bereits an einen anderen Officer vergeben.
              </AlertDescription>
            </Alert>
          )}
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

            {/* HIER DEN ALTEN BUTTON DURCH DIE NEUE KOMPONENTE ERSETZEN */}
            <SubmitButton /> 
          </form>
        </CardContent>
      </Card>
    </div>
  )
}