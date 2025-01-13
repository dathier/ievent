import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
  } else {
    if (!(global as any).prisma) {
      (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
  }
}

export async function getEvents() {
  if (!prisma) {
    throw new Error("Prisma client is not initialized");
  }
  return prisma.event.findMany({
    where: {
      isPublished: true,
      startDate: {
        gte: new Date(),
      },
      status: "approved",
    },
    orderBy: {
      startDate: "asc",
    },
  });
}

export async function getEvent(id: number) {
  if (!prisma) {
    throw new Error("Prisma client is not initialized");
  }
  return prisma.event.findUnique({
    where: { id },
    include: {
      guests: true,
      exhibitors: true,
      registrations: true,
      livestream: true,
      schedules: true,
      photos: true,
      videos: true,
      news: true,
    },
  });
}
