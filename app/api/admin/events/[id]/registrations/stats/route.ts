import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, daily, weekly, monthly, byType] = await Promise.all([
      prisma.registration.count({
        where: { eventId },
      }),
      prisma.registration.count({
        where: {
          eventId,
          createdAt: { gte: startOfDay },
        },
      }),
      prisma.registration.count({
        where: {
          eventId,
          createdAt: { gte: startOfWeek },
        },
      }),
      prisma.registration.count({
        where: {
          eventId,
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.registration.groupBy({
        by: ["type"],
        where: { eventId },
        _count: true,
      }),
    ]);

    const byTypeFormatted = Object.fromEntries(
      byType.map(({ type, _count }) => [type, _count])
    );

    return NextResponse.json({
      total,
      daily,
      weekly,
      monthly,
      byType: byTypeFormatted,
    });
  } catch (error) {
    console.error("Error fetching registration stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
