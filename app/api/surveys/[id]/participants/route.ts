import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, deviceInfo } = await request.json();
    const surveyId = Number.parseInt(params.id);

    // Check if participant already exists
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        surveyId,
        name,
      },
    });

    if (existingParticipant) {
      return NextResponse.json(existingParticipant);
    }

    // Create new participant
    const participant = await prisma.participant.create({
      data: {
        surveyId,
        name,
        deviceInfo,
      },
    });

    return NextResponse.json(participant);
  } catch (error) {
    console.error("Error registering participant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const surveyId = Number.parseInt(params.id);

    const participants = await prisma.participant.findMany({
      where: {
        surveyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
