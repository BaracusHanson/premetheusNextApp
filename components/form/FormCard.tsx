"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 ring-1 ring-gray-200/50">
        <CardContent className="p-8">
            {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
