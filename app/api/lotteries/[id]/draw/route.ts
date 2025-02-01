import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lotteryId = Number.parseInt(params.id);
    const lottery = await prisma.lottery.findUnique({
      where: { id: lotteryId },
      include: { prizes: true },
    });

    if (!lottery) {
      return NextResponse.json({ error: "Lottery not found" }, { status: 404 });
    }

    if (!lottery.isStarted) {
      return NextResponse.json(
        { error: "Lottery has not started" },
        { status: 400 }
      );
    }

    const totalProbability = lottery.prizes.reduce(
      (sum, prize) => sum + prize.probability,
      0
    );
    const randomNumber =
      Math.random() * (totalProbability < 1 ? 1 : totalProbability);

    let cumulativeProbability = 0;
    let winningPrize = null;

    for (const prize of lottery.prizes) {
      cumulativeProbability += prize.probability;
      if (randomNumber <= cumulativeProbability) {
        winningPrize = prize;
        break;
      }
    }

    if (winningPrize) {
      await prisma.prize.update({
        where: { id: winningPrize.id },
        data: { quantity: { decrement: 1 } },
      });
    }

    return NextResponse.json({ prize: winningPrize });
  } catch (error) {
    console.error("Error drawing prize:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
