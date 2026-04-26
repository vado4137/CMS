"use server"

import db from "@/lib/db"
import { verifyMembership, hasPermission } from "@/lib/dal"
import { revalidatePath } from "next/cache"
import { PermissionKey } from "@/config/permissions"
import { z } from "zod" // Für die Payload-Validierung 

// Validierungsschema für die Eingabedaten 
const RankSchema = z.object({
  name: z.string().min(2, "Name zu kurz").max(30),
  level: z.number().min(0).max(100),
})

export async function updateRankPermissions(
  factionSlug: string, 
  rankId: string, 
  permissions: Record<PermissionKey, boolean>
) {
  // 1. Authentication & Membership Check 
  const member = await verifyMembership(factionSlug);

  // 2. Authorization Check (MANAGE_FULL_RANKS erforderlich) 
  if (!hasPermission(member, "MANAGE_FULL_RANKS")) {
    throw new Error("Nicht autorisiert!");
  }

  // 3. Datenbank-Update mit Scoping 
  // Durch 'faction: { slug: factionSlug }' verhindern wir, dass IDs anderer 
  // Fraktionen manipuliert werden (Schutz gegen IDOR-Attacken).
  await db.rank.update({
    where: { 
      id: rankId,
      faction: { slug: factionSlug } 
    },
    data: { permissions: permissions as any }
  });

  revalidatePath(`/management/${factionSlug}/settings/ranks`);
  return { success: true };
}

export async function createRank(factionSlug: string, name: string, level: number) {
    // 1. Authentication & Membership Check
    const member = await verifyMembership(factionSlug);

    // 2. Authorization Check
    if (!hasPermission(member, "MANAGE_FULL_RANKS")) {
      throw new Error("Nicht autorisiert");
    }

    // 3. Payload-Validierung via Zod 
    const validated = RankSchema.parse({ name, level });
  
    // 4. FIAE-Validierung: Level-Eindeutigkeit prüfen 
    const existing = await db.rank.findFirst({
      where: { 
        faction: { slug: factionSlug },
        level: validated.level
      }
    });
  
    if (existing) {
      return { error: `Das Level ${validated.level} ist bereits an den Rang '${existing.name}' vergeben.` };
    }
  
    // 5. Erstellung
    await db.rank.create({
      data: {
        name: validated.name,
        level: validated.level,
        faction: { connect: { slug: factionSlug } },
        permissions: {} 
      }
    });
  
    revalidatePath(`/management/${factionSlug}/settings/ranks`);
    return { success: true };
}