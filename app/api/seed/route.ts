import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Employee from "@/lib/models/Employee";
import Leave from "@/lib/models/Leave";
import Attendance, { Payroll } from "@/lib/models/Attendance";
import { seedState } from "@/lib/seed";

export async function POST() {
  await connectDB();

  const today = new Date().toISOString().split("T")[0];

  /* ── Admin user ──────────────────────────────────────────── */
  const exists = await User.findOne({ email: "sweshinisankar@gmail.com" });
  if (!exists) {
    const hash = await bcrypt.hash("swetha123", 12);
    await User.create({
      name:     "Swetha Sankar",
      email:    "sweshinisankar@gmail.com",
      password: hash,
      role:     "admin",
    });
  }

  /* ── Employees ───────────────────────────────────────────── */
  await Employee.deleteMany({});
  await Employee.insertMany(seedState.employees);

  /* ── Leave requests ──────────────────────────────────────── */
  await Leave.deleteMany({});
  await Leave.insertMany(seedState.leaves);

  /* ── Attendance ──────────────────────────────────────────── */
  await Attendance.deleteMany({});
  const attendanceRecords = Object.entries(seedState.attendance).map(
    ([employeeId, rec]) => ({ ...rec, employeeId: Number(employeeId), date: today }),
  );
  await Attendance.insertMany(attendanceRecords);

  /* ── Payroll ─────────────────────────────────────────────── */
  await Payroll.deleteMany({});
  await Payroll.create({ month: "2026-06", status: seedState.payroll });

  return NextResponse.json({ ok: true, message: "Database seeded successfully." });
}
