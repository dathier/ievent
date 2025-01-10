import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const exhibitors = await prisma.exhibitor.findMany({
      where: { eventId },
    });
    return NextResponse.json(exhibitors);
  } catch (error) {
    console.error('Error fetching exhibitors:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const data = await request.json();
    const newExhibitor = await prisma.exhibitor.create({
      data: {
        ...data,
        eventId,
      },
    });
    return NextResponse.json(newExhibitor);
  } catch (error) {
    console.error('Error creating exhibitor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

