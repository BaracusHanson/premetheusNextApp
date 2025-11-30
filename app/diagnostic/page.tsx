import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { DiagnosticBoard } from "@/components/diagnostic/DiagnosticBoard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function DiagnosticPage({ searchParams }: { searchParams: { tab?: string } }) {
  const { userId } = auth();
  if (!userId) redirect("/auth/sign-in");

  let user = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId }
  });

  if (!user) {
    // If user doesn't exist in DB but is authenticated in Clerk, create the profile
    const newUser = await prisma.userProfile.create({
        data: {
            clerkUserId: userId,
            displayName: "Nouvel Utilisateur",
            level: 1,
            totalXP: 0
        }
    });
    
    // Use the new user
    user = newUser;
  }

  // Fetch all form answers
  const formAnswers = await prisma.userFormAnswers.findMany({
    where: { userId: user.id }
  });

  // Flatten answers
  const initialAnswers: Record<string, any> = {};
  formAnswers.forEach(record => {
    if (record.data && typeof record.data === 'object') {
        Object.entries(record.data as Record<string, any>).forEach(([key, value]) => {
            initialAnswers[key] = value;
        });
    }
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Back Navigation */}
      <Link href="/journeys" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux parcours
      </Link>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-heading font-bold">Diagnostic de Vie</h1>
        <p className="text-muted-foreground">
            Remplissez cet inventaire à votre rythme pour compléter vos quêtes. 
            Vous pouvez revenir modifier ces informations à tout moment.
        </p>
      </div>

      <DiagnosticBoard 
        initialAnswers={initialAnswers} 
        defaultTab={searchParams.tab}
      />
    </div>
  );
}
