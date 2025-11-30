"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ContinueButton({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  return (
    <Button onClick={onClick} disabled={disabled} className="w-full sm:w-auto">
      Continuer
      <ArrowRight className="ml-2 w-4 h-4" />
    </Button>
  );
}
