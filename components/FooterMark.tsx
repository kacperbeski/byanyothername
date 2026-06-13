"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { COPY } from "@/lib/stages";
import TextGenerateEffect from "@/components/TextGenerateEffect";
import { taglineTotalMs } from "@/components/Tagline";

/**
 * "by any other name" pinned at the footer position on the middle pages
 * (everything except the first/name page and the last/contact page).
 * Reveals with the text effect the first time it appears, then just stays
 * fixed (no re-animation), and fades out on the way into the contact page.
 */
export default function FooterMark({ active }: { active: number }) {
  const visible = active >= 1 && active <= 5;

  // reveal once it first becomes visible, then keep it mounted.
  // first appearance (on the tagline page) waits for that page's content to finish.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!visible || revealed) return;
    const delay = active === 1 ? taglineTotalMs() : 0;
    const t = setTimeout(() => setRevealed(true), delay);
    return () => clearTimeout(t);
  }, [visible, revealed, active]);

  return (
    <motion.div
      className="bottom-center footer-mark"
      aria-hidden="true"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {revealed && (
        <TextGenerateEffect words={COPY.wordmark} by="chars" duration={0.6} staggerDelay={0.04} />
      )}
    </motion.div>
  );
}
