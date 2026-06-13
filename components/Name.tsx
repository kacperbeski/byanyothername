"use client";

import { motion } from "framer-motion";
import { COPY } from "@/lib/stages";

/** First page: just the name of the agency, fading in after a 1s beat. */
export default function Name({ reduce }: { reduce: boolean }) {
  return (
    <div className="center-layer">
      <motion.h1
        className="wordmark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.8 : 2, delay: 1.5, ease: "easeOut" }}
      >
        {COPY.wordmark}
      </motion.h1>
    </div>
  );
}
