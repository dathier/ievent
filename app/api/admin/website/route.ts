import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const websiteContent = await prisma.website.findFirst();
    return NextResponse.json(websiteContent || {});
  } catch (error) {
    console.error("Error fetching website content:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const updatedContent = await prisma.website.upsert({
      where: { id: 1 }, // Assuming there's only one record for website content
      update: {
        heroTitle: data.hero.title,
        heroSubtitle: data.hero.description,
      },
      create: {
        heroTitle: data.hero.title,
        heroSubtitle: data.hero.description,
      },
    });
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("Error updating website content:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
