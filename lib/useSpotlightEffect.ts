// @ts-nocheck
"use client";
import { useEffect, useRef, useState } from "react";

const useSpotlightEffect = (config = {}) => {
  const {
    spotlightSize = 300, // radius in px (circle diameter ≈ 2×)
    spotlightIntensity = 1, // 0–1: how fully the centre clears the darkness
    overlayOpacity = 0.82, // how dark the rest of the page gets (0–1)
    fadeSpeed = 0.12, // lerp factor: higher = the light snaps to cursor faster
    glowColor = "242, 240, 235", // soft halo colour (site ink)
    pulseSpeed = 4000, // ms per gentle "breathing" cycle
    pulseAmount = 0.15, // size swing per cycle (0.15 = ±15%)
    cursorDotSize = 2, // radius of the inverting dot that replaces the system cursor
  } = config;

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const spotlightPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);
  const [, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    // Only run the spotlight for fine pointers (mouse) and when motion is allowed.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    // hide the system cursor while the spotlight is active
    document.documentElement.classList.add("spotlight-on");

    // inverting cursor dot — a blended DOM element (canvas can't blend with the page below it)
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.style.width = `${cursorDotSize * 2}px`;
    dot.style.height = `${cursorDotSize * 2}px`;
    dot.style.marginLeft = `${-cursorDotSize}px`;
    dot.style.marginTop = `${-cursorDotSize}px`;
    document.body.appendChild(dot);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const lerp = (start, end, factor) => start + (end - start) * factor;

    // Start centred so the page doesn't load dark with a corner hole.
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    spotlightPos.current = { ...center };
    targetPos.current = { ...center };

    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setIsHovered(true);
    };
    const handleMouseLeave = () => setIsHovered(false);

    const render = () => {
      if (!canvas || !ctx) return;

      spotlightPos.current.x = lerp(spotlightPos.current.x, targetPos.current.x, fadeSpeed);
      spotlightPos.current.y = lerp(spotlightPos.current.y, targetPos.current.y, fadeSpeed);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark overlay over everything
      ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gentle pulse
      const pulseScale = 1 + pulseAmount * Math.sin((Date.now() / pulseSpeed) * Math.PI * 2);
      const currentSpotlightSize = spotlightSize * pulseScale;

      // Punch the spotlight hole out of the overlay
      const gradient = ctx.createRadialGradient(
        spotlightPos.current.x,
        spotlightPos.current.y,
        0,
        spotlightPos.current.x,
        spotlightPos.current.y,
        currentSpotlightSize
      );
      gradient.addColorStop(0, `rgba(${glowColor}, ${spotlightIntensity})`);
      gradient.addColorStop(0.5, `rgba(${glowColor}, ${spotlightIntensity * 0.5})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(spotlightPos.current.x, spotlightPos.current.y, currentSpotlightSize, 0, Math.PI * 2);
      ctx.fill();

      // Soft halo on top
      ctx.globalCompositeOperation = "source-over";
      const glowGradient = ctx.createRadialGradient(
        spotlightPos.current.x,
        spotlightPos.current.y,
        0,
        spotlightPos.current.x,
        spotlightPos.current.y,
        currentSpotlightSize * 1.2
      );
      glowGradient.addColorStop(0, `rgba(${glowColor}, 0.18)`);
      glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(spotlightPos.current.x, spotlightPos.current.y, currentSpotlightSize * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // move the inverting dot to the exact pointer position
      dot.style.transform = `translate3d(${targetPos.current.x}px, ${targetPos.current.y}px, 0)`;

      animationFrame.current = requestAnimationFrame(render);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.classList.remove("spotlight-on");
      dot.remove();
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [
    spotlightSize,
    spotlightIntensity,
    overlayOpacity,
    fadeSpeed,
    glowColor,
    pulseSpeed,
    pulseAmount,
    cursorDotSize,
  ]);

  return canvasRef;
};

export default useSpotlightEffect;
