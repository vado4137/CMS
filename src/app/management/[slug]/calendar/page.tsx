import { verifyMembership, hasPermission } from "@/lib/dal";
import { Calendar } from "@/components/ui/calendar";
import db from "@/lib/db";
import { InteractiveCalendarView } from "./_components/InteractiveCalendarView";

export default async function CalendarPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const member = await verifyMembership(slug);
    
    // Ausbilder-Check: Darf er Ausbildungen verwalten?
    const isInstructor = hasPermission(member, "ACCEPT_TRAINING") || hasPermission(member, "MANAGE_TRAINING");
  
    // Daten für den Ausbilder-Dialog laden
    const [allAbsences, allMembers, allTypes] = await Promise.all([
      db.absence.findMany({ where: { member: { faction: { slug } } }, include: { member: { include: { rank: true } } } }),
      db.member.findMany({ where: { faction: { slug } }, orderBy: { lastName: "asc" } }),
      db.trainingType.findMany({ where: { faction: { slug } } })
    ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black">Fraktions-Kalender</h1>
        <p className="text-slate-500 text-sm">Klicke auf einen Tag, um eine Aktion auszuführen.</p>
      </header>

      <InteractiveCalendarView 
        factionSlug={slug}
        canManageTrainings={isInstructor} // Permission angepasst
        absences={allAbsences}
        members={allMembers}       // Neu: Liste der Officer
        trainingTypes={allTypes}   // Neu: Liste der Typen
      />
    </div>
  );
}