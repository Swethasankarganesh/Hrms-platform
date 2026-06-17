import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Attendance from "@/lib/models/Attendance";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params; // id = employeeId
  const body = await req.json();
  const date = body.date ?? new Date().toISOString().split("T")[0];

  await connectDB();
  const updated = await Attendance.findOneAndUpdate(
    { employeeId: Number(id), date },
    { $set: { status: body.status } },
    { new: true, upsert: true },
  ).lean();

  return NextResponse.json(updated);
}
