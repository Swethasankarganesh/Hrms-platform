import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  const records = await prisma.attendance.findMany({ where: { date } });

  /* Return as Record<number, AttendanceRecord> for frontend compatibility */
  const map: Record<number, { status: string; clockIn: string; clockOut: string; hours: string }> = {};
  for (const r of records) {
    map[r.employeeId] = { status: r.status, clockIn: r.clockIn, clockOut: r.clockOut, hours: r.hours };
  }

  return NextResponse.json(map);
}
