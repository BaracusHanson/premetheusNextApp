import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function getCurrentUserProfile() {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  let profile = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId }
  });

  if (!profile) {
    profile = await prisma.userProfile.create({
      data: {
        clerkUserId: userId
      }
    });
  }

  return profile;
}
