import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Leave from "@/lib/models/Leave";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const leaves = await Leave.find({}).sort({ id: 1 }).lean();
  return NextResponse.json(leaves);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectDB();

  const last = await Leave.findOne({}).sort({ id: -1 }).lean();
  const nextId = last ? (last as { id: number }).id + 1 : 1;

  const leave = await Leave.create({ ...body, id: nextId, status: "Pending" });
  return NextResponse.json(leave, { status: 201 });
}
