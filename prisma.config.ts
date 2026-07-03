import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer auto-loads .env. Next.js keeps secrets in .env.local.
try {
  process.loadEnvFile(path.join(process.cwd(), ".env.local"));
} catch {
  // .env.local is optional (CI / Vercel provide env vars directly)
}

// The Prisma CLI (`prisma db push`) runs against a local libSQL/SQLite file.
// The Turso cloud schema is applied separately with `turso db shell` (see README).
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
});
