"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { COPY } from "@/lib/stages";
import TextGenerateEffect from "@/components/TextGenerateEffect";

export default function Contact({ reduce, active }: { reduce: boolean; active: boolean }) {
  const [emailDone, setEmailDone] = useState(false);

  useEffect(() => {
    if (!active) setEmailDone(false);
  }, [active]);

  return (
    <motion.div
      className="contact"
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: reduce ? 0.5 : 1.5, delay: active ? 0.4 : 0, ease: "easeOut" }}
    >
      <h2 className="contact-email">
        <a href={`mailto:${COPY.contact.email}`}>
          {active ? (
            <TextGenerateEffect
              words={COPY.contact.email}
              by="chars"
              duration={0.7}
              staggerDelay={0.02}
              onComplete={() => setEmailDone(true)}
            />
          ) : (
            COPY.contact.email
          )}
        </a>
      </h2>

      {/* Los Angeles footer — reveals right after the email finishes */}
      <div className="bottom-center" aria-hidden="true">
        {active && emailDone && (
          <TextGenerateEffect words={COPY.contact.city} by="chars" duration={0.6} staggerDelay={0.04} />
        )}
      </div>
    </motion.div>
  );
}
