import { prisma } from "@/lib/db";

export async function saveAnswer(userId: string, stepId: string, data: any) {
  return await prisma.userFormAnswers.upsert({
    where: {
      userId_stepId: {
        userId,
        stepId,
      },
    },
    update: {
      data,
    },
    create: {
      userId,
      stepId,
      data,
    },
  });
}
