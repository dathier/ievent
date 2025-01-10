import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const videos = await prisma.video.findMany({
      where: { eventId },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const data = await request.json();
    const newVideo = await prisma.video.create({
      data: {
        ...data,
        eventId,
      },
    });
    return NextResponse.json(newVideo);
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

