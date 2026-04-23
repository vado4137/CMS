import db from "@/lib/db";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/cms/BlockRenderer";
import { CMSBlock } from "@/types/cms";

export const dynamic = "force-dynamic";

export default async function PublicFactionPage(props: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await props.params;
  

  // Wir holen die Fraktion inkl. ihrer LandingPage-Blöcke
  const faction = await db.faction.findUnique({
    where: { slug },
    include: { landingPage: true }
  });

  // Falls keine Fraktion oder keine Seite existiert -> 404
  if (!faction || !faction.landingPage) return notFound();

  // Das JSON aus der DB in unser CMSBlock-Array casten
  const blocks = faction.landingPage.contentJson as unknown as CMSBlock[];

  return (
    <main>
      {/* Optional: Ein gemeinsames Navigations-Element für die Fraktion */}
      <BlockRenderer blocks={blocks} />
    </main>
  );
}

export async function generateStaticParams() {
    const factions = await db.faction.findMany({
      select: { slug: true }
    });
  
    return factions.map((f) => ({
      slug: f.slug,
    }));
  }