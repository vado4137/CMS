import db from "@/lib/db";
import { verifyMembership } from "@/lib/dal";
import { MembersDataTable } from "./_components/MembersDataTable";

export default async function MemberListPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await verifyMembership(slug);

  // Reiner Daten-Fetch (Server)
  const members = await db.member.findMany({
    where: { faction: { slug } },
    include: { rank: true, user: true, departments: true },
    orderBy: { rank: { level: "desc" } }
  });

  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Personalverwaltung</h1>
        <p className="text-slate-500 italic">Zuständig für Disziplin und Ordnung im {slug.toUpperCase()}</p>
      </header>

      {/* Übergebe nur Daten und Slug, keine Funktionen */}
      <MembersDataTable 
        data={members} 
        factionSlug={slug}
      />
    </div>
  );
}