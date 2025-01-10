import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const photos = await prisma.photo.findMany({
      where: { eventId },
    });
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const data = await request.json();
    const newPhoto = await prisma.photo.create({
      data: {
        ...data,
        eventId,
      },
    });
    return NextResponse.json(newPhoto);
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

