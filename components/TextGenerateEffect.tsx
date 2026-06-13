"use client";

import { motion, stagger, useAnimate, type Easing } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

type Props = {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  staggerDelay?: number;
  /** "chars" gives a smooth continuous wash; "words" reveals word by word. */
  by?: "chars" | "words";
  /** easing for each segment's fade. */
  ease?: Easing;
  /** fires once the whole reveal has finished. */
  onComplete?: () => void;
};

export default function TextGenerateEffect({
  words,
  className = "",
  filter = true,
  duration = 0.5,
  staggerDelay = 0.2,
  by = "words",
  ease = "easeInOut",
  onComplete,
}: Props) {
  const [scope, animate] = useAnimate();
  const segments = useMemo(
    () => (by === "chars" ? Array.from(words) : words.split(" ")),
    [words, by]
  );

  // keep the latest callback without re-running the animation effect
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (scope.current) {
      const controls = animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration,
          ease,
          delay: stagger(staggerDelay),
        }
      );
      controls.then(() => onCompleteRef.current?.());
    }
  }, [animate, duration, filter, scope, staggerDelay, ease]);

  return (
    <div className={className} data-slot="text-generate-effect">
      <motion.div ref={scope}>
        {segments.map((seg, idx) => (
          <motion.span
            key={`${seg}-${idx}`}
            style={{
              opacity: 0,
              filter: filter ? "blur(10px)" : "none",
              whiteSpace: "pre-wrap",
              willChange: "transform, opacity, filter",
            }}
          >
            {by === "chars" ? seg : `${seg} `}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
