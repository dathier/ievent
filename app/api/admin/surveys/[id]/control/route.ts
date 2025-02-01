import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentQuestion, isStarted } = await request.json();

    const updateData: any = {};
    if (typeof currentQuestion !== "undefined") {
      updateData.currentQuestion = currentQuestion;
    }
    if (typeof isStarted !== "undefined") {
      updateData.isStarted = isStarted;
    }

    const survey = await prisma.survey.update({
      where: { id: Number.parseInt(params.id) },
      data: updateData,
    });

    return NextResponse.json(survey);
  } catch (error) {
    console.error("Error updating survey control:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
