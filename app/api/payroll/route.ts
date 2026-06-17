import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Payroll } from "@/lib/models/Attendance";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const record = await Payroll.findOne({ month: "2026-06" }).lean() as { status: string } | null;
  return NextResponse.json({ status: record?.status ?? "Draft" });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();
  await connectDB();

  const record = await Payroll.findOneAndUpdate(
    { month: "2026-06" },
    { $set: { status } },
    { new: true, upsert: true },
  ).lean();

  return NextResponse.json(record);
}
