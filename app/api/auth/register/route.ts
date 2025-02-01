import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { setUserRole } from "@/lib/user-roles";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await setUserRole(userId, "user");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting default role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
