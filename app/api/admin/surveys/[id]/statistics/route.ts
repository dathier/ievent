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

    const surveyId = Number.parseInt(params.id);

    // Get all responses and participants
    const [responses, participants] = await Promise.all([
      prisma.response.findMany({
        where: { surveyId },
        include: {
          question: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.participant.findMany({
        where: { surveyId },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    // Calculate statistics
    const totalResponses = responses.length;
    const questionCount = await prisma.question.count({
      where: { surveyId },
    });

    // Calculate completion rate
    const completedRespondents = participants.filter((participant) => {
      const participantResponses = responses.filter(
        (r) => r.respondent === participant.name
      );
      return participantResponses.length === questionCount;
    });
    const completionRate =
      (completedRespondents.length / participants.length) * 100 || 0;

    // Calculate average time per question
    const responsesByRespondent = responses.reduce((acc, r) => {
      if (!acc[r.respondent]) {
        acc[r.respondent] = [];
      }
      acc[r.respondent].push(r);
      return acc;
    }, {});

    let totalTime = 0;
    let timeCount = 0;

    Object.values(responsesByRespondent).forEach((userResponses: any[]) => {
      for (let i = 1; i < userResponses.length; i++) {
        const timeDiff =
          new Date(userResponses[i].createdAt).getTime() -
          new Date(userResponses[i - 1].createdAt).getTime();
        totalTime += timeDiff;
        timeCount++;
      }
    });

    const averageTimePerQuestion = totalTime / timeCount / 1000 || 0;

    // Get response distribution for all questions
    const questions = await prisma.question.findMany({
      where: { surveyId },
      include: {
        options: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    const responseDistribution = questions.map((question) => {
      const questionResponses = responses.filter(
        (r) => r.questionId === question.id
      );

      if (question.type === "TEXT") {
        return questionResponses.map((r) => ({
          name: r.answer,
          responses: 1,
        }));
      } else {
        const optionCounts = {};
        questionResponses.forEach((r) => {
          const answers = JSON.parse(r.answer);
          if (Array.isArray(answers)) {
            answers.forEach((answer) => {
              optionCounts[answer] = (optionCounts[answer] || 0) + 1;
            });
          } else {
            optionCounts[answers] = (optionCounts[answers] || 0) + 1;
          }
        });
        return question.options.map((option) => ({
          name: option.content,
          responses: optionCounts[option.content] || 0,
        }));
      }
    });

    // Analyze device types from participants
    const deviceTypes = participants.reduce((acc, p) => {
      const deviceInfo = p.deviceInfo as any;
      const deviceType = deviceInfo.userAgent.includes("Mobile")
        ? "Mobile"
        : "Desktop";
      acc[deviceType] = (acc[deviceType] || 0) + 1;
      return acc;
    }, {});

    // Get browser statistics
    const browsers = participants.reduce((acc, p) => {
      const deviceInfo = p.deviceInfo as any;
      const ua = deviceInfo.userAgent.toLowerCase();
      let browser = "Other";

      if (ua.includes("chrome")) browser = "Chrome";
      else if (ua.includes("firefox")) browser = "Firefox";
      else if (ua.includes("safari")) browser = "Safari";
      else if (ua.includes("edge")) browser = "Edge";

      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});

    const statistics = {
      totalResponses,
      completionRate,
      averageTimePerQuestion,
      responseDistribution,
      respondents: {
        total: participants.length,
        list: participants.map((p) => ({
          name: p.name,
          deviceInfo: p.deviceInfo,
          createdAt: p.createdAt,
        })),
        deviceTypes,
        browsers,
      },
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Error fetching survey statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
