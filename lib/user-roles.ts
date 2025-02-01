import { clerkClient } from "@clerk/nextjs/server";

export async function setUserRole(userId: string, role: string) {
  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role },
    });
  } catch (error) {
    console.error("Error setting user role:", error);
    throw error;
  }
}

export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const user = await clerkClient.users.getUser(userId);
    return (user.publicMetadata.role as string) || null;
  } catch (error) {
    console.error("Error getting user role:", error);
    throw error;
  }
}
