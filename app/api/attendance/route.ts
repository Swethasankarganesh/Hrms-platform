import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { seedState } from "@/lib/seed";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  /* No database: return the seed attendance map (Record<employeeId, record>). */
  return NextResponse.json(seedState.attendance);
}
