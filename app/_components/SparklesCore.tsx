"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface SparklesCoreProps {
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
  /**
   * When true, particles spawn as tiny stars concentrated near the top of the
   * canvas (mimicking the Aceternity "sparkles below a line" look).
   * When false (default), particles are distributed across the full canvas.
   */
  starField?: boolean;
}

type Particle = {
  x: number; y: number; radius: number;
  opacity: number; opacityDir: number; opacitySpeed: number;
  vx: number; vy: number;
};

function spawnParticle(w: number, h: number, minSize: number, maxSize: number, speed: number, starField: boolean): Particle {
  // starField: bias spawn toward y=0 using squared random (exponential concentration at top)
  const y = starField
    ? Math.pow(Math.random(), 2.2) * h
    : Math.random() * h;
  return {
    x: Math.random() * w,
    y,
    radius: minSize + Math.random() * (maxSize - minSize),
    opacity: Math.random() * 0.8,
    opacityDir: Math.random() > 0.5 ? 1 : -1,
    opacitySpeed: (0.004 + Math.random() * 0.008) * speed,
    vx: (Math.random() - 0.5) * 0.25 * speed,
    vy: (Math.random() - 0.5) * 0.2 * speed,
  };
}

export function SparklesCore({
  className = "",
  background = "transparent",
  minSize = 0.4,
  maxSize = 1.2,
  speed = 1,
  particleColor = "#FF8200",
  particleDensity = 150,
  starField = false,
}: SparklesCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let raf: number;

    const init = (w: number, h: number) => {
      particles = Array.from({ length: particleDensity }, () =>
        spawnParticle(w, h, minSize, maxSize, speed, starField)
      );
    };

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) return;
      const needsInit = canvas.width === 0 || canvas.height === 0 || particles.length === 0;
      canvas.width = w;
      canvas.height = h;
      if (needsInit) init(w, h);
    };

    resize();
    if (canvas.width === 0 || canvas.height === 0) {
      requestAnimationFrame(() => resize());
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.opacityDir * p.opacitySpeed;

        if (p.opacity >= 1) { p.opacity = 1; p.opacityDir = -1; }
        if (p.opacity <= 0) {
          Object.assign(p, spawnParticle(w, h, minSize, maxSize, speed, starField));
          p.opacity = 0;
          p.opacityDir = 1;
          continue;
        }

        // wrap edges
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        if (p.y < -4) p.y = h + 4;
        if (p.y > h + 4) p.y = -4;

        if (starField) {
          // Tiny sharp dot + subtle glow — star look
          const r = p.radius;
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
          glow.addColorStop(0, particleColor + "aa");
          glow.addColorStop(1, particleColor + "00");
          ctx.globalAlpha = p.opacity * 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          // bright core
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
        } else {
          // Original glowing orb style
          const r = p.radius * 3;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          g.addColorStop(0, particleColor);
          g.addColorStop(0.4, particleColor + "88");
          g.addColorStop(1, particleColor + "00");

          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();

          ctx.globalAlpha = p.opacity * 0.9;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [background, minSize, maxSize, speed, particleColor, particleDensity, starField]);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
