import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

type ClerkWebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    first_name?: string | null;
    last_name?: string | null;
  };
};

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SIGNING_SECRET is not configured" },
      { status: 503 },
    );
  }

  const headerList = await headers();
  const svixId = headerList.get("svix-id");
  const svixTimestamp = headerList.get("svix-timestamp");
  const svixSignature = headerList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  const body = await request.text();

  try {
    const event = new Webhook(secret).verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;

    // Persist user.created/user.updated events to your database here.
    return NextResponse.json({ received: true, type: event.type });
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }
}
