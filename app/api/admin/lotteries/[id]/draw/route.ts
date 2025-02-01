import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lotteryId = Number.parseInt(params.id);
    const lottery = await prisma.lottery.findUnique({
      where: { id: lotteryId },
      include: { participants: true },
    });

    if (!lottery) {
      return NextResponse.json({ error: "Lottery not found" }, { status: 404 });
    }

    if (lottery.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Lottery already completed" },
        { status: 400 }
      );
    }

    const participants = lottery.participants;
    const winnerIndices = [];
    const winners = [];

    for (
      let i = 0;
      i < Math.min(lottery.numberOfWinners, participants.length);
      i++
    ) {
      let winnerIndex;
      do {
        winnerIndex = Math.floor(Math.random() * participants.length);
      } while (winnerIndices.includes(winnerIndex));

      winnerIndices.push(winnerIndex);
      winners.push(participants[winnerIndex].name);

      await prisma.lotteryParticipant.update({
        where: { id: participants[winnerIndex].id },
        data: { isWinner: true },
      });
    }

    const updatedLottery = await prisma.lottery.update({
      where: { id: lotteryId },
      data: {
        status: "COMPLETED",
        winnersJson: JSON.stringify(winners),
      },
    });

    return NextResponse.json({
      ...updatedLottery,
      winners,
    });
  } catch (error) {
    console.error("Error drawing winners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
