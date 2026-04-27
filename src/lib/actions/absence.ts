"use server"

import db from "@/lib/db"
import { verifyMembership } from "@/lib/dal"
import { revalidatePath } from "next/cache"

export async function reportAbsence(
  factionSlug: string, 
  data: { startDate: Date; endDate: Date; reason?: string }
) {
  const member = await verifyMembership(factionSlug);

  await db.absence.create({
    data: {
      memberId: member.id,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason
    }
  });

  revalidatePath(`/management/${factionSlug}/my-profile`);
  revalidatePath(`/management/${factionSlug}/absences`);
  return { success: true };
}