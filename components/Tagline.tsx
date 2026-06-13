"use client";

import { useEffect, useState } from "react";
import { COPY } from "@/lib/stages";
import TextGenerateEffect from "@/components/TextGenerateEffect";

// character-based reveal: long per-char fade + tiny stagger = smooth continuous wash
const DURATION = 0.8; // seconds each character takes to fade in (long → heavy overlap)
const STAGGER = 0.02; // seconds between characters (small → continuous, not steppy)

/** Total ms for both tagline lines to finish revealing (used to time the footer). */
export function taglineTotalMs() {
  const l1 = COPY.tagline[0].length;
  const l2 = COPY.tagline[1].length;
  const firstLineMs = ((l1 - 1) * STAGGER + DURATION) * 1000 + 150;
  const line2Ms = ((l2 - 1) * STAGGER + DURATION) * 1000;
  return firstLineMs + line2Ms;
}

export default function Tagline({ active }: { active: boolean }) {
  // phase 0 = idle, 1 = first line animating, 2 = second line starts
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) {
      setPhase(0);
      return;
    }
    setPhase(1);
    // start the second line only after the first line has finished
    const chars = COPY.tagline[0].length;
    const firstLineMs = ((chars - 1) * STAGGER + DURATION) * 1000 + 150;
    const t = setTimeout(() => setPhase(2), firstLineMs);
    return () => clearTimeout(t);
  }, [active]);

  const lineReady = (i: number) => (i === 0 ? phase >= 1 : phase >= 2);

  return (
    <div className="center-layer">
      <div className="tagline">
        {COPY.tagline.map((line, i) => (
          <div className="tagline-line" key={i}>
            {!active ? (
              line
            ) : lineReady(i) ? (
              <TextGenerateEffect words={line} by="chars" duration={DURATION} staggerDelay={STAGGER} />
            ) : (
              // hold layout but stay invisible until it's this line's turn
              <span style={{ opacity: 0 }}>{line}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
