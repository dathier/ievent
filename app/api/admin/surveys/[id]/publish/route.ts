import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function POST(
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
    });

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    const surveyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/website/surveys/${survey.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(surveyUrl);

    const updatedSurvey = await prisma.survey.update({
      where: { id: survey.id },
      data: {
        status: "PUBLISHED",
        qrCode: qrCodeDataUrl,
      },
    });

    return NextResponse.json(updatedSurvey);
  } catch (error) {
    console.error("Error publishing survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
