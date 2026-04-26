import db from "@/lib/db";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Shield } from "lucide-react";

export default async function GlobalLandingPage() {
  // Wir laden alle Fraktionen, die eine LandingPage haben
  const factions = await db.faction.findMany({
    where: {
      landingPage: {
        published: true, // Nur anzeigen, wenn im Editor "veröffentlicht"
      },
    },
    include: {
      landingPage: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* 1. Hero Section */}
      <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-1">
            State of San Andreas
          </Badge>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 uppercase">
            Los Santos <span className="text-blue-500">Portal</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Deine zentrale Anlaufstelle für Behörden, Dienste und das zivile Leben in Los Santos. 
            Finde deinen Platz in unserer Community.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold px-8">
              Jetzt Bewerben
            </Button>
            <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800 text-white font-bold">
              Zum Regelwerk
            </Button>
          </div>
        </div>
        {/* Subtiles Grid-Muster im Hintergrund */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </section>

      {/* 2. Fraktions-Grid */}
      <section className="container mx-auto py-20 px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Behörden & Dienste</h2>
            <p className="text-muted-foreground">Entdecke die verschiedenen Gruppierungen des Staates.</p>
          </div>
          <div className="hidden md:flex gap-2 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {factions.length} Fraktionen</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {factions.map((f) => (
            <Card key={f.id} className="group border-2 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Shield className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  {f.isRecruiting ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
                      🟢 Bewerben offen
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="opacity-60">
                      🔴 Geschlossen
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-blue-600 transition-colors">
                  {f.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="text-muted-foreground line-clamp-3 italic">
                  {f.description || "Besuche unsere offizielle Seite für aktuelle Informationen, Dienstgrade und Bekanntmachungen."}
                </p>
              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t p-4">
                <Link href={`/${f.slug}`} className="w-full">
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-blue-600 group-hover:text-white transition-all">
                    Webseite besuchen
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}