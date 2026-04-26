import db from "@/lib/db";
import { verifySettingsAccess } from "@/lib/dal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap, Award } from "lucide-react";
import { CreateTrainingDialog } from "./_components/CreateTrainingDialog";

export default async function TrainingsSettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await verifySettingsAccess(slug);

  const trainings = await db.training.findMany({
    where: { faction: { slug } },
    include: { _count: { select: { members: true } } }
  });

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ausbildungskatalog</h2>
          <p className="text-muted-foreground text-sm">Definiere Zertifikate und Lehrgänge für deine Fraktion.</p>
        </div>
        <CreateTrainingDialog factionSlug={slug} />
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainings.map((t) => (
          <Card key={t.id} className="hover:border-emerald-400 transition-colors shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  {t.shortName && <span className="text-[10px] font-mono text-slate-400 uppercase">{t.shortName}</span>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{t._count.members} Officer zertifiziert</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}