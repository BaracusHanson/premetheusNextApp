import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { saveAnswer } from "@/lib/saveAnswer";
import { checkFormProgress } from "@/lib/autoProgress";
import { prisma } from "@/lib/db"; // Ensure we have the user in DB
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.userProfile.findUnique({
        where: { clerkUserId: userId }
    });

    if (!user) {
        return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();
    const { stepId, answers } = body;

    if (!stepId || !answers) {
        return new NextResponse("Missing data", { status: 400 });
    }

    await saveAnswer(user.id, stepId, answers);
    
    // Trigger gamification hooks
    const progress = await checkFormProgress(user.id, stepId, answers);

    if (progress.newQuests && progress.newQuests.length > 0) {
        revalidatePath('/quests');
        revalidatePath('/dashboard');
    }

    return NextResponse.json({ success: true, ...progress });
  } catch (error) {
    console.error("SAVE ERROR:", error);
    return new NextResponse("Internal Server Error: " + (error as Error).message, { status: 500 });
  }
}
