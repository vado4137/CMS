import { auth } from "@/auth"
import db from "@/lib/db"
import { cache } from "react"
import { redirect } from "next/navigation"

/**
 * Holt den aktuellen Member-Kontext für eine Fraktion.
 * Durch 'cache' wird die DB-Abfrage innerhalb eines Request-Zyklus nur einmal ausgeführt.
 */
export const getMemberContext = cache(async (factionSlug: string) => {
  const session = await auth()
  if (!session?.user?.id) return null

  // Wir suchen den Member anhand der UserID und des Fraktion-Slugs
  const member = await db.member.findFirst({
    where: {
      userId: session.user.id,
      faction: { slug: factionSlug }
    },
    include: {
      faction: true,
      rank: true
    }
  })

  return member
})

/**
 * Ein "Guard", der sofort abbricht, wenn der User kein Zugriff hat.
 * Ideal für Server Components am Anfang der Datei.
 */
export async function verifyMembership(factionSlug: string) {
  const member = await getMemberContext(factionSlug)
  
  if (!member || member.status !== "ACTIVE") {
    redirect("/dashboard")
  }

  return member
}

/**
 * Utility zum Prüfen von Berechtigungen aus dem JSON-Feld des Rangs
 */
export async function hasPermission(factionSlug: string, permission: string) {
  const member = await getMemberContext(factionSlug)
  if (!member) return false

  const permissions = member.rank.permissions as Record<string, boolean>
  return !!permissions[permission]
}