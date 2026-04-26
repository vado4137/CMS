"use server"

import db from "@/lib/db"
import { verifyMembership, hasPermission } from "@/lib/dal"
import { revalidatePath } from "next/cache"

export async function createTraining(factionSlug: string, name: string, shortName?: string) {
  const admin = await verifyMembership(factionSlug);
  if (!hasPermission(admin, "MANAGE_FACTION")) throw new Error("Nicht autorisiert");

  await db.training.create({
    data: {
      name,
      shortName,
      faction: { connect: { slug: factionSlug } }
    }
  });

  revalidatePath(`/management/${factionSlug}/settings/trainings`);
  return { success: true };
}

export async function updateMemberTrainings(factionSlug: string, memberId: string, trainingIds: string[]) {
  const admin = await verifyMembership(factionSlug);
  if (!hasPermission(admin, "MANAGE_MEMBERS")) throw new Error("Nicht autorisiert");

  await db.member.update({
    where: { id: memberId },
    data: {
      trainings: {
        set: trainingIds.map(id => ({ id }))
      }
    }
  });

  revalidatePath(`/management/${factionSlug}/members/${memberId}`);
  return { success: true };
}