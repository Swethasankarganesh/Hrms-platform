import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { seedState } from "@/lib/seed";

export async function POST() {
  const today = new Date().toISOString().split("T")[0];

  /* ── Admin user ──────────────────────────────────────────── */
  const exists = await prisma.user.findUnique({
    where: { email: "sweshinisankar@gmail.com" },
  });
  if (!exists) {
    const hash = await bcrypt.hash("swetha123", 12);
    await prisma.user.create({
      data: {
        name: "Swetha Sankar",
        email: "sweshinisankar@gmail.com",
        password: hash,
        role: "admin",
      },
    });
  }

  /* ── Employees ───────────────────────────────────────────── */
  await prisma.employee.deleteMany();
  await prisma.employee.createMany({ data: seedState.employees });

  /* ── Leave requests ──────────────────────────────────────── */
  await prisma.leave.deleteMany();
  await prisma.leave.createMany({ data: seedState.leaves });

  /* ── Attendance ──────────────────────────────────────────── */
  await prisma.attendance.deleteMany();
  const attendanceRecords = Object.entries(seedState.attendance).map(
    ([employeeId, rec]) => ({ ...rec, employeeId: Number(employeeId), date: today }),
  );
  await prisma.attendance.createMany({ data: attendanceRecords });

  /* ── Payroll ─────────────────────────────────────────────── */
  await prisma.payroll.deleteMany();
  await prisma.payroll.create({ data: { month: "2026-06", status: seedState.payroll } });

  return NextResponse.json({ ok: true, message: "Database seeded successfully." });
}
