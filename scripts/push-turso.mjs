// Creates the tables on your Turso database by running prisma/turso-schema.sql.
// Usage:
//   1. Put TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env.local
//   2. node scripts/push-turso.mjs
import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import path from "node:path";

try {
  process.loadEnvFile(path.join(process.cwd(), ".env.local"));
} catch {
  // .env.local optional if the vars are already in the environment
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("❌ Missing TURSO_DATABASE_URL. Add it (and TURSO_AUTH_TOKEN) to .env.local.");
  process.exit(1);
}

const sql = readFileSync(path.join(process.cwd(), "prisma", "turso-schema.sql"), "utf8");
const client = createClient({ url, authToken });

try {
  await client.executeMultiple(sql);
  console.log("✅ Tables created on Turso:", url.replace(/\?.*$/, ""));
} catch (err) {
  console.error("❌ Failed to create tables:", err.message);
  process.exit(1);
} finally {
  client.close();
}
