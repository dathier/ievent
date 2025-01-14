import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import { z } from "zod";

const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  image: z.string().url("Invalid image URL"),
});

export async function GET() {
  try {
    const venues = await prisma.venue.findMany();
    return NextResponse.json(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = venueSchema.parse(body);

    const newVenue = await prisma.venue.create({
      data: validatedData,
    });

    return NextResponse.json(newVenue, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating venue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
