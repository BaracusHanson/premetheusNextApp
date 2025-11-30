import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h2 className="text-4xl font-bold mb-4">404 - Page Non Trouvée</h2>
      <p className="text-muted-foreground mb-8">Désolé, la page que vous recherchez n'existe pas.</p>
      <Link href="/dashboard">
        <Button>Retour au tableau de bord</Button>
      </Link>
    </div>
  );
}
