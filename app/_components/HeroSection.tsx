"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroParticles from "./HeroParticles";

gsap.registerPlugin(ScrollTrigger);

const FRAMES = Array.from({ length: 36 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/images/hero/athlete-frame-${n}.webp`;
});

const STAGES = [
  { id: "01", label: "FRONT VIEW", headline: "STRONGER", accent: "EVERY DAY.", sub: "Exclusive ladies fitness club.", body: "Built for every woman. Every goal. Every age.", showCtas: true },
  { id: "02", label: "RIGHT SIDE VIEW", headline: "EVERY REP", accent: "TELLS YOUR STORY.", sub: "Progress you can see. Strength you can feel.", body: "Expert coaches tracking every milestone of your journey.", showCtas: false },
  { id: "03", label: "BACK VIEW", headline: "NEVER TOO LATE", accent: "TO BUILD YOURSELF.", sub: "14 to 65 — every age belongs here.", body: "It's never too late to rebuild, restart and reclaim yourself.", showCtas: false },
  { id: "04", label: "LEFT SIDE VIEW", headline: "YOU ARE", accent: "NEVER ALONE.", sub: "A sisterhood that lifts you higher.", body: "2500+ women who sweat, struggle and celebrate together.", showCtas: false },
  { id: "05", label: "DYNAMIC ANGLE", headline: "DON'T WAIT.", accent: "JOIN NOW.", sub: "The strongest version of you starts here.", body: "Join Healthify. Transform your body. Own your power.", showCtas: true },
];

function frameToStage(frame: number) {
  if (frame <= 6) return 0;
  if (frame <= 13) return 1;
  if (frame <= 20) return 2;
  if (frame <= 27) return 3;
  return 4;
}

export default function HeroSection() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
















































































































































































































  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    imagesRef.current = FRAMES.map((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / FRAMES.length) * 100));
        if (loadedCount === FRAMES.length) setLoaded(true);
      };
      img.onerror = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / FRAMES.length) * 100));
        if (loadedCount === FRAMES.length) setLoaded(true);
      };
      return img;
    });
  }, []);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img?.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;

    const navH = 70;
    const availH = ch - navH;
    const scale = Math.min(cw / iw, availH / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const dx = (cw - sw) / 2;
    const dy = navH + (availH - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, dx, dy, sw, sh);

    // Subtle edge feathering to blend into background
    const bg = "rgba(8,8,8,";
    const lg = (x0: number, y0: number, x1: number, y1: number, fromOpaque: boolean) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, bg + (fromOpaque ? "1)" : "0)"));
      g.addColorStop(1, bg + (fromOpaque ? "0)" : "1)"));
      return g;
    };
    const fx = cw * 0.06;
    const fy = ch * 0.06;
    ctx.fillStyle = lg(0, 0, fx, 0, true);          ctx.fillRect(0, 0, fx, ch);
    ctx.fillStyle = lg(cw - fx, 0, cw, 0, false);   ctx.fillRect(cw - fx, 0, fx, ch);
    ctx.fillStyle = lg(0, 0, 0, fy, true);           ctx.fillRect(0, 0, cw, fy);
    ctx.fillStyle = lg(0, ch - fy, 0, ch, false);    ctx.fillRect(0, ch - fy, cw, fy);
  };

  // Keep canvas pixel-perfect with viewport
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      drawFrame(currentFrameRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);

    // Proxy object that GSAP animates — its .p value drives frame selection
    const proxy = { p: 0 };
    let lastStage = 0;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%",
          scrub: 0.45,          // GSAP owns the smoothing — no custom lerp needed
          pin: stickyRef.current,
          anticipatePin: 1,
        },
      });

      tl.to(proxy, {
        p: FRAMES.length - 1,
        ease: "none",
        onUpdate() {
          const float = proxy.p;
          const frameIndex = Math.min(Math.round(float), FRAMES.length - 1);
          drawFrame(frameIndex);
          currentFrameRef.current = frameIndex;
          const newStage = frameToStage(frameIndex);
          if (newStage !== lastStage) {
            lastStage = newStage;
            setCurrentStage(newStage);
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loaded]);

  const stage = STAGES[currentStage];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;600&display=swap');
        :root {
          --or: #FF8200;
          --or-glow: rgba(255,130,0,0.35);
          --or-dim: rgba(255,130,0,0.1);
          --blk: #080808;
          --wht: #F5F0EB;
          --muted: rgba(245,240,235,0.5);
        }

        .hr-root {
          position: relative;
          height: 500vh;
          background: var(--blk);
        }

        .hr-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: var(--blk);
          display: grid;
          grid-template-columns: 380px 1fr;
        }

        .particle-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
          pointer-events: none;
        }

        .hr-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          filter: contrast(1.08) saturate(1.15) brightness(1.05);
        }

        .hr-vignette {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            linear-gradient(to right, var(--blk) 0%, rgba(8,8,8,0.85) 25%, transparent 42%, transparent 72%, rgba(8,8,8,0.5) 85%, rgba(8,8,8,0.82) 93%, var(--blk) 100%),
            linear-gradient(to bottom, var(--blk) 0%, transparent 8%, transparent 88%, var(--blk) 100%);
        }

        @keyframes stat-in {
          0%   { opacity: 0; transform: translateY(16px) scale(0.85); filter: blur(6px); }
          60%  { opacity: 1; filter: blur(0px); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes stat-pulse {
          0%, 100% { text-shadow: 0 0 16px rgba(255,130,0,0.55), 0 0 32px rgba(255,130,0,0.25), 0 0 50px rgba(255,130,0,0.1); }
          50%       { text-shadow: 0 0 22px rgba(255,130,0,0.7),  0 0 45px rgba(255,130,0,0.35), 0 0 70px rgba(255,130,0,0.15); }
        }
        .stat-num-anim {
          animation: stat-in 0.7s cubic-bezier(0.16,1,0.3,1) both, stat-pulse 3s ease-in-out infinite;
        }
        .stat-lbl-anim {
          animation: stat-in 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }

        .hr-left {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 0 0 6vw;
          gap: 0;
        }

        .hr-eyebrow {
          font-family: var(--font-body), sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          color: var(--or);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .hr-eyebrow::before {
          content: '';
          width: 1.5rem;
          height: 1px;
          background: var(--or);
          display: inline-block;
        }

        .hr-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.2rem, 5vw, 6.5rem);
          line-height: 0.92;
          color: var(--wht);
          letter-spacing: 0.02em;
        }

        .hr-accent {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.2rem, 5vw, 6.5rem);
          line-height: 0.92;
          color: var(--or);
          letter-spacing: 0.02em;
          display: block;
          text-shadow: 0 0 30px var(--or-glow);
        }

        .hr-sub {
          font-family: var(--font-body), sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #F5F0EB;
          margin-top: 0.8rem;
          text-transform: uppercase;
        }

        .hr-body {
          font-family: var(--font-body), sans-serif;
          font-size: 0.88rem;
          font-weight: 300;
          color: var(--muted);
          line-height: 2;
          white-space: pre-line;
          margin-top: 1rem;
          margin-bottom: 1.5rem;
        }

        .hr-ctas {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn-p {
          font-family: var(--font-body), sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #080808;
          background: var(--or);
          border: none;
          padding: 0.8rem 1.6rem;
          border-radius: 8px;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }
        .btn-p:hover { transform: translateY(-2px); box-shadow: 0 6px 24px var(--or-glow); }

        .btn-s {
          font-family: var(--font-body), sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--wht);
          background: transparent;
          border: 1px solid var(--or);
          padding: 0.8rem 1.6rem;
          border-radius: 8px;
          cursor: pointer;
          transition: border-color .2s, color .2s;
        }
        .btn-s:hover { border-color: var(--or); color: var(--or); }

        .hr-stats {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,130,0,0.15);
        }
        .hr-stats-row { display: flex; gap: 2rem; }
        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-n {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.6rem;
          color: var(--or);
          line-height: 1;
          text-shadow: 0 0 16px var(--or-glow);
        }
        .stat-l {
          font-family: var(--font-body), sans-serif;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          color: var(--muted);
          font-weight: 600;
        }

        .hr-right {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: 300px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          padding-top: 80px;
          padding-bottom: 1rem;
          padding-right: 16px;
          padding-left: 0;
          gap: 1rem;
        }

        .badge-360 {
          width: 68px;
          height: 68px;
          border: 1px solid rgba(255,130,0,0.3);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(8,8,8,0.6);
          backdrop-filter: blur(6px);
          animation: pulse-badge 3s ease-in-out infinite;
        }
        @keyframes pulse-badge {
          0%,100% { box-shadow: 0 0 0 0 transparent; }
          50% { box-shadow: 0 0 0 4px rgba(255,130,0,0.15), 0 0 20px var(--or-glow); }
        }
        .badge-360 .deg {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.3rem;
          color: var(--wht);
          line-height: 1;
        }
        .badge-360 .deg-lbl {
          font-family: var(--font-body), sans-serif;
          font-size: 0.4rem;
          letter-spacing: 0.12em;
          color: var(--or);
          font-weight: 600;
          text-align: center;
          line-height: 1.4;
        }

        .stage-indicator {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          width: 100%;
          gap: 0.4rem;
        }
        .stage-big-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 5rem;
          line-height: 1;
          color: rgba(255,130,0,0.07);
          user-select: none;
        }
        .stage-dots {
          display: flex;
          flex-direction: column;
          gap: 5px;
          align-items: flex-end;
        }
        .stage-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(245,240,235,0.18);
          transition: all .4s ease;
        }
        .stage-dot.on {
          background: var(--or);
          width: 16px;
          border-radius: 2px;
          box-shadow: 0 0 6px var(--or-glow);
        }
        .stage-lbl-txt {
          font-family: var(--font-body), sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: var(--or);
          text-align: right;
        }

        .scroll-ind {
          position: absolute;
          bottom: 10vh;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .scroll-ind span {
          font-family: var(--font-body), sans-serif;
          font-size: 0.55rem;
          letter-spacing: 0.25em;
          color: var(--muted);
          font-weight: 600;
        }
        .s-line {
          width: 1px;
          height: 32px;
          background: rgba(255,130,0,0.3);
          position: relative;
          overflow: hidden;
        }
        .s-line::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--or);
          transform: translateY(-100%);
          animation: sl 1.8s ease-in-out infinite;
        }
        @keyframes sl { 0%{transform:translateY(-100%)} 100%{transform:translateY(100%)} }
        @keyframes bounce-down { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(4px);opacity:1} }

        .rev-bar {
          position: absolute;
          bottom: 2.5vh;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 1rem;
          opacity: 0.4;
        }
        .rev-bar span {
          font-family: var(--font-body), sans-serif;
          font-size: 0.55rem;
          letter-spacing: 0.3em;
          color: var(--or);
          font-weight: 600;
          white-space: nowrap;
        }
        .rev-line { width: 50px; height: 1px; background: var(--or); opacity: 0.4; }

        .hr-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: var(--or);
          z-index: 20;
          transition: width .1s linear;
          box-shadow: 0 0 8px var(--or-glow);
        }

        .text-in {
          animation: ti 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes ti {
          from {
            opacity: 0;
            transform: translateY(24px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }

        .hr-loader {
          position: fixed;
          inset: 0;
          background: var(--blk);
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          transition: opacity .8s ease;
        }
        .hr-loader.hidden { opacity: 0; pointer-events: none; }
        .loader-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5rem;
          color: var(--wht);
          letter-spacing: 0.15em;
        }
        .loader-logo span { color: var(--or); }
        .loader-track { width: 180px; height: 2px; background: rgba(255,130,0,0.15); border-radius: 1px; overflow: hidden; }
        .loader-fill { height: 100%; background: var(--or); border-radius: 1px; transition: width .2s ease; }
        .loader-pct { font-family: var(--font-body), sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; color: var(--muted); font-weight: 600; }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: var(--or);
          opacity: 0;
          animation: fp var(--dur) ease-in-out infinite;
          animation-delay: var(--delay);
          width: var(--size);
          height: var(--size);
          left: var(--x);
          top: var(--y);
          z-index: 4;
          pointer-events: none;
        }
        @keyframes fp {
          0%{opacity:0;transform:translateY(0) scale(0)}
          20%{opacity:0.5} 80%{opacity:0.15}
          100%{opacity:0;transform:translateY(-60px) scale(1.4)}
        }
      `}</style>

      <div className={`hr-loader ${loaded ? "hidden" : ""}`}>
        <img src="/logo.jpg" alt="Healthify" style={{ height: "80px", width: "auto", objectFit: "contain" }} />
        <div className="loader-track">
          <div className="loader-fill" style={{ width: `${loadProgress}%` }} />
        </div>
        <div className="loader-pct">{loadProgress}%</div>
      </div>

      <div ref={containerRef} className="hr-root">
        <div ref={stickyRef} className="hr-sticky">

          <canvas ref={canvasRef} className="hr-canvas" width={1920} height={1080} />

          <div className="hr-vignette" />
          <HeroParticles />



          <div className="hr-left" key={currentStage}>
            <div className="hr-eyebrow text-in" style={{ animationDelay: "0ms" }}>
              STRONGER. HEALTHIER. HAPPIER.
            </div>
            <div className="hr-headline text-in" style={{ animationDelay: "50ms", whiteSpace: "nowrap" }}>
              {stage.headline}
            </div>
            <span className="hr-accent text-in" style={{ animationDelay: "100ms" }}>
              {stage.accent}
            </span>
            <div className="hr-sub text-in" style={{ animationDelay: "150ms" }}>
              {stage.sub}
            </div>
            <p className="hr-body text-in" style={{ animationDelay: "200ms" }}>
              {stage.body}
            </p>
            {stage.showCtas && (
              <div className="hr-ctas text-in" style={{ animationDelay: "250ms" }}>
                <button className="btn-p" onClick={() => router.push("/memberships")}>JOIN NOW →</button>
                <button className="btn-s" onClick={() => router.push("/services")}>EXPLORE PROGRAMS</button>
              </div>
            )}
          </div>

          <div className="hr-right">
            <div className="badge-360">
              <span className="deg">360°</span>
              <span className="deg-lbl">SCROLL TO<br />ROTATE</span>
            </div>
            {/* Row: Stats (left) + Scroll guide (right) — side by side */}
            <div style={{
              display: "flex",
              flexDirection: "row",
              gap: "2rem",
              margin: "auto 0",
              alignItems: "center",
            }}>
              {/* Stats column */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                alignItems: "flex-end",
              }}>
                {[
                  { num: "5", label: "EXPERT\nTRAINERS", delay: "0ms" },
                  { num: "200+", label: "ACTIVE\nMEMBERS", delay: "120ms" },
                  { num: "100%", label: "WOMEN\nFOCUSED", delay: "240ms" },
                ].map((s) => (
                  <div key={s.label} style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "4px",
                  }}>
                    <span className="stat-num-anim" style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "3.4rem",
                      color: "#FF8200",
                      lineHeight: "1",
                      animationDelay: s.delay,
                    }}>{s.num}</span>
                    <span className="stat-lbl-anim" style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.22em",
                      color: "rgba(245,240,235,0.45)",
                      fontWeight: "600",
                      textAlign: "right",
                      whiteSpace: "pre-line",
                      animationDelay: s.delay,
                    }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Scroll guide column */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}>
                <span style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "0.45rem",
                  fontWeight: "600",
                  letterSpacing: "0.25em",
                  color: "rgba(245,240,235,0.3)",
                  textTransform: "uppercase",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                }}>Scroll</span>
                <div className="s-line" />
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ animation: "bounce-down 1.6s ease-in-out infinite" }}>
                  <path d="M1 3l4 4 4-4" stroke="rgba(255,130,0,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div className="stage-indicator">
              <div className="stage-big-num">{stage.id}</div>
              <div className="stage-dots">
                {STAGES.map((s, i) => (
                  <div key={s.id} className={`stage-dot ${i === currentStage ? "on" : ""}`} />
                ))}
              </div>
              <div className="stage-lbl-txt">{stage.label}</div>
            </div>
          </div>

          <div className="rev-bar">
            <div className="rev-line" />
            <span>SCROLL UP TO REVERSE THE JOURNEY</span>
            <div className="rev-line" />
          </div>

          <div className="hr-progress"
            style={{
              width: `${(currentStage / (STAGES.length - 1)) * 100}%`,
              opacity: currentStage === STAGES.length - 1 ? 0 : 1,
              transition: "width .1s linear, opacity 0.6s ease",
            }}
          />

        </div>
      </div>
    </>
  );
}
