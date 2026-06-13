"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COPY } from "@/lib/stages";

/** Three services; clicking crossfades the category and its explanation, both directions. */
export default function Services({ reduce, active }: { reduce: boolean; active: boolean }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setOpen((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="services">
      {COPY.services.map((service, i) => {
        const delay = reduce ? 0.1 + i * 0.15 : 0.3 + i * 0.5;
        const isOpen = !!open[i];
        return (
          <motion.button
            type="button"
            className="service"
            key={service.name}
            onClick={() => toggle(i)}
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: reduce ? 0.4 : 1.0, delay: active ? delay : 0, ease: "easeOut" }}
            aria-expanded={isOpen}
          >
            {!reduce && <span className="pool" aria-hidden="true" />}
            <span className="flip">
              <motion.h2
                initial={false}
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.45, delay: isOpen ? 0 : 0.3, ease: "easeOut" }}
                aria-hidden={isOpen}
              >
                {service.name}
              </motion.h2>
              <motion.ul
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.45, delay: isOpen ? 0.3 : 0, ease: "easeOut" }}
                aria-hidden={!isOpen}
              >
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </motion.ul>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
