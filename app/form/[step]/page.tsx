import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { formSteps } from "@/lib/formSteps";
import { loadAnswer, loadAllAnswers } from "@/lib/loadAnswer";
import { formTriggers } from "@/prisma/data/formTriggers";
import FormPageClient from "./_components/FormPageClient";

export default async function StepPage({ params }: { params: { step: string } }) {
  const { userId } = auth();
  if (!userId) {
      redirect("/auth/sign-in");
  }

  const step = formSteps.find((s) => s.id === params.step);

  if (!step) {
      redirect("/form/general");
  }

  const userProfile = await prisma.userProfile.findUnique({
      where: { clerkUserId: userId },
      include: { quests: true }
  });

  if (!userProfile) redirect("/auth/sign-in");

  const initialData = await loadAnswer(userId, step.id);
  const allAnswers = await loadAllAnswers(userId);

  // Generate Field Hints (Quest Info linked to fields)
  const fieldHints: Record<string, { title: string, xp: number, status: string }[]> = {};
  const stepFieldIds = step.questions.map(q => q.id);
  const questIdsToFetch = new Set<string>();

  stepFieldIds.forEach(fid => {
      // @ts-ignore
      const trigger = formTriggers[fid];
      if (trigger && trigger.quests) {
          trigger.quests.forEach((qid: string) => questIdsToFetch.add(qid));
      }
  });

  if (questIdsToFetch.size > 0) {
      const quests = await prisma.quest.findMany({
          where: { id: { in: Array.from(questIdsToFetch) } }
      });
      
      const completedQuestIds = new Set(userProfile.quests.filter(q => q.status === 'COMPLETED').map(q => q.questId));

      stepFieldIds.forEach(fid => {
          // @ts-ignore
          const trigger = formTriggers[fid];
          if (trigger && trigger.quests) {
             const linkedQuests = quests.filter(q => trigger.quests.includes(q.id));
             
             if (linkedQuests.length > 0) {
                 fieldHints[fid] = linkedQuests.map(q => ({
                     title: q.title,
                     xp: q.xp,
                     status: completedQuestIds.has(q.id) ? 'COMPLETED' : 'PENDING'
                 }));
             }
          }
      });
  }

  return (
    <FormPageClient 
        stepId={step.id} 
        initialData={initialData} 
        allAnswers={allAnswers} 
        userId={userId} 
        fieldHints={fieldHints}
    />
  );
}
