"use client";

import { useEffect, useRef } from "react";

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number; y: number; z: number;
      vx: number; vy: number;
      size: number; opacity: number; pulse: number;
    }[] = [];

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.45 + 0.18,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        p.pulse += 0.02;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const pulseOpacity = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
        const apparentSize = p.size * p.z;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, apparentSize * 3);
        gradient.addColorStop(0, `rgba(255, 130, 0, ${pulseOpacity})`);
        gradient.addColorStop(0.4, `rgba(255, 120, 20, ${pulseOpacity * 0.4})`);
        gradient.addColorStop(1, `rgba(255, 130, 0, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, apparentSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, apparentSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 100, ${pulseOpacity * 0.9})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 5,
        pointerEvents: "none",
      }}
    />
  );
}
