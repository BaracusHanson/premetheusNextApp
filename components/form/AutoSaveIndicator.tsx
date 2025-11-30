"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface AutoSaveIndicatorProps {
  status: "saved" | "saving" | "error" | "idle";
}

export function AutoSaveIndicator({ status }: AutoSaveIndicatorProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence mode="wait">
            {status === "saving" && (
                <motion.div 
                    key="saving"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-background border shadow-lg px-4 py-2 rounded-full text-sm text-muted-foreground"
                >
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Sauvegarde...
                </motion.div>
            )}
            {status === "saved" && (
                <motion.div 
                    key="saved"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-green-50 border border-green-200 shadow-lg px-4 py-2 rounded-full text-sm text-green-700"
                >
                    <Check className="w-3 h-3" />
                    Enregistré
                </motion.div>
            )}
            {status === "error" && (
                <motion.div 
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-red-50 border border-red-200 shadow-lg px-4 py-2 rounded-full text-sm text-red-700"
                >
                    Erreur de sauvegarde
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
