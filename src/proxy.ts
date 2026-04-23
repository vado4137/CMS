import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl
  const memberships = (session?.user as any)?.memberships || []

  // 1. Landingpage-Redirect: Wenn eingeloggt, ab zum Hub
  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 2. Schutz-Logik für interne Bereiche
  const isInternalArea = pathname.startsWith("/management") || 
                         pathname.startsWith("/dashboard") || 
                         pathname.startsWith("/onboarding")

  if (isInternalArea) {
    // Nicht eingeloggt? Ab zur Haustür
    if (!session) return NextResponse.redirect(new URL("/", request.url))

    // FALL A: Eingeloggt, aber kein Charakter -> Zwang zum Onboarding
    if (memberships.length === 0 && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }

    // FALL B: Schon Charakter vorhanden -> Onboarding sperren
    if (memberships.length > 0 && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // 3. Spezifischer Management-Check (LSPD/EMS Isolation)
    if (pathname.startsWith("/management")) {
      const requestedSlug = pathname.split("/")[2]
      const hasAccess = memberships.some((m: any) => m.factionSlug === requestedSlug)
      
      // Kein Zugriff auf diese spezifische Fraktion? Zurück zum Hub
      if (!hasAccess) return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Wir überwachen die Wurzel und alle internen Pfade
  matcher: ["/", "/dashboard", "/management/:path*", "/onboarding"]
}