import { ensureSuperAdmin } from "@/lib/admin-check"
import db from "@/lib/db"
import { CreateFactionForm } from "./_components/CreateFactionForm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button" // Button importieren
import Link from "next/link" // Link importieren
import { Edit3, Settings } from "lucide-react" // Optional: Icon
import { revalidatePath } from "next/cache"
import { RecruitingToggle } from "./_components/RecruitingToggle"
import { EditFactionDialog } from "./_components/EditFactionDialog"
import { DeleteFactionButton } from "./_components/AlertDialog"

export default async function FactionAdminPage() {
  await ensureSuperAdmin()

  const factions = await db.faction.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="container mx-auto p-10 space-y-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase">Faction Creator</h1>
          <p className="text-muted-foreground">Erstelle und verwalte die Behörden des Portals.</p>
        </div>

        <Link href="/admin/settings/discord">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Neue Fraktion</h2>
          <CreateFactionForm />
        </div>

        <div className="lg:col-span-2">
        <h2 className="text-xl font-bold mb-4">Fraktionen ({factions.length})</h2>
        <div className="grid sm:grid-cols-2 gap-4">
        {factions.map((f) => (
        <Card key={f.id} className="flex flex-col justify-between">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{f.name}</CardTitle>
                <code className="text-xs text-blue-600">/{f.slug}</code>
              </div>
              
              {/* AKTIONEN: Edit, Delete und Recruiting */}
              <div className="flex items-center gap-2">
                <EditFactionDialog faction={f} />
                <DeleteFactionButton id={f.id} name={f.name} />
                <div className="h-4 w-[1px] bg-slate-200 mx-1" /> {/* Kleiner Trenner */}
                <RecruitingToggle factionId={f.id} initialStatus={f.isRecruiting} />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-0">
            <Link href={`/admin/factions/${f.id}/edit`}>
              <Button variant="outline" size="sm" className="w-full gap-2 text-[10px] uppercase font-bold">
                <Edit3 className="w-3 h-3" />
                Landingpage & Content
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export async function toggleRecruiting(factionId: string, currentStatus: boolean) {
  await ensureSuperAdmin();
  
  await db.faction.update({
    where: { id: factionId },
    data: { isRecruiting: !currentStatus }
  });
  
  revalidatePath("/"); // Startseite aktualisieren
  revalidatePath("/admin/factions");
}