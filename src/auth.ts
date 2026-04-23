import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
      Discord({
        clientId: process.env.AUTH_DISCORD_ID,
        clientSecret: process.env.AUTH_DISCORD_SECRET,
      }),
    ],
    callbacks: {
      async session({ session, user }) {
        // 1. Die ID anhängen
        if (session.user) {
          session.user.id = user.id;
  
          // 2. Alle Memberships dieses Users aus der DB laden
          const memberships = await db.member.findMany({
            where: { userId: user.id },
            include: { 
              faction: { select: { slug: true, name: true } },
              rank: { select: { name: true, level: true, permissions: true } }
            }
          });
  
          // 3. Die Daten in die Session schreiben
          // @ts-ignore - Wir erweitern das Typen-Interface später
          session.user.memberships = memberships.map(m => ({
            factionSlug: m.faction.slug,
            factionName: m.faction.name,
            icName: `${m.firstName} ${m.lastName}`,
            rankName: m.rank.name,
            rankLevel: m.rank.level,
            permissions: m.rank.permissions
          }));
        }
        return session;
      },
    },
    trustHost: true,
  })