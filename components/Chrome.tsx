"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type StageId } from "@/lib/stages";

/** Footer line bottom center (fades on change) + step arrows. */
export default function Chrome({
  index,
  total,
  stage,
  onStep,
}: {
  index: number;
  total: number;
  stage: StageId;
  onStep: (dir: 1 | -1) => void;
}) {
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

      <div className="corner br steppers">
        <button
          type="button"
          onClick={() => onStep(-1)}
          disabled={index === 0}
          aria-label="previous page"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onStep(1)}
          disabled={index === total - 1}
          aria-label="next page"
        >
          ↓
        </button>
      </div>
    </div>
  );
}
