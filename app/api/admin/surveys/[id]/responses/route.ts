import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { questionId, answer, respondent, deviceInfo } = await request.json();

    const response = await prisma.response.create({
      data: {
        surveyId: Number.parseInt(params.id),
        questionId,
        answer: JSON.stringify(answer),
        respondent,
        deviceInfo: deviceInfo || {},
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error submitting response:", error);
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const responses = await prisma.response.findMany({
      where: { surveyId: parseInt(params.id) },
      include: { question: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
