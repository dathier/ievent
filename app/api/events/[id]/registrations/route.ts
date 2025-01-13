import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);
    const registrations = await prisma.registration.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);
    const data = await request.json();

    const newRegistration = await prisma.registration.create({
      data: {
        ...data,
        eventId,
        status: "pending",
      },
    });

    return NextResponse.json(newRegistration);
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
