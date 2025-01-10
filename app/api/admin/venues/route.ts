import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const venues = await prisma.venue.findMany();
    return NextResponse.json(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newVenue = await prisma.venue.create({
      data: {
        name: data.name,
        location: data.location,
        capacity: data.capacity,
      },
    });
    return NextResponse.json(newVenue);
  } catch (error) {
    console.error("Error creating venue:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
