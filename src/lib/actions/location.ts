"use server"

import db from "@/lib/db"
import { verifyMembership, hasPermission } from "@/lib/dal"
import { revalidatePath } from "next/cache"

export async function createLocation(factionSlug: string, name: string) {
  const member = await verifyMembership(factionSlug);
  if (!hasPermission(member, "MANAGE_LOCATIONS")) throw new Error("Nicht autorisiert");

  await db.location.create({
    data: {
      name,
      faction: { connect: { slug: factionSlug } }
    }
  });

  revalidatePath(`/management/${factionSlug}/settings/locations`);
  return { success: true };
}

export async function deleteLocation(factionSlug: string, locationId: string) {
  const member = await verifyMembership(factionSlug);
  if (!hasPermission(member, "MANAGE_LOCATIONS")) throw new Error("Nicht autorisiert");

  await db.location.delete({ where: { id: locationId } });

  revalidatePath(`/management/${factionSlug}/settings/locations`);
  return { success: true };
}