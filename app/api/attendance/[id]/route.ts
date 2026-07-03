import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params; // id = employeeId
  const body = await req.json();
  const date = body.date ?? new Date().toISOString().split("T")[0];
  const employeeId = Number(id);

  const updated = await prisma.attendance.upsert({
    where: { employeeId_date: { employeeId, date } },
    update: { status: body.status },
    create: { employeeId, date, status: body.status },
  });

  return NextResponse.json(updated);
}
