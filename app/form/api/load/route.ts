import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { loadAnswer, loadAllAnswers } from "@/lib/loadAnswer";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.userProfile.findUnique({ where: { clerkUserId: userId } });
  if (!user) return new NextResponse("User profile not found", { status: 404 });

  const body = await req.json();
  const { stepId, loadAll } = body;

  if (loadAll) {
      const allData = await loadAllAnswers(user.id);
      return NextResponse.json(allData);
  }

  if (!stepId) {
      return new NextResponse("Missing stepId", { status: 400 });
  }

  const data = await loadAnswer(user.id, stepId);
  return NextResponse.json(data);
}
