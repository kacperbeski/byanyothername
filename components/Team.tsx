"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COPY } from "@/lib/stages";
import TextGenerateEffect from "@/components/TextGenerateEffect";

/**
 * Three names. Click one: everything fades out, and the photo,
 * name, and description fade in together, centered.
 */
export default function Team({ active }: { active: boolean }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  // how many names are allowed to start revealing (sequential, like Services)
  const [namePhase, setNamePhase] = useState(0);
  const person = COPY.team.find((p) => p.id === activeId) ?? null;

  // preload portraits up front so they're decoded and fade in smoothly
  useEffect(() => {
    COPY.team.forEach((p) => {
      const img = new window.Image();
      img.src = p.photo;
    });
  }, []);

  // reset the selection whenever we leave the page
  useEffect(() => {
    if (!active) setActiveId(null);
  }, [active]);

  // restart the name reveal sequence each time we enter the names view
  useEffect(() => {
    setNamePhase(0);
  }, [active, activeId]);

  return (
    <div className="team2" onClick={() => setActiveId(null)}>
      <AnimatePresence mode="wait">
        {!person ? (
          <motion.div
            key="names"
            className="team-names"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {COPY.team.map((p, idx) => {
              const revealed = active && namePhase >= idx;
              return (
                <button
                  key={p.id}
                  type="button"
                  className="team-name"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveId(p.id);
                  }}
                >
                  {!active ? (
                    p.name
                  ) : revealed ? (
                    <TextGenerateEffect
                      words={p.name}
                      by="chars"
                      duration={0.6}
                      staggerDelay={0.025}
                      onComplete={() => setNamePhase((v) => Math.max(v, idx + 1))}
                    />
                  ) : (
                    <span style={{ opacity: 0 }}>{p.name}</span>
                  )}
                </button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key={person.id}
            className="team-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="team-anchor">
              <img
                className="team-photo"
                src={person.photo}
                alt={`${person.name}, black and white portrait`}
                decoding="async"
              />
              <h2 className="team-name as-label">{person.name}</h2>
              <TextGenerateEffect
                className="team-bio"
                words={person.bio}
                by="chars"
                duration={0.7}
                staggerDelay={0.012}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
