import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Turso in production (libsql:// URL + auth token); a local libSQL file in dev.
// The libSQL adapter is pure JS, so it works on Vercel's serverless runtime.
const url =
  process.env.TURSO_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "file:./prisma/dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

function createPrisma() {
  const adapter = new PrismaLibSql({ url, authToken });
  return new PrismaClient({ adapter });
}

// Reuse a single client across hot reloads / warm serverless invocations.
export const prisma = global._prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  global._prisma = prisma;
}
