import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received data:", data);
    const newEvent = await prisma.event.create({
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        location: data.location,
        isPaid: data.isPaid,
        ticketPrice: data.isPaid ? Number(data.ticketPrice) : null,
        eventType: data.eventType,
        industryType: data.industryType,
        businessType: data.businessType,
        description: data.description,
        requiresRegistration: data.requiresRegistration,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
      },
    });
    return NextResponse.json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
