import db from "@/lib/db";
import { ensureSuperAdmin } from "@/lib/admin-check";
import { notFound } from "next/navigation";
import { CMSEditor } from "../../_components/CMSEditor";

// Wir definieren params als Promise, wie es Next.js 16 verlangt
export default async function EditLandingPage(props: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Die ID asynchron auspacken
  const { id } = await props.params;

  // 2. Sicherheits-Check
  await ensureSuperAdmin();

  // 3. Fraktion laden (jetzt mit gültiger ID)
  const faction = await db.faction.findUnique({
    where: { id },
    include: { landingPage: true }
  });

  if (!faction || !faction.landingPage) return notFound();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <CMSEditor 
        faction={faction} 
        initialBlocks={faction.landingPage.contentJson as any || []} 
      />
    </div>
  );
}