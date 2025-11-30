import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { BADGES } from "@/lib/badges";
import { checkBadges } from "@/lib/userProgress";
import { z } from "zod";

export async function GET() {
  try {
    const user = await getCurrentUserProfile();
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      badges: BADGES.map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        category: b.category,
        rarity: b.rarity,
        xp: b.xp
      })),
      unlocked: userBadges,
    });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

const triggerSchema = z.object({
  trigger: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserProfile();
    const body = await req.json(); // Optional body
    
    // Just run the check
    const newBadges = await checkBadges(user.id);

    return NextResponse.json({ newBadges });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
