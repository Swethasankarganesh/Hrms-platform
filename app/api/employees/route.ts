import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Employee from "@/lib/models/Employee";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const employees = await Employee.find({}).sort({ id: 1 }).lean();
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  await connectDB();

  /* Auto-increment id */
  const last = await Employee.findOne({}).sort({ id: -1 }).lean();
  const nextId = last ? (last as { id: number }).id + 1 : 1001;

  const employee = await Employee.create({
    ...body,
    id:     nextId,
    status: "Active",
    joined: new Date().toISOString().split("T")[0],
    score:  75,
  });

  return NextResponse.json(employee, { status: 201 });
}
