import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { seedState } from "@/lib/seed";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ status: seedState.payroll });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();

  /* No database: echo the new payroll status back to the client. */
  return NextResponse.json({ month: "2026-06", status });
}
