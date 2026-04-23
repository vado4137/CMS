// 1. Importiere den neuen Guard/Utility aus deiner DAL
import { verifyMembership } from "@/lib/dal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function FactionDashboard(props: { 
  params: Promise<{ slug: string }> 
}) {
  // 2. Slug aus den Params extrahieren (Next.js 16 Standard)
  const { slug } = await props.params
  
  // 3. Die "Magie": Dieser eine Aufruf prüft die Session, die Berechtigung
  // und lädt den Member inkl. Fraktion und Rang.
  // Wenn etwas nicht passt, leitet er automatisch zum Dashboard um.
  const member = await verifyMembership(slug)

  return (
    <div className="p-8 space-y-6">
      <header className="flex justify-between items-center border-b pb-4">
        <div>
          {/* Beachte: 'faction' kommt jetzt direkt über das 'member'-Objekt */}
          <h1 className="text-3xl font-bold tracking-tight">{member.faction.name} Management</h1>
          <p className="text-muted-foreground">{member.faction.description}</p>
        </div>
        <div className="rounded-full border px-4 py-1 text-lg font-semibold">
          Dienstnummer: {member.badgeNumber}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Dein Charakter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.firstName} {member.lastName}</div>
            <p className="text-xs text-muted-foreground">
              Status: <span className="text-green-600 font-bold">{member.status}</span>
            </p>
            <p className="text-sm mt-2 italic">{member.rank.name}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}