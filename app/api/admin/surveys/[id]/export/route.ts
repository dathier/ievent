import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createObjectCsvStringifier } from "csv-writer";

import PDFDocument from "pdfkit";

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
    const format = new URL(request.url).searchParams.get("format");

    const survey = await prisma.survey.findUnique({
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

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    const responses = await prisma.response.findMany({
      where: { surveyId },
      include: {
        question: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (format === "csv") {
      return exportCSV(survey, responses);
    } else if (format === "pdf") {
      return exportPDF(survey, responses);
    } else {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error exporting survey results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function exportCSV(survey, responses) {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: "respondent", title: "Respondent" },
      { id: "question", title: "Question" },
      { id: "answer", title: "Answer" },
      { id: "timestamp", title: "Timestamp" },
    ],
  });

  const csvRows = responses.map((r) => ({
    respondent: r.respondent,
    question: r.question.content,
    answer: r.answer,
    timestamp: r.createdAt.toISOString(),
  }));

  const csvContent =
    csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvRows);

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="survey_results.csv"`,
    },
  });
}

async function exportPDF(survey, responses) {
  // 创建一个新的 PDF 文档
  const doc = new PDFDocument({ autoFirstPage: true });
  const buffers: Buffer[] = [];

  doc.on("data", (chunk) => buffers.push(chunk));

  // 立即指定使用的字体，避免使用默认的 Helvetica

  // 添加标题
  doc.fontSize(16).text(survey.title, { align: "center" }).moveDown(2);

  // 添加问题和回复
  survey.questions.forEach((question, qIndex) => {
    // 添加问题
    doc
      .fontSize(12)
      .text(`Question ${qIndex + 1}: ${question.content}`, { underline: true })
      .moveDown();

    // 获取该问题的回复
    const questionResponses = responses.filter(
      (r) => r.questionId === question.id
    );

    // 添加回复
    questionResponses.forEach((response, rIndex) => {
      doc
        .fontSize(10)
        .text(`${response.respondent}: ${response.answer}`)
        .moveDown(0.5);
    });

    doc.moveDown();
  });

  // 添加总结
  doc
    .fontSize(12)
    .text("Summary", { underline: true })
    .moveDown()
    .text(`Total Responses: ${responses.length}`)
    .moveDown()
    .text(`Generated on: ${new Date().toLocaleString()}`);

  // 完成 PDF 生成
  doc.end();

  return new Promise<NextResponse>((resolve) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(
        new NextResponse(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="survey_results.pdf"`,
          },
        })
      );
    });
  });
}
