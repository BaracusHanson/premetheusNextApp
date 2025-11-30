import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import SkillTreeClient from "@/components/SkillTreeClient";
import { ArrowLeft, Network } from "lucide-react";
import Link from "next/link";

export default async function SkillTreePage() {
  const { userId } = auth();
  if (!userId) redirect("/auth/sign-in");

  const user = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId },
    include: {
      quests: { select: { questId: true, status: true } }
    }
  });

  if (!user) redirect("/auth/sign-in");

  // Fetch all quests to build the tree
  const quests = await prisma.quest.findMany();

  // Build Set of completed quest IDs
  const completedIds = new Set(
    user.quests
        .filter(uq => uq.status === 'COMPLETED')
        .map(uq => uq.questId)
  );

  return (
    <div className="container py-8 space-y-6 h-[calc(100vh-80px)] flex flex-col">
       <div className="flex items-center justify-between shrink-0">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-3xl font-heading font-bold text-primary flex items-center gap-2">
                    <Network className="h-8 w-8" />
                    Arbre de Compétences
                </h1>
             </div>
             <p className="text-muted-foreground ml-8">Visualisez votre parcours et les prochaines étapes.</p>
          </div>
       </div>

       <div className="flex-1 min-h-0">
          <SkillTreeClient quests={quests} completedIds={completedIds} />
       </div>
    </div>
  );
}
