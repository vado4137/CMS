import db from "@/lib/db";
import { verifyMembership } from "@/lib/dal";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { RankBadge } from "@/components/shared/RankBadge";
import { PromotionDropdown } from "../_components/PromotionDropdown";
import { DepartmentAssignment } from "../_components/DepartmentAssignment";
import { Badge } from "@/components/ui/badge";
import { Calendar, Shield, Briefcase, FileText,GraduationCap } from "lucide-react";
import { ServiceNotesForm } from "./_components/ServiceNotesForm";
import { LocationSelection } from "./_components/LocationSelection";
import { TrainingAssignment } from "./_components/TrainingAssignment";

export default async function MemberDetailPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  const { slug, id } = await params;
  await verifyMembership(slug);

  const member = await db.member.findUnique({
    where: { id },
    include: { 
      rank: true, 
      user: true, 
      departments: true, 
      location: true, // Falls du das vorhin eingebaut hast
      trainings: true  // <--- DAS HIER FEHLT!
    }
  });

  if (!member) return notFound();

  const availableRanks = await db.rank.findMany({
    where: { faction: { slug } },
    orderBy: { level: "asc" }
  });

  const allDepartments = await db.department.findMany({
    where: { faction: { slug } }
  });

  const locations = await db.location.findMany({
    where: { faction: { slug } },
    orderBy: { name: "asc" }
  });

  const allTrainings = await db.training.findMany({
    where: { faction: { slug } },
    orderBy: { name: "asc" }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl border shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-500/20">
            {member.firstName[0]}{member.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight">{member.firstName} {member.lastName}</h1>
              <Badge className={member.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"}>
                {member.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <RankBadge name={member.rank.name} level={member.rank.level} />
              <span className="text-slate-300">|</span>
              <span className="text-sm font-mono font-bold text-blue-600">Badge #{member.badgeNumber || "---"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LINKS: STAMMDATEN & HIERARCHIE */}
        <div className="lg:col-span-1 space-y-8">
            <Card className="border-none shadow-md">
                <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" /> Dienststellung
                </CardTitle>
                <CardDescription>Verwalte Rang und Beförderungen.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                {/* Rang-Auswahl */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Aktueller Rang</label>
                    <PromotionDropdown 
                    factionSlug={slug} 
                    memberId={member.id} 
                    currentRankId={member.rankId} 
                    availableRanks={availableRanks} 
                    />
                </div>

                {/* --- HIER NEU: Standort-Auswahl --- */}
                <LocationSelection 
                    factionSlug={slug}
                    memberId={member.id}
                    currentLocationId={member.locationId}
                    locations={locations}
                />

                {/* Badge-Nummer */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Badge Nummer</label>
                    <p className="text-sm font-mono font-bold">#{member.badgeNumber || "Nicht zugewiesen"}</p>
                </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" /> Qualifikationen
                    </CardTitle>
                    <CardDescription>Zertifikate und absolvierte Ausbildungen.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                    {member.trainings.length > 0 ? (
                        member.trainings.map(t => (
                        <Badge key={t.id} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {t.shortName || t.name}
                        </Badge>
                        ))
                    ) : (
                        <p className="text-xs text-slate-400 italic">Keine Zertifikate hinterlegt.</p>
                    )}
                    </div>
                    
                    {/* Wir nutzen hier ein ähnliches Assignment-Tool wie bei Departments */}
                    <TrainingAssignment 
                    factionSlug={slug}
                    memberId={member.id}
                    allTrainings={allTrainings}
                    selectedIds={member.trainings.map(t => t.id)}
                    />
                </CardContent>
                </Card>

          {/* Sektion 3: Spezialisierung */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" /> Spezialisierung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {member.departments.map(d => (
                  <Badge key={d.id} variant="secondary" className="bg-slate-100 text-slate-700">
                    {d.name}
                  </Badge>
                ))}
              </div>
              <DepartmentAssignment 
                factionSlug={slug}
                memberId={member.id}
                allDepartments={allDepartments}
                selectedIds={member.departments.map(d => d.id)}
              />
            </CardContent>
          </Card>
        </div>

        {/* RECHTS: DIENSTAKTE (NOTIZEN) */}
        <div className="lg:col-span-2">
          <Card className="h-full border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> Digitale Dienstakte
              </CardTitle>
              <CardDescription>Interne Vermerke, Lob, Tadel und Disziplinarmaßnahmen.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Sektion 4: Dienstakte Formular */}
              <ServiceNotesForm 
                factionSlug={slug}
                memberId={member.id}
                initialNotes={member.notes || ""}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}