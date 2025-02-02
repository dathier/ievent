"use server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { handleError } from "@/lib/utils";

import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Get the ID and type
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = evt.data;
  const eventType = evt.type;

  // switch (eventType) {
  //   case "user.created":
  //     const { id, email_addresses } = evt.data;

  //     await prisma.user.create({
  //       data: {
  //         clerkId: id as string,
  //         email: email_addresses[0].email_address,
  //         role: "user",
  //         status: "ACTIVE",
  //         plan: "FREE",
  //         password: "",
  //       },
  //     });
  //     break;
  //   case "user.updated":
  //     await prisma.user.update({
  //       where: { clerkId: id as string },
  //       data: {
  //         email: email_addresses[0].email_address,
  //       },
  //     });
  //     break;
  //   case "user.deleted":
  //     await prisma.user.delete({
  //       where: { clerkId: id as string },
  //     });
  //     break;
  //   default:
  //     console.log("Unhandled webhook event type:", evt.type);
  // }

  return new Response("", { status: 200 });
}
