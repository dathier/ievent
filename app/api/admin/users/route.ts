import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // try {
  //   const currentUser = await clerkClient.users.getUser(userId);
  //   if (currentUser.publicMetadata.role !== "admin") {
  //     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  //   }

  //   const users = await clerkClient.users.getUserList();
  //   const usersWithRoles = await Promise.all(
  //     users.map(async (user) => {
  //       const dbUser = await prisma.user.findUnique({
  //         where: { clerkId: user.id },
  //       });
  //       return {
  //         id: user.id,
  //         email: user.emailAddresses[0].emailAddress,
  //         role: dbUser?.role || "user",
  //       };
  //     })
  //   );

  //   return NextResponse.json(usersWithRoles);
  // } catch (error) {
  //   console.error("Error fetching users:", error);
  //   return NextResponse.json(
  //     { error: "Internal server error" },
  //     { status: 500 }
  //   );
  // }
}
