import { auth } from "@/auth"
import { redirect } from "next/navigation"

/**
 * Diese Funktion dient als Sicherheits-Türsteher für Admin-Bereiche.
 * Sie prüft die Session und das isSuperAdmin-Flag.
 */
export async function ensureSuperAdmin() {
  const session = await auth()
  
  // Falls kein Admin-Flag vorhanden ist (oder gar keine Session),
  // werfen wir den User gnadenlos zurück zum Dashboard.
  if (!(session?.user as any)?.isSuperAdmin) {
    redirect("/dashboard")
  }

  return session
}