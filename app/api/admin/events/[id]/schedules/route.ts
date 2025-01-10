import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const schedules = await prisma.schedule.findMany({
      where: { eventId },
      include: { guests: true },
    });
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const data = await request.json();
    const { guestIds, ...scheduleData } = data;
    const newSchedule = await prisma.schedule.create({
      data: {
        ...scheduleData,
        eventId,
        guests: {
          connect: guestIds.map((id: number) => ({ id })),
        },
      },
      include: { guests: true },
    });
    return NextResponse.json(newSchedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

