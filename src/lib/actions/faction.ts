"use server"

import { z } from "zod"
import db from "@/lib/db"
import { ensureSuperAdmin } from "@/lib/admin-check"
import { revalidatePath } from "next/cache"
import { FactionType } from "@prisma/client"

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
  // 2. Sicherheits-Check: Nur Super-Admins!
  await ensureSuperAdmin()

  // 3. Daten extrahieren und validieren
  const validatedFields = CreateFactionSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    return { error: "Ungültige Eingaben", details: validatedFields.error.flatten() }
  }

  const { name, slug, type, description } = validatedFields.data

  try {
    // 4. Transaktion: Fraktion erstellen UND direkt eine leere LandingPage anlegen
    const newFaction = await db.$transaction(async (tx) => {
      const faction = await tx.faction.create({
        data: {
          name,
          slug,
          type,
          description,
          // Wir legen direkt den CMS-Eintrag mit an
          landingPage: {
            create: {} 
          }
        }
      })
      return faction
    })

    // Cache löschen, damit die neue Fraktion im Hub erscheint
    revalidatePath("/dashboard")
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