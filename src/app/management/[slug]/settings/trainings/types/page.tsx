import { verifyMembership, hasPermission } from "@/lib/dal";
import db from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, UserCheck, ShieldCheck } from "lucide-react";
import { ManageInstructorsDialog } from "./_components/ManageInstructorsDialog";
import { Badge } from "@/components/ui/badge";
import { CreateTrainingTypeDialog } from "./_components/CreateTrainingTypeDialog";

export default async function TrainingTypesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await verifyMembership(slug);

  // Wir laden die Typen inklusive der aktuell berechtigten Ausbilder
  const [types, allMembers] = await Promise.all([
    db.trainingType.findMany({
      where: { faction: { slug } },
      include: { authorizedInstructors: true }
    }),
    db.member.findMany({
      where: { faction: { slug }, status: "ACTIVE" }, // [cite: 19]
      orderBy: { lastName: "asc" }
    })
  ]);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ausbildungskatalog</h2>
          <p className="text-muted-foreground text-sm">Lehrgänge definieren und Ausbilder qualifizieren.</p>
        </div>
        {<CreateTrainingTypeDialog factionSlug={slug} />}
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        {types.map((t) => (
          <Card key={t.id} className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                {t.name}
              </CardTitle>
              <ManageInstructorsDialog 
                factionSlug={slug} 
                trainingType={t} 
                allMembers={allMembers} 
              />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-6">{t.description || "Keine Beschreibung."}</p>
              
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Qualifizierte Ausbilder
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {t.authorizedInstructors.map(inst => (
                    <Badge key={inst.id} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 py-0 text-[10px]">
                      {inst.firstName} {inst.lastName}
                    </Badge>
                  ))}
                  {t.authorizedInstructors.length === 0 && (
                    <span className="text-[10px] text-slate-400 italic">Noch keine Ausbilder zugewiesen</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

