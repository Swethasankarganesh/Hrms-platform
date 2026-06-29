import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

const UPDATABLE = [
  "name",
  "role",
  "department",
  "email",
  "status",
  "location",
  "joined",
  "salary",
  "score",
] as const;

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  /* Only copy known, present fields onto the update payload */
  const data: Prisma.EmployeeUpdateInput = {};
  for (const key of UPDATABLE) {
    if (key in body && body[key] !== undefined) {
      data[key] = key === "salary" || key === "score" ? Number(body[key]) : body[key];
    }
  }

  try {
    const updated = await prisma.employee.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.employee.delete({ where: { id: Number(id) } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
