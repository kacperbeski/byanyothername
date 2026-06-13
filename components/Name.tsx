"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { COPY } from "@/lib/stages";

/** First page: just the name of the agency. Curtain plays once on entry. */
export default function Name({
  showCurtain,
  reduce,
}: {
  showCurtain: boolean;
  reduce: boolean;
}) {
  const [curtain, setCurtain] = useState(showCurtain && !reduce);
  useEffect(() => {
    if (!curtain) return;
    const t = setTimeout(() => setCurtain(false), 1700);
    return () => clearTimeout(t);
  }, [curtain]);

  const baseDelay = curtain ? 1.0 : 0.3;

  return (
    <div className="center-layer">
      {/* curtain — used once, for the entry only */}
      {curtain && (
        <>
          <motion.div
            className="curtain-half left-half"
            initial={{ x: 0 }}
            animate={{ x: "-101%" }}
            transition={{ duration: 1.25, delay: 0.25, ease: [0.6, 0, 0.25, 1] }}
            aria-hidden="true"
          />
          <motion.div
            className="curtain-half right-half"
            initial={{ x: 0 }}
            animate={{ x: "101%" }}
            transition={{ duration: 1.25, delay: 0.25, ease: [0.6, 0, 0.25, 1] }}
            aria-hidden="true"
          />
        </>
      )}

      <motion.h1
        className="wordmark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.6 : 1.8, delay: baseDelay, ease: "easeOut" }}
      >
        {COPY.wordmark}
      </motion.h1>
    </div>
  );
}
