import db from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function GlobalLandingPage() {
  const factions = await db.faction.findMany({
    where: { landingPage: { published: true } },
    include: { landingPage: true }
  });

  return (
    <div className="container mx-auto py-20">
      <h1 className="text-5xl font-bold text-center mb-12">Willkommen im Los Santos Portal</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {factions.map((faction) => (
          <div key={faction.id} className="border rounded-xl p-6 flex flex-col items-center shadow-sm">
            <div className="w-20 h-20 bg-slate-100 rounded-full mb-4 flex items-center justify-center font-bold text-2xl">
              {faction.name[0]}
            </div>
            <h2 className="text-xl font-bold">{faction.name}</h2>
            <p className="text-muted-foreground text-center text-sm my-4">
              {faction.description}
            </p>
            <Link href={`/${faction.slug}`} className="w-full">
              <Button variant="outline" className="w-full">Zur Webseite</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}