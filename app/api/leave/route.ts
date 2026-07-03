import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leaves = await prisma.leave.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(leaves);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const last = await prisma.leave.findFirst({ orderBy: { id: "desc" } });
  const nextId = last ? last.id + 1 : 1;

  const leave = await prisma.leave.create({
    data: {
      id: nextId,
      employeeId: Number(body.employeeId),
      type: body.type,
      from: body.from,
      to: body.to,
      days: Number(body.days),
      reason: body.reason ?? "",
      status: "Pending",
    },
  });

  return NextResponse.json(leave, { status: 201 });
}
