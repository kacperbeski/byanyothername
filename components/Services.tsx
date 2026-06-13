"use client";

import { useEffect, useState } from "react";
import { COPY } from "@/lib/stages";
import TextGenerateEffect from "@/components/TextGenerateEffect";

/** Reveals each explanation line only after the previous one finishes. */
function ExplainList({ items }: { items: string[] }) {
  const [shown, setShown] = useState(0);
  return (
    <ul className="service-explain">
      {items.map((item, idx) => (
        <li key={item}>
          {idx <= shown ? (
            <TextGenerateEffect
              words={item}
              by="chars"
              duration={0.55}
              staggerDelay={0.016}
              onComplete={idx === shown ? () => setShown((v) => Math.max(v, idx + 1)) : undefined}
            />
          ) : (
            <span style={{ opacity: 0 }}>{item}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Three categories that reveal one after another; clicking one reveals its explanation underneath. */
export default function Services({ active }: { active: boolean }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  // catPhase = how many categories are allowed to start revealing
  const [catPhase, setCatPhase] = useState(0);
  const toggle = (i: number) => setOpen((prev) => ({ ...prev, [i]: !prev[i] }));

  // restart the reveal sequence (and close everything) each time we enter/leave
  useEffect(() => {
    setOpen({});
    setCatPhase(0);
  }, [active]);

  return (
    <div className="services">
      {COPY.services.map((service, i) => {
        const isOpen = !!open[i];
        const revealed = active && catPhase >= i;
        return (
          <div className="service" key={service.name}>
            <button
              type="button"
              className="service-cat"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              {revealed ? (
                <TextGenerateEffect
                  words={service.name}
                  by="chars"
                  duration={0.6}
                  staggerDelay={0.03}
                  // when this category finishes, let the next one start
                  onComplete={() => setCatPhase((p) => Math.max(p, i + 1))}
                />
              ) : (
                <span style={{ opacity: 0 }}>{service.name}</span>
              )}
            </button>

            {isOpen && <ExplainList items={service.items} />}
          </div>
        );
      })}
    </div>
  );
}
