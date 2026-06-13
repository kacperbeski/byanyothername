"use client";

import useSpotlightEffect from "@/lib/useSpotlightEffect";

/** Cursor that lights up the page beneath it (screen-blended glow). */
export default function Spotlight() {
  const canvasRef = useSpotlightEffect({
    spotlightSize: 62.5,
    spotlightIntensity: 0.8,
    glowColor: "242, 240, 235",
    fadeSpeed: 0.075,
    pulseSpeed: 6000,
    pulseAmount: 0.15,
    cursorDotSize: 3,
    // inner pointer glow removed — outer spotlight only
    cursorGlowSize: 0,
    // appear just as the name finishes fading in (name: 1.5s delay + 2s fade)
    appearDelay: 3500,
  });

  return <canvas ref={canvasRef} className="spotlight" aria-hidden="true" />;
}
