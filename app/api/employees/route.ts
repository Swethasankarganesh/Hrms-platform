import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const employees = await prisma.employee.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  /* Auto-increment id */
  const last = await prisma.employee.findFirst({ orderBy: { id: "desc" } });
  const nextId = last ? last.id + 1 : 1001;

  const employee = await prisma.employee.create({
    data: {
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
    },
  });

  return NextResponse.json(employee, { status: 201 });
}
