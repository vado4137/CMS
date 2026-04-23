import "dotenv/config";
import { defineConfig } from "@prisma/config"; // Achte auf das @ Zeichen

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Wir fassen die Migrations-Einstellungen hier zusammen
    seed: 'npx tsx ./prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});