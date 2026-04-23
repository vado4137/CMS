import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  // 1. Verbindungspool erstellen
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  
  // 2. Den Prisma-Adapter für PostgreSQL initialisieren
  const adapter = new PrismaPg(pool)

  // 3. Den Client mit dem Adapter starten
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton()

export default db

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db