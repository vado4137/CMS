import db from "@/lib/db";
import { verifySettingsAccess } from "@/lib/dal";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteLocation } from "@/lib/actions/location";
import { CreateLocationDialog } from "./_components/CreateLocationDialog";

export default async function LocationsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await verifySettingsAccess(slug);

  const locations = await db.location.findMany({
    where: { faction: { slug } },
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Standorte & Wachen</h2>
          <p className="text-muted-foreground text-sm">Verwalte die physischen Stützpunkte deiner Fraktion.</p>
        </div>
        <CreateLocationDialog factionSlug={slug} />
      </header>

      <div className="grid gap-4">
        {locations.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl text-slate-400 italic">
            Noch keine Standorte hinterlegt.
          </div>
        ) : (
          locations.map((loc) => (
            <Card key={loc.id} className="flex items-center justify-between pr-4 hover:bg-slate-50 transition-colors">
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                <div className="p-2 bg-red-50 rounded-full">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <CardTitle className="text-lg font-semibold">{loc.name}</CardTitle>
              </CardHeader>
              <form action={async () => {
                "use server"
                await deleteLocation(slug, loc.id)
              }}>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </form>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}