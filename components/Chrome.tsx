"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type StageId } from "@/lib/stages";

/** Footer line, bottom center (fades on change). */
export default function Chrome({ stage }: { stage: StageId }) {
  const footer = stage === "contact" ? "Los Angeles" : "© By Any Other Name 2026";

  return (
    <div className="chrome">
      <div className="bottom-center" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.span
            key={footer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {footer}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
