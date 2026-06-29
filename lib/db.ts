import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// SQLite database file (relative to the project root). Override via DATABASE_URL.
const DATABASE_URL = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

// Prisma 7 connects through a driver adapter rather than a URL in schema.prisma.
function createPrisma() {
  const adapter = new PrismaBetterSqlite3({ url: DATABASE_URL });
  return new PrismaClient({ adapter });
}

// Reuse a single client across hot reloads in development.
export const prisma = global._prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  global._prisma = prisma;
}
