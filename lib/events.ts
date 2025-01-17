import { prisma } from "./prisma";

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

      photos: true,
      videos: true,
      news: true,
      materials: true,
      schedules: {
        include: {
          guests: true,
        },
      },
    },
  });
}
