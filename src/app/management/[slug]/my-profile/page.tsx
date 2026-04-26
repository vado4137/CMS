import { verifyMembership } from "@/lib/dal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RankBadge } from "@/components/shared/RankBadge";
import { Badge } from "@/components/ui/badge";
import { 
  IdCard, 
  CalendarDays, 
  Award, 
  Building, 
  Clock,
  History
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export default async function MyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Lädt den aktuell eingeloggten Member inkl. aller Relationen
  const member = await verifyMembership(slug);

  // Berechnung der Dienstzeit
  const serviceTime = formatDistanceToNow(new Date(member.createdAt), { 
    locale: de,
    addSuffix: false 
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Mein Dienstprofil</h1>
        <p className="text-muted-foreground">Deine persönliche digitale Identität im {slug.toUpperCase()}.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LINKS: Die Digitale ID-Card (Phase 4.2.1) */}
        <div className="md:col-span-5">
          <Card className="relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white min-h-[400px] flex flex-col justify-between">
            {/* Dekoratives Hintergrund-Icon */}
            <IdCard className="absolute -right-10 -top-10 w-64 h-64 opacity-5 rotate-12" />
            
            <CardHeader className="relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                    San Andreas State
                  </p>
                  <CardTitle className="text-xl font-black uppercase italic tracking-tighter">
                    {member.faction.name}
                  </CardTitle>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                   <Building className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-600 border-2 border-white/20 shadow-inner flex items-center justify-center text-5xl font-black">
                {member.firstName[0]}{member.lastName[0]}
              </div>
              
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">
                  {member.firstName} {member.lastName}
                </h2>
                <div className="flex items-center gap-2">
                   <RankBadge name={member.rank.name} level={member.rank.level} />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-[8px] uppercase font-bold text-slate-400">Dienstnummer</p>
                  <p className="font-mono text-lg font-bold">#{member.badgeNumber || "000"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] uppercase font-bold text-slate-400">Status</p>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    {member.status}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RECHTS: Statistiken & Qualifikationen (Phase 4.2.2) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Dienstzeit & Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Dienstzeit</p>
                    <p className="text-sm font-bold">{serviceTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Eintritt</p>
                    <p className="text-sm font-bold">
                      {new Date(member.createdAt).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Abteilungen & Ausbildungen */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" /> Meine Zertifikate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {member.trainings.length > 0 ? (
                  member.trainings.map(t => (
                    <Badge key={t.id} variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1">
                      {t.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">Noch keine Ausbildungen absolviert.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Platzhalter für Antrags-Historie (Vorbereitung Phase 5) */}
          <Card className="shadow-sm opacity-60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" /> Antrags-Historie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[10px] text-muted-foreground">In Kürze verfügbar: Deine Urlaubs- und Ausbildungsanträge.</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}