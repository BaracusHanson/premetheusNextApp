import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, Share2 } from "lucide-react";
import { SkillTreeGraph } from "@/components/SkillTreeGraph";
import { generateUserSkillTree } from "@/lib/skillEngine";
import { Button } from "@/components/ui/button";

export default async function SkillTreePage() {
  const { userId } = auth();
  if (!userId) redirect("/auth/sign-in");

  const user = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId }
  });

  if (!user) redirect("/auth/sign-in");

  // Fetch all form answers
  const formAnswersRecords = await prisma.userFormAnswers.findMany({
    where: { userId: user.id }
  });

  // Flatten answers
  const answers: Record<string, any> = {};
  formAnswersRecords.forEach(record => {
    if (record.data && typeof record.data === 'object') {
        Object.assign(answers, record.data);
    }
  });

  // Generate Skill Tree
  const { nodes, edges, stats } = generateUserSkillTree(answers);

  // Sort stats by score
  const topSkills = [...stats].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="container max-w-6xl py-8 space-y-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col space-y-4 flex-shrink-0">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
           <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
        </Link>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <BrainCircuit className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Arbre de Compétences</h1>
                    <p className="text-muted-foreground text-lg">Votre profil généré par l'IA.</p>
                </div>
            </div>
            <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" /> Partager
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow min-h-0">
          {/* Main Graph Area */}
          <div className="lg:col-span-3 flex flex-col gap-4 min-h-[500px]">
              <SkillTreeGraph nodes={nodes} edges={edges} />
          </div>

          {/* Stats Panel */}
          <div className="lg:col-span-1 space-y-6">
              <div className="p-6 rounded-2xl border bg-card shadow-sm">
                  <h3 className="font-heading font-bold text-xl mb-4">Top Compétences</h3>
                  <div className="space-y-4">
                      {topSkills.map(skill => (
                          <div key={skill.id} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                  <span className="font-medium">{skill.label}</span>
                                  <span className="font-mono text-primary">{Math.round(skill.score)}</span>
                              </div>
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all duration-1000 ease-out" 
                                    style={{ width: `${Math.min(skill.score, 100)}%` }}
                                  />
                              </div>
                              <span className="text-xs text-muted-foreground">{skill.category}</span>
                          </div>
                      ))}
                      {topSkills.length === 0 && (
                          <p className="text-sm text-muted-foreground">Remplissez le diagnostic pour débloquer vos compétences.</p>
                      )}
                  </div>
              </div>

              <div className="p-6 rounded-2xl border bg-gradient-to-br from-primary/10 to-transparent">
                  <h3 className="font-heading font-bold text-lg mb-2 text-primary">Conseil IA</h3>
                  <p className="text-sm text-muted-foreground">
                      {stats.length > 0 
                        ? "Votre profil est orienté vers les Soft Skills. Pensez à valider des compétences techniques pour équilibrer votre arbre."
                        : "Commencez par renseigner votre parcours professionnel pour voir apparaître vos premières compétences."
                      }
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
}

