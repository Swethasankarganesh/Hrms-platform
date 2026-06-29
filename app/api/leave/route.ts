import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { seedState } from "@/lib/seed";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(seedState.leaves);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  /* No database: build the new leave request in-memory. */
  const nextId = Math.max(0, ...seedState.leaves.map((l) => l.id)) + 1;
  const leave = {
    id: nextId,
    employeeId: Number(body.employeeId),
    type: body.type,
    from: body.from,
    to: body.to,
    days: Number(body.days),
    reason: body.reason ?? "",
    status: "Pending",
  };

  return NextResponse.json(leave, { status: 201 });
}
