import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const livestream = await prisma.livestream.findUnique({
      where: { eventId },
    });
    return NextResponse.json(livestream);
  } catch (error) {
    console.error('Error fetching livestream:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const data = await request.json();
    const newLivestream = await prisma.livestream.create({
      data: {
        ...data,
        eventId,
      },
    });
    return NextResponse.json(newLivestream);
  } catch (error) {
    console.error('Error creating livestream:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const data = await request.json();
    const updatedLivestream = await prisma.livestream.update({
      where: { eventId },
      data,
    });
    return NextResponse.json(updatedLivestream);
  } catch (error) {
    console.error('Error updating livestream:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

