"use server"

import db from "@/lib/db"
import { verifyMembership, hasPermission } from "@/lib/dal"
import { revalidatePath } from "next/cache"

export async function createDepartment(factionSlug: string, name: string, shortName?: string) {
  const member = await verifyMembership(factionSlug);
  if (!hasPermission(member, "MANAGE_DEPARTMENTS")) throw new Error("Nicht autorisiert");

  await db.department.create({
    data: {
      name,
      shortName,
      faction: { connect: { slug: factionSlug } }
    }
  });

  revalidatePath(`/management/${factionSlug}/settings/departments`);
  return { success: true };
}