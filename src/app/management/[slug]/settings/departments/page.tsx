import db from "@/lib/db";
import { verifySettingsAccess } from "@/lib/dal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building2, Users } from "lucide-react";
import { CreateDepartmentDialog } from "./_components/CreateDepartmentDialog";

export default async function DepartmentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await verifySettingsAccess(slug);

  const departments = await db.department.findMany({
    where: { faction: { slug } },
    include: { 
      _count: { select: { members: true } } 
    }
  });

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Abteilungen</h2>
          <p className="text-muted-foreground text-sm">Strukturiere deine Fraktion in Fachbereiche.</p>
        </div>
        <CreateDepartmentDialog factionSlug={slug} />
      </header>

      {departments.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="font-medium text-slate-400">Noch keine Abteilungen vorhanden.</h3>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {departments.map((dep) => (
            <Card key={dep.id} className="hover:border-blue-400 transition-colors shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{dep.name}</CardTitle>
                      {dep.shortName && (
                        <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded uppercase text-slate-500">
                          {dep.shortName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{dep._count.members} Mitglieder zugewiesen</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}