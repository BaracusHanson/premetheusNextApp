"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ConditionalFieldProps {
  show: boolean;
  children: React.ReactNode;
}

export function ConditionalField({ show, children }: ConditionalFieldProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0, overflow: "hidden" }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-2">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
