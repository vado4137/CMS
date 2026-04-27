import { verifyMembership, hasPermission } from "@/lib/dal";
import db from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { RequestTrainingDialog } from "./_components/RequestTrainingDialog";
import { TrainingStatusDropdown } from "./_components/TrainingStatusDropdown";
import { Users, GraduationCap } from "lucide-react"; // Icons hinzufügen
// import { JoinTrainingButton } from "./_components/JoinTrainingButton"; // Falls du den Button schon hast

export default async function TrainingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await verifyMembership(slug);

  const requests = await db.trainingRequest.findMany({
    where: { faction: { slug } },
    include: { 
      member: true, 
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
          <p className="text-slate-500">Verwalte Anfragen und Zertifizierungen des SAFD.</p>
        </div>
        {hasPermission(member, "VIEW_TRAINING") && (
          <RequestTrainingDialog factionSlug={slug} trainingTypes={types} />
        )}
      </header>

      <div className="grid gap-4">
        {requests.map((req) => {
          const isOpen = !req.member; // Check ob es ein offenes Angebot ist

          return (
            <div key={req.id} className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-slate-100'}`}>
                  {req.member ? (
                    `${req.member.firstName[0]}${req.member.lastName[0]}`
                  ) : (
                    <Users className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-bold flex items-center gap-2">
                    {req.trainingType.name}
                    {isOpen && <Badge className="bg-blue-500 hover:bg-blue-600 text-[9px] h-4 uppercase">Angebot</Badge>}
                  </p>
                  <p className="text-xs text-slate-500">
                    {req.member ? (
                      `Anwärter: ${req.member.firstName} ${req.member.lastName}`
                    ) : (
                      <span className="text-blue-600 font-medium">Noch kein Teilnehmer eingetragen</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Teilnehmen-Button für normale Officer, wenn das Training offen ist */}
                {isOpen && req.memberId !== member.id && req.instructorId !== member.id && (
                   <div className="text-xs italic text-slate-400">Hier "Teilnehmen"-Logik einfügen</div>
                   // <JoinTrainingButton requestId={req.id} factionSlug={slug} />
                )}

                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                  {canManage ? (
                    <TrainingStatusDropdown 
                      factionSlug={slug} 
                      requestId={req.id} 
                      currentStatus={req.status} 
                    />
                  ) : (
                    <Badge variant="secondary" className="uppercase text-[10px]">{req.status}</Badge>
                  )}
                </div>
                
                <div className="text-right min-w-[120px]">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Ausbilder</p>
                  <p className="text-xs font-medium flex items-center justify-end gap-1">
                    <GraduationCap className="w-3 h-3 text-slate-400" />
                    {req.instructor ? `${req.instructor.firstName} ${req.instructor.lastName}` : "Gesucht"}
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