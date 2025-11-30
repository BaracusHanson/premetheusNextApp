import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { completeQuest } from "@/lib/questEngine";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const questId = searchParams.get("questId");
    
    const { userId } = auth(); // Clerk ID
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!questId) return NextResponse.json({ error: "Missing questId" }, { status: 400 });

    const user = await prisma.userProfile.findUnique({ where: { clerkUserId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        console.log(`Forcing completion of ${questId} for ${user.id}`);
        const result = await completeQuest(user.id, questId);
        return NextResponse.json({ success: true, result });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
