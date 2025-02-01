import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lotteryId = Number.parseInt(params.id);
    const lottery = await prisma.lottery.findUnique({
      where: { id: lotteryId },
      include: {
        prizes: true,
        participants: {
          where: { isWinner: true },
          select: { id: true, name: true, prizeId: true },
        },
      },
    });

    if (!lottery) {
      return NextResponse.json({ error: "Lottery not found" }, { status: 404 });
    }

    return NextResponse.json(lottery);
  } catch (error) {
    console.error("Error fetching lottery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
