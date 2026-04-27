import db from "@/lib/db";
import { verifyMembership } from "@/lib/dal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default async function AbsenceOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await verifyMembership(slug);

  const activeAbsences = await db.absence.findMany({
    where: { 
      member: { faction: { slug } },
      endDate: { gte: new Date() } // Nur zukünftige oder laufende Abwesenheiten
    },
    include: { member: { include: { rank: true } } },
    orderBy: { startDate: "asc" }
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">Abwesenheitsliste</h1>
        <p className="text-slate-500">Aktuelle und geplante Abmeldungen der Belegschaft.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeAbsences.map((abs) => (
          <Card key={abs.id} className="border-none shadow-sm bg-white overflow-hidden">
            <div className="h-2 bg-blue-500" />
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{abs.member.firstName} {abs.member.lastName}</p>
                  <p className="text-[10px] uppercase text-blue-600 font-bold">{abs.member.rank.name}</p>
                </div>
                <Badge variant="secondary" className="text-[9px]">
                  {format(abs.startDate, "dd.MM.")} - {format(abs.endDate, "dd.MM.")}
                </Badge>
              </div>
              {abs.reason && (
                <p className="mt-3 text-xs text-slate-500 italic border-t pt-2">
                  "{abs.reason}"
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        {activeAbsences.length === 0 && (
          <p className="text-sm text-slate-400 italic">Aktuell sind alle Officer einsatzbereit.</p>
        )}
      </div>
    </div>
  );
}