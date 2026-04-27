"use server"

import { z } from "zod"
import db from "@/lib/db"
import { ensureSuperAdmin } from "@/lib/admin-check"
import { revalidatePath } from "next/cache"
import { FactionType } from "@prisma/client"
import { auth } from "@/auth" // HIER: Den Import für Auth.js hinzufügen
import { redirect } from "next/navigation"

// 1. Validierungsschema definieren
const CreateFactionSchema = z.object({
  name: z.string().min(3, "Name muss mindestens 3 Zeichen lang sein"),
  slug: z.string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten"),
  type: z.nativeEnum(FactionType),
  description: z.string().optional(),
})

export async function createFaction(formData: FormData) {
  await ensureSuperAdmin()

  const validatedFields = CreateFactionSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    // Gib die genauen Fehlerdetails in der Konsole aus
    console.log("Zod-Fehler:", JSON.stringify(validatedFields.error.flatten(), null, 2));
    return { 
      error: "Ungültige Eingaben", 
      details: validatedFields.error.flatten() 
    }
  }

  const { name, slug, type, description } = validatedFields.data

  try {
    const newFaction = await db.$transaction(async (tx) => {
      const faction = await tx.faction.create({
        data: {
          name,
          slug,
          type,
          description,
          // 1. LandingPage erstellen
          landingPage: {
            create: {} 
          },
          // 2. NEU: Default Rang 0 (Rekrut) erstellen
          ranks: {
            create: {
              name: "Rekrut",
              level: 0,
              permissions: {}, // Startet mit leeren Rechten
            }
          }
        }
      })
      return faction
    })

    revalidatePath("/dashboard")
    revalidatePath("/admin/factions")
    return { success: true, data: newFaction }

  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "Dieser Slug wird bereits verwendet." }
    }
    return { error: "Datenbankfehler beim Erstellen der Fraktion." }
  }
}

export async function updateLandingPage(factionId: string, blocks: any[]) {
    await ensureSuperAdmin(); // Oder prüfe auf Faction-Admin Rechte
  
    try {
      await db.landingPage.update({
        where: { factionId },
        data: {
          contentJson: blocks as any,
          published: true,
        },
      });
      revalidatePath(`/${factionId}`); // Cache der öffentlichen Seite löschen
      return { success: true };
    } catch (error) {
      return { error: "Fehler beim Speichern der Seite." };
    }
  }
  export async function toggleRecruiting(factionId: string, currentStatus: boolean) {
    await ensureSuperAdmin();
    
    await db.faction.update({
      where: { id: factionId },
      data: { isRecruiting: !currentStatus }
    });
    
    revalidatePath("/"); 
    revalidatePath("/admin/factions");
    return { success: true };
  }

  export async function deleteFaction(id: string) {
    await ensureSuperAdmin();
    const memberCount = await db.member.count({ where: { factionId: id } });
    
    if (memberCount > 0) {
      throw new Error("Fraktion kann nicht gelöscht werden, da sie noch Mitglieder hat.");
    }
  
    await db.faction.delete({ where: { id } });
  
    revalidatePath("/admin/factions");
    return { success: true };
  }

  export async function updateFaction(id: string, data: { name: string, slug: string }) {
    await ensureSuperAdmin();
    
    await db.faction.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug.toLowerCase()
      }
    });
  
    revalidatePath("/admin/factions");
    return { success: true };
  }

  // In deiner faction.ts hinzufügen
  export async function joinFaction(
    factionId: string, 
    icData: { firstName: string, lastName: string, badgeNumber: number } // badgeNumber hinzugefügt
  ) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Nicht eingeloggt");
  
    // 1. Finde den Standard-Rang (Level 0)
    const defaultRank = await db.rank.findFirst({
      where: { 
        factionId: factionId,
        level: 0 
      }
    });
  
    if (!defaultRank) throw new Error("Diese Fraktion hat noch keine Ränge konfiguriert.");
  
    // 2. Erstelle die Mitgliedschaft mit Dienstnummer
    await db.member.create({
      data: {
        userId: session.user.id,
        factionId: factionId,
        rankId: defaultRank.id,
        firstName: icData.firstName,
        lastName: icData.lastName,
        badgeNumber: icData.badgeNumber, // NEU: Dienstnummer speichern
        status: "ACTIVE"
      }
    });
  
    revalidatePath("/dashboard");
    return { success: true };
  }

  export async function onboardingAction(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Nicht eingeloggt");
  
    const factionId = formData.get("factionId") as string; // Von der Auswahl übernommen
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const badgeNumber = parseInt(formData.get("badgeNumber") as string);
  
    // 1. Die gewählte Fraktion finden
    const faction = await db.faction.findUnique({ 
      where: { id: factionId } 
    });
    if (!faction) throw new Error("Fraktion nicht gefunden.");
  
    // 2. Dienstnummer-Check für diese spezifische Fraktion
    const badgeExists = await db.member.findFirst({
      where: { factionId: faction.id, badgeNumber: badgeNumber }
    });
  
    if (badgeExists) {
      return redirect("/onboarding?error=badge_taken");
    }
  
    // 3. Rang-Check: Rekruten-Rang finden
    const startRank = await db.rank.findFirst({ 
      where: { factionId: faction.id, level: 0 }
    });
  
    if (!startRank) {
      throw new Error("Diese Fraktion hat noch keinen Rekruten-Rang (Level 0) eingerichtet.");
    }
  
    // 4. Erstellen
    await db.member.create({
      data: {
        userId: session.user.id,
        factionId: faction.id,
        rankId: startRank.id,
        firstName,
        lastName,
        badgeNumber,
        status: "ACTIVE"
      }
    });
  
    redirect(`/management/${faction.slug}`);
  }