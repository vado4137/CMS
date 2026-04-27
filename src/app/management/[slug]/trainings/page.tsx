import { verifyMembership, hasPermission } from "@/lib/dal";
import db from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { RequestTrainingDialog } from "./_components/RequestTrainingDialog";
import { TrainingStatusDropdown } from "./_components/TrainingStatusDropdown";
import { Users, GraduationCap, User } from "lucide-react";
import { JoinTrainingButton } from "./_components/JoinTrainingButton";

export default async function TrainingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await verifyMembership(slug);

  const requests = await db.trainingRequest.findMany({
    where: { faction: { slug } },
    include: { 
      students: true,       // WICHTIG: Liste der N Schüler laden 
      trainingType: true, 
      instructor: true 
    },
    orderBy: { createdAt: "desc" }
  });

  const types = await db.trainingType.findMany({ where: { faction: { slug } } });
  const canManage = hasPermission(member, "MANAGE_TRAINING") || hasPermission(member, "ACCEPT_TRAINING");

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Ausbildungszentrum</h1>
          <p className="text-slate-500">Verwalte Anfragen und offene Lehrgangsangebote des SAFD.</p>
        </div>
        {hasPermission(member, "VIEW_TRAINING") && (
          <RequestTrainingDialog factionSlug={slug} trainingTypes={types} />
        )}
      </header>

      <div className="grid gap-4">
        {requests.map((req) => {
          // Ein Training ist ein "Offenes Angebot" (Kalender), wenn ein Instructor 
          // es erstellt hat, aber noch kein spezifischer Einzelschüler (1-zu-1) feststand.
          const isCalendarOffer = !!req.scheduledDate; 
          const isAlreadyStudent = req.students.some(s => s.id === member.id);

          return (
            <div key={req.id} className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isCalendarOffer ? 'bg-blue-100 text-blue-600' : 'bg-slate-100'}`}>
                  {isCalendarOffer ? <Users className="w-5 h-5" /> : <User className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <p className="font-bold flex items-center gap-2">
                    {req.trainingType.name}
                    {isCalendarOffer && <Badge className="bg-blue-500 hover:bg-blue-600 text-[9px] h-4 uppercase">Kalender-Angebot</Badge>}
                  </p>
                  <div className="text-xs text-slate-500">
                    {req.students.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="font-medium mr-1">Teilnehmer:</span>
                        {req.students.map((s, idx) => (
                          <span key={s.id}>{s.firstName} {s.lastName}{idx < req.students.length - 1 ? ',' : ''}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-blue-600 font-medium italic">Noch keine Teilnehmer eingetragen</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Teilnehmen-Button: Erscheint bei offenen Angeboten, wenn man nicht selbst Ausbilder oder schon Schüler ist */}
                {isCalendarOffer && !isAlreadyStudent && req.instructorId !== member.id && req.status === "OFFEN" && (
                   <JoinTrainingButton requestId={req.id} factionSlug={slug} />
                )}

                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                  {canManage ? (
                    <TrainingStatusDropdown 
                      factionSlug={slug} 
                      request={req} // GEFIXED: Wir übergeben das ganze Objekt für den Finish-Dialog 
                      currentStatus={req.status} 
                    />
                  ) : (
                    <Badge variant="secondary" className="uppercase text-[10px]">{req.status}</Badge>
                  )}
                </div>
                
                <div className="text-right min-w-[140px]">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Ausbilder</p>
                  <p className="text-xs font-medium flex items-center justify-end gap-1">
                    <GraduationCap className="w-3 h-3 text-slate-400" />
                    {req.instructor ? `${req.instructor.firstName} ${req.instructor.lastName}` : <span className="text-orange-500 italic">Gesucht</span>}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        
        {requests.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-2xl text-slate-400 italic">
            Aktuell liegen keine Ausbildungsanfragen oder Angebote vor.
          </div>
        )}
      </div>
    </div>
  );
}