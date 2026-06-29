import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params; // id = employeeId
  const body = await req.json();

  /* No database: echo the updated attendance back to the client. */
  return NextResponse.json({ employeeId: Number(id), status: body.status });
}
