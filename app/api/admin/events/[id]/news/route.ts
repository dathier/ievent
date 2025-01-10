import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const news = await prisma.news.findMany({
      where: { eventId },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const data = await request.json();
    const newNews = await prisma.news.create({
      data: {
        ...data,
        eventId,
      },
    });
    return NextResponse.json(newNews);
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

