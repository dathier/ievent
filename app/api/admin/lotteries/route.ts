import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lotteries = await prisma.lottery.findMany({
      include: {
        _count: {
          select: { participants: true },
        },
        prizes: true,
        participants: {
          where: { isWinner: true },
          select: { id: true, name: true, prizeId: true },
        },
      },
    });

    return NextResponse.json(lotteries);
  } catch (error) {
    console.error("Error fetching lotteries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, numberOfWinners } = await request.json();
    const lottery = await prisma.lottery.create({
      data: {
        name,
        numberOfWinners: Number.parseInt(numberOfWinners),
        status: "PENDING",
      },
    });

    return NextResponse.json(lottery);
  } catch (error) {
    console.error("Error creating lottery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
