"use server"

import db from "@/lib/db"
import { verifyMembership, hasPermission } from "@/lib/dal"
import { revalidatePath } from "next/cache"
import { TrainingStatus } from "@prisma/client"

/**
 * Erstellt eine 1-zu-1 Anfrage von einem Schüler (ohne festes Datum)
 */
export async function createTrainingRequest(factionSlug: string, typeId: string) {
  const member = await verifyMembership(factionSlug);
  
  await db.trainingRequest.create({
    data: {
      typeId: typeId,
      factionId: member.factionId,
      status: "OFFEN",
      scheduledDate: null,
      students: { connect: { id: member.id } } // HIER: Nutzt jetzt die students-Relation
    }
  });

  revalidatePath(`/management/${factionSlug}/trainings`);
  return { success: true };
}

/**
 * Einem offenen Kalender-Training beitreten (N-Schüler Support)
 */
export async function joinTraining(factionSlug: string, requestId: string) {
  const member = await verifyMembership(factionSlug);
  
  const request = await db.trainingRequest.findUnique({
    where: { id: requestId },
    include: { students: true } // Teilnehmerliste laden
  });

  if (!request) throw new Error("Training nicht gefunden.");
  
  // Prüfen, ob der User bereits auf der Liste steht
  if (request.students.some(s => s.id === member.id)) {
    throw new Error("Du bist bereits für dieses Training eingetragen.");
  }
  
  if (request.instructorId === member.id) {
    throw new Error("Du kannst nicht an deinem eigenen Training teilnehmen.");
  }

  await db.trainingRequest.update({
    where: { id: requestId },
    data: { 
      students: { connect: { id: member.id } }, // HIER: Zur Liste hinzufügen
      status: "PLANNING"
    }
  });

  revalidatePath(`/management/${factionSlug}/trainings`);
  revalidatePath(`/management/${factionSlug}/calendar`);
  return { success: true };
}

/**
 * Status aktualisieren mit selektivem Abschluss (Zertifikate für N Personen)
 */
export async function updateTrainingStatus(
  factionSlug: string, 
  requestId: string, 
  newStatus: TrainingStatus,
  passedMemberIds?: string[] // NEU: Liste der IDs, die bestanden haben
) {
  const actor = await verifyMembership(factionSlug);
  const canChange = hasPermission(actor, "MANAGE_TRAINING") || hasPermission(actor, "ACCEPT_TRAINING");
  if (!canChange) throw new Error("Nicht autorisiert.");

  const request = await db.trainingRequest.findUnique({
    where: { id: requestId },
    include: { trainingType: true, students: true }
  });

  if (!request) throw new Error("Anfrage nicht gefunden.");

  // 1. Status in der Datenbank setzen
  await db.trainingRequest.update({
    where: { id: requestId },
    data: { status: newStatus }
  });

  // 2. AUTOMATIK: Wenn "FINISH", Zertifikate an ausgewählte Teilnehmer verteilen
  if (newStatus === "FINISH") {
    const certificate = await db.training.findFirst({
      where: { 
        factionId: actor.factionId,
        name: request.trainingType.name 
      }
    });

    if (certificate) {
      // Entweder die übergebene Liste nutzen oder (Fallback) alle Teilnehmer
      const winners = passedMemberIds || request.students.map(s => s.id);
      
      await Promise.all(winners.map(studentId => 
        db.member.update({
          where: { id: studentId },
          data: { trainings: { connect: { id: certificate.id } } }
        })
      ));
    }
  }

  revalidatePath(`/management/${factionSlug}/trainings`);
  revalidatePath(`/management/${factionSlug}/calendar`);
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

/**
 * Erstellt ein offenes Angebot im Kalender (Instructor steht fest)
 */
export async function createTraining(factionSlug: string, data: { typeId: string, date: Date }) {
  const actor = await verifyMembership(factionSlug);
  
  await db.trainingRequest.create({
    data: {
      typeId: data.typeId,
      factionId: actor.factionId,
      instructorId: actor.id,      
      scheduledDate: data.date,    
      status: "OFFEN",             
    }
  });

  revalidatePath(`/management/${factionSlug}/calendar`);
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

export async function toggleInstructorPermission(
  factionSlug: string, 
  typeId: string, 
  memberId: string,
  shouldBeAuthorized: boolean
) {
  const admin = await verifyMembership(factionSlug);
  
  // Nur Nutzer mit MANAGE_TRAININGTYPES dürfen den Katalog bearbeiten
  if (!hasPermission(admin, "MANAGE_TRAININGTYPES")) {
    throw new Error("Nicht autorisiert");
  }

  await db.trainingType.update({
    where: { id: typeId },
    data: {
      authorizedInstructors: shouldBeAuthorized 
        ? { connect: { id: memberId } } 
        : { disconnect: { id: memberId } }
    }
  });

  revalidatePath(`/management/${factionSlug}/settings/trainings/types`);
  return { success: true };
}