"use client";

import { useEffect, useState } from "react";
import { COPY } from "@/lib/stages";
import TextGenerateEffect from "@/components/TextGenerateEffect";

/** Reveals each explanation line only after the previous one finishes; calls onDone at the end. */
function ExplainList({
  items,
  start = true,
  onDone,
}: {
  items: string[];
  start?: boolean;
  onDone?: () => void;
}) {
  const [shown, setShown] = useState(start ? 0 : -1);
  useEffect(() => {
    if (start) setShown((s) => (s < 0 ? 0 : s));
  }, [start]);

  return (
    <ul className="service-explain">
      {items.map((item, idx) => {
        const revealed = start && idx <= shown;
        return (
          <li key={item}>
            {revealed ? (
              <TextGenerateEffect
                words={item}
                by="chars"
                duration={0.55}
                staggerDelay={0.016}
                onComplete={
                  idx === shown
                    ? () => {
                        if (idx + 1 < items.length) setShown(idx + 1);
                        else onDone?.();
                      }
                    : undefined
                }
              />
            ) : (
              <span style={{ opacity: 0 }}>{item}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Desktop: categories reveal in sequence; click one to reveal its explanation (absolutely
 * positioned, so nothing moves).
 * Mobile: everything is laid out in its final place — the three categories reveal one after
 * another, then all the explanations reveal one by one. No tapping, no jumping.
 */
export default function Services({ active }: { active: boolean }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [catPhase, setCatPhase] = useState(0); // how many categories may reveal
  const [explainPhase, setExplainPhase] = useState(-1); // mobile: which category's explanation is revealing
  const toggle = (i: number) => setOpen((prev) => ({ ...prev, [i]: !prev[i] }));

  // restart the sequence on enter/leave (or when the layout mode changes)
  useEffect(() => {
    setOpen({});
    setCatPhase(0);
    setExplainPhase(-1);
  }, [active, isMobile]);

  // on mobile, once all categories have revealed, kick off the explanations
  useEffect(() => {
    if (isMobile && active && catPhase >= COPY.services.length && explainPhase < 0) {
      setExplainPhase(0);
    }
  }, [isMobile, active, catPhase, explainPhase]);

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
              onClick={() => !isMobile && toggle(i)}
              aria-expanded={isMobile ? true : isOpen}
            >
              {revealed ? (
                <TextGenerateEffect
                  words={service.name}
                  by="chars"
                  duration={0.6}
                  staggerDelay={0.03}
                  onComplete={() => setCatPhase((p) => Math.max(p, i + 1))}
                />
              ) : (
                <span style={{ opacity: 0 }}>{service.name}</span>
              )}
            </button>

            {isMobile ? (
              <ExplainList
                items={service.items}
                start={explainPhase >= i}
                onDone={() => setExplainPhase((p) => Math.max(p, i + 1))}
              />
            ) : (
              isOpen && <ExplainList items={service.items} />
            )}
          </div>
        );
      })}
    </div>
  );
}
