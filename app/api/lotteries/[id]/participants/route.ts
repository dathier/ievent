import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lotteryId = Number.parseInt(params.id);
    const participants = await prisma.lotteryParticipant.findMany({
      where: { lotteryId },
      select: { id: true, name: true },
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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lotteryId = Number.parseInt(params.id);
    const { name, email } = await request.json();

    const participant = await prisma.lotteryParticipant.create({
      data: {
        lotteryId,
        name,
        email,
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
