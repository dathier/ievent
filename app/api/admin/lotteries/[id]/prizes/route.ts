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
    const { name, quantity, probability } = await request.json();
    const prize = await prisma.prize.create({
      data: {
        name,
        quantity: Number.parseInt(quantity),
        probability: Number.parseFloat(probability),
        lotteryId: Number.parseInt(params.id),
      },
    });

    return NextResponse.json(prize);
  } catch (error) {
    console.error("Error adding prize:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
