import { auth } from "@/auth"
import { redirect } from "next/navigation"
import db from "@/lib/db"
import { PermissionKey } from "@/config/permissions"

export async function verifyMembership(slug: string) {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

    const member = await db.member.findFirst({
      where: { 
        user: { id: session.user.id },
        faction: { slug }
      },
      include: { 
        faction: true, 
        rank: true,
        departments: true, // Für die Profil-Stats
        trainings: true    // <--- DAS BEHEBT DEN FEHLER
      }
    });

  if (!member) redirect("/dashboard")
  
  // Wir hängen das SuperAdmin-Flag aus der Session an das Objekt an
  return { 
    ...member, 
    isGlobalAdmin: (session.user as any).isSuperAdmin === true 
  }
}

export function hasPermission(member: any, permission: PermissionKey): boolean {
  // 1. GLOBALER ADMIN BYPASS: Darf alles
  if (member.isGlobalAdmin) return true;

  // 2. RANG-CHECK
  if (!member?.rank?.permissions) return false;
  
  const perms = member.rank.permissions as Record<string, boolean>;
  return !!perms[permission];
}

export async function verifySettingsAccess(slug: string) {
  const member = await verifyMembership(slug);
  
  // Wenn kein globaler Admin UND kein MANAGE_FACTION Recht -> Rauswurf
  if (!hasPermission(member, "MANAGE_FACTION")) {
    redirect(`/management/${slug}`);
  }
  
  return member;
}