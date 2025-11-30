"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function PreviousButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick} className="w-full sm:w-auto">
      <ArrowLeft className="mr-2 w-4 h-4" />
      Précédent
    </Button>
  );
}
