"use server"

import db from "@/lib/db"
import { verifyMembership, hasPermission } from "@/lib/dal"
import { revalidatePath } from "next/cache"

export async function updateMemberRank(factionSlug: string, memberId: string, newRankId: string) {
  const admin = await verifyMembership(factionSlug);
  
  // FIAE-Security: Darf der User überhaupt Mitglieder verwalten?
  if (!hasPermission(admin, "MANAGE_MEMBERS")) {
    throw new Error("Nicht autorisiert!");
  }

  await db.member.update({
    where: { id: memberId },
    data: { rankId: newRankId }
  });

  revalidatePath(`/management/${factionSlug}/members`);
  return { success: true };
}
export async function updateMemberDepartments(
    factionSlug: string, 
    memberId: string, 
    departmentIds: string[]
  ) {
    const admin = await verifyMembership(factionSlug);
    if (!hasPermission(admin, "MANAGE_MEMBERS")) throw new Error("Nicht autorisiert");
  
    await db.member.update({
      where: { id: memberId },
      data: {
        departments: {
          // 'set' löscht alle alten Verbindungen und setzt nur die neuen IDs
          set: departmentIds.map(id => ({ id }))
        }
      }
    });
  
    revalidatePath(`/management/${factionSlug}/members`);
    return { success: true };
  }

  export async function updateMemberStatus(factionSlug: string, memberId: string, newStatus: string) {
    const actor = await verifyMembership(factionSlug);
    if (!hasPermission(actor, "MANAGE_MEMBERS")) throw new Error("Nicht autorisiert");
  
    const oldMember = await db.member.findUnique({ where: { id: memberId } });
  
    const updated = await db.member.update({
      where: { id: memberId },
      data: { status: newStatus }
    });
  
    // Audit Log erstellen
    await db.auditLog.create({
      data: {
        factionId: actor.factionId,
        memberId: memberId,
        actorId: actor.id,
        action: "STATUS_UPDATE",
        oldValue: oldMember?.status,
        newValue: newStatus
      }
    });
  
    revalidatePath(`/management/${factionSlug}/members`);
    return { success: true };
  }

  export async function updateMemberDetails(
    factionSlug: string,
    memberId: string,
    data: {
      badgeNumber?: number;
      notes?: string;
      locationId?: string; // Neu hinzugefügt
    }
  ) {
    const actor = await verifyMembership(factionSlug);
    if (!hasPermission(actor, "MANAGE_MEMBERS")) throw new Error("Nicht autorisiert");
  
    await db.member.update({
      where: { id: memberId },
      data: {
        badgeNumber: data.badgeNumber,
        notes: data.notes,
        locationId: data.locationId // Neu hinzugefügt
      }
    });
  
    revalidatePath(`/management/${factionSlug}/members/${memberId}`);
    return { success: true };
  }