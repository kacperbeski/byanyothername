"use client";

import { useEffect, useState } from "react";
import { COPY } from "@/lib/stages";
import TextGenerateEffect from "@/components/TextGenerateEffect";

const DURATION = 1.0; // seconds per character
const STAGGER = 0.025; // seconds between characters
const GAP_MS = 500; // pause after paragraph 1 finishes before paragraph 2 starts

export default function About({ active }: { active: boolean }) {
  // phase 0 = idle, 1 = first paragraph, 2 = second paragraph
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) {
      setPhase(0);
      return;
    }
    setPhase(1);
    const firstChars = COPY.about[0].length;
    const firstDoneMs = ((firstChars - 1) * STAGGER + DURATION) * 1000;
    const t = setTimeout(() => setPhase(2), firstDoneMs + GAP_MS);
    return () => clearTimeout(t);
  }, [active]);

  const ready = (i: number) => (i === 0 ? phase >= 1 : phase >= 2);

  return (
    <div className="center-layer">
      <div className="about-statement">
        {COPY.about.map((para, i) => (
          <div className="about-para" key={i}>
            {!active ? (
              para
            ) : ready(i) ? (
              <TextGenerateEffect words={para} by="chars" duration={DURATION} staggerDelay={STAGGER} />
            ) : (
              <span style={{ opacity: 0 }}>{para}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
