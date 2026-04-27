import { auth } from "@/auth"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react" // Optional: Für ein Icon

export default async function GlobalDashboard() {
  const session = await auth()
  const memberships = (session?.user as any)?.memberships || []
  
  // Prüfen, ob der User Super-Admin Rechte hat
  const isSuperAdmin = (session?.user as any)?.isSuperAdmin === true

  return (
    <div className="container mx-auto p-10 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Charakter-Auswahl</h1>
          <p className="text-muted-foreground mt-2">Wähle eine Identität, um den Dienst anzutreten.</p>
        </div>

        {/* ADMIN-BUTTON: Nur sichtbar für Super-Admins */}
        {isSuperAdmin && (
          <Link href="/admin/factions">
            <Button variant="destructive" className="gap-2">
              <ShieldCheck className="w-4 h-4" />
              Admin-Portal
            </Button>
          </Link>
        )}
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {memberships.map((m: any) => (
          <Card key={m.factionSlug} className="hover:shadow-lg transition-shadow border-2">
            {/* ... Rest der Map-Funktion bleibt gleich ... */}
            <CardHeader>
              <CardTitle className="text-2xl">{m.icName}</CardTitle>
              <CardDescription>{m.factionName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-4">
                <span className="font-semibold text-slate-500">Rang:</span> {m.rankName}
              </div>
              <Link href={`/management/${m.factionSlug}`}>
                <Button className="w-full">Dashboard betreten</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        
        {/* Platzhalter für neue Bewerbungen */}
        <Link href="/dashboard/join">
          <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer h-full group">
            <CardDescription className="group-hover:text-blue-600 transition-colors">
              Möchtest du einer neuen Fraktion beitreten?
            </CardDescription>
            <Button variant="outline" className="mt-4 border-dashed">
              Beitritts-Katalog öffnen
            </Button>
          </Card>
        </Link>
      </div>
    </div>
  )
}