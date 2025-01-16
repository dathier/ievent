import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  dateRange: z.object({
    from: z.string(),
    to: z.string(),
  }),
  isPaid: z.boolean(),
  ticketPrice: z.number().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(params.id),
        userId: userId,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = eventSchema.parse(body);

    const updatedEvent = await prisma.event.update({
      where: {
        id: parseInt(params.id),
        userId: userId,
      },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        location: validatedData.location,
        startDate: new Date(validatedData.dateRange.from),
        endDate: new Date(validatedData.dateRange.to),
        isPaid: validatedData.isPaid,
        ticketPrice: validatedData.ticketPrice,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
