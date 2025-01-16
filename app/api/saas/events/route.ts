import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().min(1, "Location is required"),
  isPaid: z.boolean(),
  ticketPrice: z.number().min(0).optional(),
  eventType: z.string().min(1, "Event type is required"),
  industryType: z.string().min(1, "Industry type is required"),
  businessType: z.string().min(1, "Business type is required"),
  description: z.string().min(1, "Description is required"),
  requiresRegistration: z.boolean(),
});

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = eventSchema.parse(body);

    const newEvent = await prisma.event.create({
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        userId: userId,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        location: true,
        status: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
