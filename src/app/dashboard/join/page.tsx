import { auth } from "@/auth"
import db from "@/lib/db"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { JoinFactionDialog } from "./_components/joinFactionDialog"

export default async function JoinFactionPage() {
  const session = await auth()
  const userId = session?.user?.id

  // 1. Hole alle Fraktionen, bei denen der User noch NICHT Mitglied ist
  // und die Recruiting auf "true" haben
  const availableFactions = await db.faction.findMany({
    where: {
      isRecruiting: true,
      members: {
        none: { userId: userId }
      }
    }
  })

  return (
    <div className="container mx-auto p-10 space-y-8">
      <Link href="/dashboard" className="flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Zurück zur Auswahl
      </Link>
      
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">Fraktion beitreten</h1>
        <p className="text-muted-foreground mt-2">Wähle eine Organisation, der du beitreten möchtest.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableFactions.map((f) => (
          <Card key={f.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{f.name}</CardTitle>
              <CardDescription className="line-clamp-2">{f.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <JoinFactionDialog faction={f} />
            </CardContent>
          </Card>
        ))}
        
        {availableFactions.length === 0 && (
          <p className="col-span-full text-center py-20 text-slate-400 italic">
            Aktuell suchen keine weiteren Fraktionen neue Mitglieder.
          </p>
        )}
      </div>
    </div>
  )
}