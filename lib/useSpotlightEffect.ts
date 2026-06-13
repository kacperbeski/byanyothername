// @ts-nocheck
"use client";
import { useEffect, useRef } from "react";

/**
 * Additive spotlight: draws a soft glow at the cursor on a transparent canvas.
 * The canvas is composited with `mix-blend-mode: screen` (see globals.css), so
 * instead of darkening the page it LIGHTS UP whatever is beneath the cursor.
 */
export default function useSpotlightEffect(config = {}) {
  const {
    spotlightSize = 200, // radius in px
    spotlightIntensity = 0.8, // 0–1: brightness of the light
    fadeSpeed = 0.1, // how fast the light follows the cursor (lerp factor)
    glowColor = "255, 255, 255", // "R, G, B"
    pulseSpeed = 2000, // ms per gentle breathing cycle
    pulseAmount = 0.1, // size swing per cycle (±)
    cursorDotSize = 2, // radius of the inverting dot that replaces the OS cursor
    cursorGlowSize = 0, // radius of a second, smaller glow pinned to the exact pointer (0 = off)
    cursorGlowIntensity = 0.9, // brightness of that smaller glow
    appearDelay = 0, // ms before the spotlight (and cursor-hide) kicks in; fades in after
  } = config;

  const canvasRef = useRef(null);
  const spotlightPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // desktop only
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let disposed = false;
    let teardown = () => {};

    // start the whole effect after appearDelay, then fade it in
    const timer = setTimeout(() => {
      if (disposed) return;
      teardown = setup();
    }, appearDelay);

    function setup() {
    // hide the OS cursor; optionally replace it with an inverting dot
    document.documentElement.classList.add("spotlight-on");
    let dot = null;
    if (cursorDotSize > 0) {
      dot = document.createElement("div");
      dot.className = "cursor-dot";
      dot.style.width = `${cursorDotSize * 2}px`;
      dot.style.height = `${cursorDotSize * 2}px`;
      dot.style.marginLeft = `${-cursorDotSize}px`;
      dot.style.marginTop = `${-cursorDotSize}px`;
      document.body.appendChild(dot);
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const lerp = (a, b, f) => a + (b - a) * f;

    // start centered so there's no glow stuck in the corner on load
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    spotlightPos.current = { ...center };
    targetPos.current = { ...center };

    const onMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    const render = () => {
      spotlightPos.current.x = lerp(spotlightPos.current.x, targetPos.current.x, fadeSpeed);
      spotlightPos.current.y = lerp(spotlightPos.current.y, targetPos.current.y, fadeSpeed);
      const x = spotlightPos.current.x;
      const y = spotlightPos.current.y;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pulse = 1 + pulseAmount * Math.sin((Date.now() / pulseSpeed) * Math.PI * 2);
      const r = spotlightSize * pulse;

      // single smooth falloff (one core → transparent edge) to avoid a visible inner ring
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${glowColor}, ${spotlightIntensity})`);
      g.addColorStop(1, `rgba(${glowColor}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // second, smaller breathing glow pinned to the exact pointer (breathes out of phase)
      if (cursorGlowSize > 0) {
        const tx = targetPos.current.x;
        const ty = targetPos.current.y;
        const pulse2 = 1 + pulseAmount * Math.sin((Date.now() / pulseSpeed) * Math.PI * 2 + Math.PI);
        const r2 = cursorGlowSize * pulse2;
        const g2 = ctx.createRadialGradient(tx, ty, 0, tx, ty, r2);
        g2.addColorStop(0, `rgba(${glowColor}, ${cursorGlowIntensity})`);
        g2.addColorStop(1, `rgba(${glowColor}, 0)`);
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(tx, ty, r2, 0, Math.PI * 2);
        ctx.fill();
      }

      // move the inverting dot to the exact pointer position
      if (dot) dot.style.transform = `translate3d(${targetPos.current.x}px, ${targetPos.current.y}px, 0)`;

      raf.current = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", onMove);
    render();
    // fade the glow in
    canvas.style.opacity = "1";

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("spotlight-on");
      if (dot) dot.remove();
      if (raf.current) cancelAnimationFrame(raf.current);
      canvas.style.opacity = "0";
    };
    }

    return () => {
      disposed = true;
      clearTimeout(timer);
      teardown();
    };
  }, [
    spotlightSize,
    spotlightIntensity,
    fadeSpeed,
    glowColor,
    pulseSpeed,
    pulseAmount,
    cursorDotSize,
    cursorGlowSize,
    cursorGlowIntensity,
    appearDelay,
  ]);

  return canvasRef;
}
