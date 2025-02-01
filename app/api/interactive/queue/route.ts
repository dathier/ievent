import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  const where = eventId ? { eventId: Number.parseInt(eventId) } : {};

  const queueItems = await prisma.queueItem.findMany({
    where,
    orderBy: { timestamp: "asc" },
  });
  return NextResponse.json(queueItems);
}

export async function POST(request: Request) {
  const { people, queueType, eventId } = await request.json();
  const lastQueueItem = await prisma.queueItem.findFirst({
    where: eventId ? { eventId: Number.parseInt(eventId) } : {},
    orderBy: { number: "desc" },
  });
  const newNumber = lastQueueItem ? lastQueueItem.number + 1 : 1;
  const queueItem = await prisma.queueItem.create({
    data: {
      number: newNumber,
      people,
      queueType,
      status: "waiting",
      eventId: eventId ? Number.parseInt(eventId) : undefined,
    },
  });
  return NextResponse.json(queueItem);
}

export async function PUT(request: Request) {
  const { id, status } = await request.json();
  const updatedQueueItem = await prisma.queueItem.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(updatedQueueItem);
}
