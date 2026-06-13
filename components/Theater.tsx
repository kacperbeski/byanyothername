"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { PATH_FOR, STAGE_META, STAGE_ORDER, pathToIndex, type StageId } from "@/lib/stages";
import Name from "@/components/Name";
import Tagline from "@/components/Tagline";
import About from "@/components/About";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Chrome from "@/components/Chrome";

const LAST = STAGE_ORDER.length - 1;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** One layer of the continuous push. d = index - z: 1 = a stage deeper, -1 = passed. */
function StageLayer({
  index,
  z,
  active,
  label,
  children,
}: {
  index: number;
  z: MotionValue<number>;
  active: boolean;
  label: string;
  children: ReactNode;
}) {
  const d = useTransform(z, (v) => index - v);
  const opacity = useTransform(d, [-0.72, 0, 0.85], [0, 1, 0]);
  /* never fully sharp — a faint blur stays even at rest */
  const blurPx = useTransform(d, [-1, 0, 1], [22, 0.7, 15]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  const scale = useTransform(d, [-1, 0, 1], [1.5, 1, 0.95]);
  const visibility = useTransform(opacity, (o) => (o < 0.012 ? "hidden" : "visible")) as MotionValue<"hidden" | "visible">;

  // always render the depth (blur + scale + opacity) so the effect shows on mobile too
  const style = { opacity, filter, scale, visibility };

  return (
    <motion.section
      className="stage"
      style={{ ...style, pointerEvents: active ? "auto" : "none", zIndex: active ? 10 : 5 }}
      inert={!active}
      aria-label={label}
    >
      <div className="stage-inner">
        {children}
      </div>
    </motion.section>
  );
}

export default function Theater({ initialStage }: { initialStage: StageId }) {
  const initialIndex = STAGE_ORDER.indexOf(initialStage);
  const reduce = useReducedMotion() ?? false;

  const rawZ = useMotionValue(initialIndex);
  const z = useSpring(rawZ, { stiffness: 90, damping: 22, mass: 0.7 });

  const [active, setActive] = useState(initialIndex);
  const activeRef = useRef(active);
  activeRef.current = active;

  const animRef = useRef<{ stop: () => void } | null>(null);
  const lastStep = useRef(0);
  const touchY = useRef(0);
  const touchT = useRef(0);

  const setStage = useCallback((i: number) => {
    setActive(i);
    const id = STAGE_ORDER[i];
    if (window.location.pathname !== PATH_FOR[id]) {
      window.history.pushState({ stage: id }, "", PATH_FOR[id]);
    }
    document.title = STAGE_META[id].title;
  }, []);

  /** Snap: smooth scroll in/out, but lock onto a stage. */
  const settle = useCallback(
    (target: number) => {
      const t = clamp(Math.round(target), 0, LAST);
      animRef.current?.stop();
      animRef.current = animate(rawZ, t, {
        duration: reduce ? 0.35 : 0.75,
        ease: [0.25, 0.1, 0.2, 1],
      });
      setStage(t);
    },
    [rawZ, reduce, setStage]
  );

  const step = useCallback(
    (dir: 1 | -1) => settle(activeRef.current + dir),
    [settle]
  );

  /* one scroll = one screen (discrete, with the same smooth travel) */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 20) return;
      const now = Date.now();
      if (now - lastStep.current < 1100) return;
      lastStep.current = now;
      step(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [step]);

  /* keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        settle(0);
      } else if (e.key === "End") {
        e.preventDefault();
        settle(LAST);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, settle]);

  /* touch: one swipe = one screen */
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY;
      touchT.current = Date.now();
    };
    const onEnd = (e: TouchEvent) => {
      if (Date.now() - touchT.current > 700) return;
      const dy = touchY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 50) return;
      const now = Date.now();
      if (now - lastStep.current < 900) return;
      lastStep.current = now;
      step(dy > 0 ? 1 : -1);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [step]);

  /* browser back / forward */
  useEffect(() => {
    const onPop = () => {
      const i = pathToIndex(window.location.pathname);
      if (i === null || i === activeRef.current) return;
      animRef.current?.stop();
      animRef.current = animate(rawZ, i, { duration: reduce ? 0.35 : 0.8, ease: [0.25, 0.1, 0.2, 1] });
      setActive(i);
      document.title = STAGE_META[STAGE_ORDER[i]].title;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [rawZ, reduce]);

  return (
    <main className="theater">
      <StageLayer index={0} z={z} active={active === 0} label="Home">
        <Name showCurtain={initialIndex === 0} reduce={reduce} />
      </StageLayer>
      <StageLayer index={1} z={z} active={active === 1} label="Home">
        <Tagline />
      </StageLayer>
      <StageLayer index={2} z={z} active={active === 2} label="About">
        <About />
      </StageLayer>
      <StageLayer index={3} z={z} active={active === 3} label="Services">
        <Services reduce={reduce} active={active === 3} />
      </StageLayer>
      <StageLayer index={4} z={z} active={active === 4} label="Clients">
        <Clients />
      </StageLayer>
      <StageLayer index={5} z={z} active={active === 5} label="Team">
        <Team />
      </StageLayer>
      <StageLayer index={6} z={z} active={active === 6} label="Contact">
        <Contact reduce={reduce} active={active === 6} />
      </StageLayer>

      <Chrome stage={STAGE_ORDER[active]} />
    </main>
  );
}
