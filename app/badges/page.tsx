import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { BadgeCollection } from "@/components/BadgeCollection";
import { BadgeDefinition } from "@/types/badge";

export default async function BadgesPage() {
  const { userId } = auth();
  if (!userId) redirect("/auth/sign-in");

  const user = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId },
    include: {
      badges: true
    }
  });

  if (!user) redirect("/auth/sign-in");

  const allBadges = await prisma.badge.findMany();
  const unlockedBadgeIds = user.badges.map(ub => ub.badgeId);

  // Map DB badges to UI Badges
  const badges: BadgeDefinition[] = allBadges.map(b => ({
      ...b,
      rarity: b.rarity as any,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-heading font-bold">Collection de Badges</h1>
        <p className="text-muted-foreground">Vos succès et jalons.</p>
      </div>

      <BadgeCollection 
        badges={badges} 
        unlockedBadgeIds={unlockedBadgeIds} 
      />
    </div>
  );
}
