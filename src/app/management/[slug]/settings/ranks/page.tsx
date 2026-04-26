import db from "@/lib/db"
import { verifySettingsAccess } from "@/lib/dal"
import { PermissionMatrix } from "./_components/PermissionMatrix"
import { CreateRankDialog } from "./_components/CreateRankDialog" // Importieren
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function RanksSettingsPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  await verifySettingsAccess(slug)

  const ranks = await db.rank.findMany({
    where: { faction: { slug } },
    orderBy: { level: "desc" }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Ränge & Hierarchie</h2>
          <p className="text-muted-foreground text-sm">Verwalte die Rechte der verschiedenen Dienstgrade.</p>
        </div>
        {/* HIER DEN DIALOG EINFÜGEN */}
        <CreateRankDialog factionSlug={slug} />
      </div>

      <Tabs defaultValue={ranks[0]?.id} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto bg-slate-100 p-1">
          {ranks.map(rank => (
            <TabsTrigger key={rank.id} value={rank.id}>
              Lvl {rank.level}: {rank.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {ranks.map(rank => (
          <TabsContent key={rank.id} value={rank.id} className="mt-6">
            <PermissionMatrix factionSlug={slug} rank={rank} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}