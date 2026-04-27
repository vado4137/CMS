import { verifyMembership, hasPermission } from "@/lib/dal";
import db from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Trash2 } from "lucide-react";
import { CreateTrainingDialog } from "./_components/CreateTrainingTypeDialog";
import { Button } from "@/components/ui/button";

export default async function TrainingTypesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await verifyMembership(slug);

  if (!hasPermission(member, "MANAGE_TRAININGTYPES")) {
    return <div>Zugriff verweigert.</div>;
  }

  const types = await db.trainingType.findMany({
    where: { faction: { slug } },
    include: { _count: { select: { requests: true } } }
  });

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ausbildungskatalog</h2>
          <p className="text-muted-foreground text-sm">Definiere die verfügbaren Lehrgänge für deine Fraktion.</p>
        </div>
        <CreateTrainingDialog factionSlug={slug} />
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((t) => (
          <Card key={t.id} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold">{t.name}</CardTitle>
              <BookOpen className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                {t.description || "Keine Beschreibung hinterlegt."}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {t._count.requests} Anfragen
                </span>
                {/* Lösch-Funktion könnte hier als kleine Action eingebaut werden */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}