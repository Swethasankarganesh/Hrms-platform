import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const record = await prisma.payroll.findUnique({ where: { month: "2026-06" } });
  return NextResponse.json({ status: record?.status ?? "Draft" });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();

  const record = await prisma.payroll.upsert({
    where: { month: "2026-06" },
    update: { status },
    create: { month: "2026-06", status },
  });

  return NextResponse.json(record);
}
