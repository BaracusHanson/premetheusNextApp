import { prisma } from "@/lib/db";

export async function loadAnswer(userId: string, stepId: string) {
  const answer = await prisma.userFormAnswers.findUnique({
    where: {
      userId_stepId: {
        userId,
        stepId,
      },
    },
  });

  return answer?.data || {};
}

export async function loadAllAnswers(userId: string) {
    const answers = await prisma.userFormAnswers.findMany({
        where: { userId }
    });
    
    // Merge all answers into one object for condition checking
    return answers.reduce((acc, curr) => {
        return { ...acc, ...(curr.data as object) };
    }, {});
}
