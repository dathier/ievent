import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { isStarted } = await request.json();
    const lottery = await prisma.lottery.update({
      where: { id: Number.parseInt(params.id) },
      data: { isStarted },
    });

    return NextResponse.json(lottery);
  } catch (error) {
    console.error("Error updating lottery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.lottery.delete({
      where: { id: Number.parseInt(params.id) },
    });

    return NextResponse.json({ message: "Lottery deleted successfully" });
  } catch (error) {
    console.error("Error deleting lottery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
