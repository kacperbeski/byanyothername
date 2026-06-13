"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COPY } from "@/lib/stages";

/**
 * Three names. Click one: everything fades out, and the photo,
 * name, and description fade in together, centered.
 */
export default function Team() {
  const [active, setActive] = useState<string | null>(null);
  const person = COPY.team.find((p) => p.id === active) ?? null;

  // preload portraits up front so they're decoded and fade in smoothly (no pop-in)
  useEffect(() => {
    COPY.team.forEach((p) => {
      const img = new window.Image();
      img.src = p.photo;
    });
  }, []);

  return (
    <div className="team2" onClick={() => setActive(null)}>
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
            {COPY.team.map((p) => (
              <button
                key={p.id}
                type="button"
                className="team-name"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(p.id);
                }}
              >
                {p.name}
              </button>
            ))}
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
              <p className="team-bio">{person.bio}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
