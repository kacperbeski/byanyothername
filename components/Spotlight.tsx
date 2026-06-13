"use client";

import useSpotlightEffect from "@/lib/useSpotlightEffect";

/** Full-screen spotlight: darkens the page and reveals a glowing circle at the cursor. */
export default function Spotlight() {
  const canvasRef = useSpotlightEffect({
    spotlightSize: 100,
    spotlightIntensity: 0.7,
    overlayOpacity: 0.82,
    fadeSpeed: 0.113,
    glowColor: "242, 240, 235",
    pulseSpeed: 4000,
    pulseAmount: 0.15,
    cursorDotSize: 2,
  });

  return <canvas ref={canvasRef} className="spotlight" aria-hidden="true" />;
}
