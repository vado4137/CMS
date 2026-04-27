import { auth } from "@/auth"
import { redirect } from "next/navigation"
import db from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SubmitButton } from "./_components/SubmitButton"
import { onboardingAction } from "@/lib/actions/faction"

export default async function OnboardingPage(props: { 
  searchParams: Promise<{ error?: string }> 
}) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;
  const session = await auth()

  if (!session?.user) redirect("/api/auth/signin")

  const existingMember = await db.member.findFirst({
    where: { userId: session.user.id }
  })
  
  if (existingMember) redirect("/dashboard")

  // NEU: Lade alle Fraktionen, die aktuell rekrutieren 
  const availableFactions = await db.faction.findMany({
    where: { isRecruiting: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Charakter-Erstellung</CardTitle>
          <CardDescription>
            Wähle deine Fraktion und erstelle deine IC-Identität.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error === "badge_taken" && (
            <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Fehler</AlertTitle>
              <AlertDescription>
                Diese Dienstnummer ist in dieser Fraktion bereits vergeben.
              </AlertDescription>
            </Alert>
          )}

          <form action={onboardingAction} className="space-y-4">
            {/* NEU: Fraktions-Auswahl */}
            <div className="space-y-2">
              <Label htmlFor="factionId">Fraktion wählen</Label>
              <Select name="factionId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Bitte wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {availableFactions.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}