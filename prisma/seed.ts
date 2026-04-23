import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config' // Wichtig, damit DATABASE_URL in diesem Prozess geladen wird

// In Prisma 7 Standalone-Skripten müssen wir den Adapter manuell initialisieren
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Die Fraktion erstellen/sicherstellen
  const lspd = await prisma.faction.upsert({
    where: { slug: 'lspd' },
    update: {},
    create: {
      name: 'LSPD',
      slug: 'lspd',
      description: 'Los Santos Police Department',
    },
  })

  // 2. Den initialen Rang erstellen/sicherstellen
  await prisma.rank.upsert({
    where: { id: 'initial-rank-1' },
    update: {},
    create: {
      id: 'initial-rank-1',
      name: 'Rekrut',
      level: 0,
      factionId: lspd.id,
    },
  })

  console.log('✅ Seed erfolgreich: LSPD und Rang "Rekrut" erstellt.')
}

main()
  .catch((e) => {
    console.error('❌ Fehler beim Seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })