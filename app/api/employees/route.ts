import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { seedState } from "@/lib/seed";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(seedState.employees);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  /* No database: build the new record in-memory and let the client hold it. */
  const nextId = Math.max(1000, ...seedState.employees.map((e) => e.id)) + 1;
  const employee = {
    id: nextId,
    name: body.name,
    role: body.role,
    department: body.department,
    email: body.email,
    status: "Active",
    location: body.location,
    joined: new Date().toISOString().split("T")[0],
    salary: Number(body.salary),
    score: 75,
  };

  return NextResponse.json(employee, { status: 201 });
}
