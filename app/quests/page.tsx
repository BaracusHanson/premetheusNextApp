import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { QuestBoard } from "@/components/QuestBoard";
import { QuestDefinition } from "@/types/quest";
import { QUEST_CONTENT } from "@/lib/quest-content";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function QuestsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { userId } = auth();
  if (!userId) redirect("/auth/sign-in");

  const focus = typeof searchParams.focus === 'string' ? searchParams.focus : undefined;

  const user = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId },
    include: {
      quests: true
    }
  });

  if (!user) redirect("/auth/sign-in");

  const allQuests = await prisma.quest.findMany();
  
  const completedQuestIds = new Set(
      user.quests.filter(uq => uq.status === 'COMPLETED').map(uq => uq.questId)
  );
  const inProgressQuestIds = new Set(
      user.quests.filter(uq => uq.status === 'IN_PROGRESS').map(uq => uq.questId)
  );

  const enrichedQuests: QuestDefinition[] = allQuests.map(q => {
      let status = 'locked';

      if (completedQuestIds.has(q.id)) {
          status = 'completed';
      } else if (inProgressQuestIds.has(q.id)) {
          status = 'in_progress';
      } else {
          // Check prerequisites
          const prereqsMet = q.prerequisites.every(preId => completedQuestIds.has(preId));
          if (prereqsMet) {
              status = 'available';
          }
      }

      return {
          ...q,
          ...(QUEST_CONTENT[q.id] || {}),
          prerequisites: q.prerequisites as string[],
          status
      };
  });

  const inProgressQuests = enrichedQuests.filter(q => q.status === 'in_progress');
  const availableQuests = enrichedQuests.filter(q => q.status === 'available');
  const lockedQuests = enrichedQuests.filter(q => q.status === 'locked');
  const completedQuests = enrichedQuests.filter(q => q.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour au tableau de bord
      </Link>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-heading font-bold">Tableau des Quêtes</h1>
        <p className="text-muted-foreground">Accomplissez des quêtes pour gagner de l'XP et débloquer de nouvelles compétences.</p>
      </div>

      <QuestBoard 
        inProgressQuests={inProgressQuests}
        availableQuests={availableQuests} 
        lockedQuests={lockedQuests} 
        completedQuests={completedQuests} 
        highlightId={focus}
      />
    </div>
  );
}
