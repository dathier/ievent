import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const materials = await prisma.material.findMany({
      where: { eventId },
    });
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const data = await request.json();
    const newMaterial = await prisma.material.create({
      data: {
        ...data,
        eventId,
      },
    });
    return NextResponse.json(newMaterial);
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

