import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const survey = await prisma.survey.findUnique({
      where: { id: Number.parseInt(params.id) },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error("Error fetching survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, questions, status, currentQuestion } = body;

    const surveyId = Number.parseInt(params.id);

    // Start a transaction
    const updatedSurvey = await prisma.$transaction(async (prisma) => {
      // Update survey details
      const survey = await prisma.survey.update({
        where: { id: surveyId },
        data: {
          title,
          description,
          status,
          currentQuestion:
            currentQuestion !== undefined ? currentQuestion : undefined,
        },
      });

      // Delete existing questions and options
      await prisma.option.deleteMany({
        where: { question: { surveyId } },
      });
      await prisma.question.deleteMany({
        where: { surveyId },
      });

      // Create new questions and options
      if (questions && questions.length > 0) {
        await prisma.question.createMany({
          data: questions.map((question, index) => ({
            surveyId,
            content: question.content,
            type: question.type,
            order: index,
          })),
        });

        // Create options for questions that have them
        for (const question of questions) {
          if (question.options && question.options.length > 0) {
            const dbQuestion = await prisma.question.findFirst({
              where: { surveyId, content: question.content },
            });
            if (dbQuestion) {
              await prisma.option.createMany({
                data: question.options.map((option) => ({
                  questionId: dbQuestion.id,
                  content: option.content,
                })),
              });
            }
          }
        }
      }

      // Fetch the updated survey with questions and options
      return prisma.survey.findUnique({
        where: { id: surveyId },
        include: {
          questions: {
            include: {
              options: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    });

    return NextResponse.json(updatedSurvey);
  } catch (error) {
    console.error("Error updating survey:", error);
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
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.survey.delete({
      where: { id: Number.parseInt(params.id) },
    });

    return NextResponse.json({ message: "Survey deleted successfully" });
  } catch (error) {
    console.error("Error deleting survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
