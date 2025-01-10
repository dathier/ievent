import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const featuredEvents = await prisma.event.findMany({
      where: {
        isFeatured: true,
        isPublished: true,
      },
      take: 6, // Limit to 6 featured events
      orderBy: {
        startDate: "asc",
      },
    });
    return NextResponse.json(featuredEvents);
  } catch (error) {
    console.error("Error fetching featured events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
