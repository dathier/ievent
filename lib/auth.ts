import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
export async function checkUserRole(allowedRoles: string[]) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      role: true,
      status: true,
      email: true,
    },
  });

  return user;
}
