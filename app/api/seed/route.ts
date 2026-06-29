import { NextResponse } from "next/server";

/* No database in this deployment — the app runs on in-memory demo data,
   so seeding is a no-op kept for client compatibility. */
export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Running without a database — using built-in demo data.",
  });
}
