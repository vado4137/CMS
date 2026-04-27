"use server"

import db from "@/lib/db"
import { verifyMembership, hasPermission } from "@/lib/dal"
import { revalidatePath } from "next/cache"
import { TrainingStatus } from "@prisma/client"

export async function createTrainingRequest(factionSlug: string, typeId: string) {
  const member = await verifyMembership(factionSlug);
  if (!hasPermission(member, "VIEW_TRAINING")) throw new Error("Nicht autorisiert");

  await db.trainingRequest.create({
    data: {
      memberId: member.id,
      typeId: typeId,
      factionId: member.factionId,
      status: "OFFEN"
    }
  });

  revalidatePath(`/management/${factionSlug}/trainings`);
  return { success: true };
}

export async function updateTrainingStatus(
  factionSlug: string, 
  requestId: string, 
  newStatus: TrainingStatus
) {
  const actor = await verifyMembership(factionSlug);
  
  // Permission Check laut deiner Vorgabe
  const canChange = hasPermission(actor, "MANAGE_TRAINING") || hasPermission(actor, "ACCEPT_TRAINING");
  if (!canChange) throw new Error("Du hast keine Berechtigung, den Status zu ändern.");

  const updateData: any = { status: newStatus };
  
  // Wenn ein Training angenommen wird (z.B. Wechsel von OFFEN auf PLANNING)
  if (newStatus === "PLANNING" && !hasPermission(actor, "MANAGE_TRAINING")) {
    updateData.instructorId = actor.id;
  }

  await db.trainingRequest.update({
    where: { id: requestId },
    data: updateData
  });

  revalidatePath(`/management/${factionSlug}/trainings`);
  return { success: true };
}

export async function createTrainingType(factionSlug: string, name: string, description?: string) {
  const admin = await verifyMembership(factionSlug);
  if (!hasPermission(admin, "MANAGE_TRAININGTYPES")) {
    throw new Error("Nicht autorisiert, Trainingstypen zu verwalten.");
  }

  await db.trainingType.create({
    data: {
      name,
      description,
      faction: { connect: { slug: factionSlug } }
    }
  });

  revalidatePath(`/management/${factionSlug}/settings/trainings/types`);
  return { success: true };
}

export async function deleteTrainingType(factionSlug: string, typeId: string) {
  const admin = await verifyMembership(factionSlug);
  if (!hasPermission(admin, "MANAGE_TRAININGTYPES")) {
    throw new Error("Nicht autorisiert.");
  }

  // Prüfen, ob bereits Anfragen für diesen Typ existieren (optionaler Schutz)
  const count = await db.trainingRequest.count({ where: { typeId } });
  if (count > 0) throw new Error("Dieser Typ wird bereits verwendet und kann nicht gelöscht werden.");

  await db.trainingType.delete({ where: { id: typeId } });

  revalidatePath(`/management/${factionSlug}/settings/trainings/types`);
  return { success: true };
}

export async function createTraining(
  factionSlug: string, 
  data: { typeId: string; memberId?: string } // memberId ist jetzt optional (?)
) {
  const actor = await verifyMembership(factionSlug);
  
  const canCreate = hasPermission(actor, "MANAGE_TRAINING") || hasPermission(actor, "ACCEPT_TRAINING");
  if (!canCreate) throw new Error("Nicht autorisiert.");

  await db.trainingRequest.create({
    data: {
      typeId: data.typeId,
      memberId: data.memberId || null, // Falls kein Schüler, bleibt es leer
      factionId: actor.factionId,
      instructorId: actor.id,         // Der Ersteller ist der Ausbilder
      status: "OFFEN",
    }
  });

  revalidatePath(`/management/${factionSlug}/calendar`);
  revalidatePath(`/management/${factionSlug}/trainings`);
  return { success: true };
}

export async function updateMemberTrainings(
  factionSlug: string, 
  memberId: string, 
  trainingIds: string[]
) {
  const admin = await verifyMembership(factionSlug);
  
  // Nur wer Trainings verwalten darf, kann die Akte direkt bearbeiten
  if (!hasPermission(admin, "MANAGE_TRAINING")) {
    throw new Error("Nicht autorisiert, Zertifikate direkt zu vergeben.");
  }

  // Wir aktualisieren die direkte Relation am Member
  await db.member.update({
    where: { id: memberId },
    data: {
      trainings: {
        set: trainingIds.map(id => ({ id }))
      }
    }
  });

  // Pfade aktualisieren, damit die Änderungen sofort sichtbar sind
  revalidatePath(`/management/${factionSlug}/members/${memberId}`);
  revalidatePath(`/management/${factionSlug}/members`);
  
  return { success: true };
}