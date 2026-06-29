import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer auto-loads .env, and reads the connection URL from here
// (no longer from schema.prisma) for CLI commands like `prisma db push`.
// Next.js keeps secrets in .env.local, so load that for the Prisma CLI too.
try {
  process.loadEnvFile(path.join(process.cwd(), ".env.local"));
} catch {
  // .env.local is optional (e.g. CI provides DATABASE_URL via real env vars)
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
