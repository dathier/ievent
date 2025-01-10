import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const guests = await prisma.guest.findMany({
      where: { eventId },
    });
    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const data = await request.json();
    const newGuest = await prisma.guest.create({
      data: {
        ...data,
        eventId,
      },
    });
    return NextResponse.json(newGuest);
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

