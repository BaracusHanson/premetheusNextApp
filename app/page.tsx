import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/diagnostic");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-primary/5 text-center px-4">
      <div className="max-w-2xl space-y-8">
        <div className="space-y-4">
            <div className="w-20 h-20 bg-primary text-white rounded-2xl flex items-center justify-center text-4xl font-bold mx-auto shadow-lg shadow-primary/30">
                P
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground tracking-tight">
                Gamifiez votre Parcours de Vie
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Transformez votre développement personnel en un RPG épique. Suivez vos compétences, gagnez des badges et montez de niveau dans la vraie vie avec Prometheus.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 shadow-xl shadow-primary/20">
                    Commencer l'Aventure
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
            <Link href="/auth/sign-in">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                    Continuer l'Aventure
                </Button>
            </Link>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-80">
            <div className="space-y-2">
                <h3 className="font-bold text-lg">Arbres de Compétences</h3>
                <p className="text-sm text-muted-foreground">Visualisez vos progrès dans différents domaines de la vie.</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-bold text-lg">Quêtes & XP</h3>
                <p className="text-sm text-muted-foreground">Accomplissez des tâches réelles pour gagner de l'expérience.</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-bold text-lg">Succès</h3>
                <p className="text-sm text-muted-foreground">Débloquez des badges pour vos jalons.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
