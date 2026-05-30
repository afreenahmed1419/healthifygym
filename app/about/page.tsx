"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import HealthifyCard from "@/app/_components/HealthifyCard";
import AwardsSectionMobile from "@/app/_components/AwardsSectionMobile";

const GridMotion = dynamic(() => import("@/app/_components/GridMotion"), { ssr: false });

const ABOUT_GRID_IMAGES = Array.from({ length: 15 }, (_, i) => {
  const ext = i === 2 ? 'jpg' : 'png'; // grid-3 is .jpg, rest are .png
  return `/images/about-grid/grid-${i + 1}.${ext}`;
});

// ─── Floating particles ───────────────────────────────────────────────────────

function AboutParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    type Particle = { x: number; y: number; size: number; speed: number; opacity: number; drift: number };
    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.5 + 0.15,
      opacity: Math.random() * 0.35 + 0.05,
      drift: (Math.random() - 0.5) * 0.4,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grd.addColorStop(0, `rgba(255,130,0,${p.opacity})`);
        grd.addColorStop(1, "rgba(255,130,0,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />;
}

// ─── Hex background ───────────────────────────────────────────────────────────

// ─── Story collage ────────────────────────────────────────────────────────────

function StoryCollage() {
  const tapeTop = (
    <div style={{
      position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)",
      width: 52, height: 16, background: "rgba(255,210,100,0.5)",
      borderLeft: "1px solid rgba(180,150,60,0.18)", borderRight: "1px solid rgba(180,150,60,0.18)",
      zIndex: 10, pointerEvents: "none",
    }} />
  );
  const tapeTL = (
    <div style={{
      position: "absolute", top: -9, left: 12, transform: "rotate(-4deg)",
      width: 52, height: 16, background: "rgba(255,210,100,0.5)",
      borderLeft: "1px solid rgba(180,150,60,0.18)", borderRight: "1px solid rgba(180,150,60,0.18)",
      zIndex: 10, pointerEvents: "none",
    }} />
  );
  const tapeTR = (
    <div style={{
      position: "absolute", top: -9, right: 12, transform: "rotate(3deg)",
      width: 52, height: 16, background: "rgba(255,210,100,0.5)",
      borderLeft: "1px solid rgba(180,150,60,0.18)", borderRight: "1px solid rgba(180,150,60,0.18)",
      zIndex: 10, pointerEvents: "none",
    }} />
  );
  const pin = (
    <div style={{
      position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
      width: 13, height: 13, background: "#c0392b", borderRadius: "50%",
      boxShadow: "0 2px 4px rgba(0,0,0,0.45)", zIndex: 10, pointerEvents: "none",
    }}>
      <div style={{ position: "absolute", top: 3, left: 3, width: 6, height: 6, background: "rgba(255,255,255,0.4)", borderRadius: "50%" }} />
    </div>
  );
  const caption = (text: string) => (
    <span style={{ display: "block", textAlign: "center", marginTop: 7, fontFamily: "cursive", fontSize: "0.78rem", color: "#8a7660" }}>
      {text}
    </span>
  );
  const cardBase: React.CSSProperties = {
    position: "absolute", background: "#fffef9",
    padding: "8px 8px 30px",
    boxShadow: "2px 3px 8px rgba(0,0,0,0.45), 8px 10px 24px rgba(0,0,0,0.35)",
  };

  return (
    <>
      <style>{`
        .sc { transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease; cursor: pointer; }
        .sc:hover { transform: rotate(0deg) translateY(-10px) scale(1.04) !important; box-shadow: 4px 8px 20px rgba(0,0,0,0.55), 16px 24px 48px rgba(0,0,0,0.45) !important; z-index: 10 !important; }
        .sc img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
      `}</style>

      <div className="rsp-collage-outer">
      <div className="rsp-collage-wrap" style={{ position: "relative", height: 430, width: "100%" }}>

        {/* ── Top row ── */}

        {/* Card 1 — Day 1 */}
        <div className="sc" style={{ ...cardBase, top: 10, left: 0, width: 200, zIndex: 3, transform: "rotate(-3deg)" }}>
          {tapeTL}
          <div style={{ overflow: "hidden" }}><img src="/images/collage/photo-day1.png" alt="Healthify" /></div>
          {caption("Day 1 ✦")}
        </div>

        {/* Card 2 */}
        <div className="sc" style={{ ...cardBase, top: 0, left: 178, width: 215, zIndex: 5, transform: "rotate(2.5deg)" }}>
          {pin}
          <div style={{ overflow: "hidden" }}><img src="/images/collage/photo-2.png" alt="Healthify" /></div>
          {caption("Unstoppable 🧡")}
        </div>

        {/* Card 3 */}
        <div className="sc" style={{ ...cardBase, top: 18, right: 0, width: 192, zIndex: 3, transform: "rotate(-1.8deg)" }}>
          {tapeTR}
          <div style={{ overflow: "hidden" }}><img src="/images/collage/photo-3.png" alt="Healthify" /></div>
          {caption("Our squad")}
        </div>

        {/* ── Bottom row — all three at the same level ── */}

        {/* Card 4 — left */}
        <div className="sc" style={{ ...cardBase, top: 232, left: 0, width: 195, zIndex: 4, transform: "rotate(-2deg)" }}>
          {tapeTL}
          <div style={{ overflow: "hidden" }}><img src="/images/collage/photo-4.png" alt="Healthify" /></div>
          {caption("Training days")}
        </div>

        {/* Card 6 — centre */}
        <div className="sc" style={{ ...cardBase, top: 222, left: 190, width: 200, zIndex: 6, transform: "rotate(1.5deg)" }}>
          {tapeTop}
          <div style={{ overflow: "hidden" }}><img src="/images/collage/photo-1.png" alt="Healthify" /></div>
          {caption("With us 🧡")}
        </div>

        {/* Card 5 — right */}
        <div className="sc" style={{ ...cardBase, top: 238, right: 0, width: 195, zIndex: 4, transform: "rotate(-1.5deg)" }}>
          {pin}
          <div style={{ overflow: "hidden" }}><img src="/images/collage/photo-5.jpeg" alt="Healthify" /></div>
          {caption("The team 🧡")}
        </div>

      </div>
      </div>
    </>
  );
}

// ─── Awards & Recognition ─────────────────────────────────────────────────────

function LaurelIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg width="28" height="52" viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, transform: flip ? "scaleX(-1)" : "none" }}>
      <path d="M22 50 C14 42, 8 30, 10 6" stroke="#FF8200" strokeWidth="1.1" strokeLinecap="round" opacity="0.55"/>
      <path d="M10 6 C7 2, 2 4, 4 10 C6 13, 13 11, 10 6Z" fill="rgba(255,130,0,0.18)" stroke="#FF8200" strokeWidth="0.9" opacity="0.75"/>
      <path d="M9 16 C5 13, 1 17, 4 22 C7 24, 13 21, 9 16Z" fill="rgba(255,130,0,0.14)" stroke="#FF8200" strokeWidth="0.9" opacity="0.65"/>
      <path d="M9 27 C4 25, 1 30, 5 35 C7 37, 14 33, 9 27Z" fill="rgba(255,130,0,0.11)" stroke="#FF8200" strokeWidth="0.9" opacity="0.55"/>
      <path d="M11 38 C7 37, 5 42, 9 45 C12 46, 17 43, 11 38Z" fill="rgba(255,130,0,0.08)" stroke="#FF8200" strokeWidth="0.8" opacity="0.42"/>
    </svg>
  );
}

function AwardsSection() {
  return (
    <section className="rsp-section" style={{ position: "relative", padding: "100px 80px", background: "#080808" }}>
      <HexBackground />
      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionHeader eyebrow="RECOGNITION" title="Awards &" accent="Recognition" />

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.2 }}
          style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 300, color: "rgba(245,240,235,0.38)", textAlign: "center", marginTop: "-44px", marginBottom: "64px", letterSpacing: "0.02em" }}>
          Recognizing excellence in women&apos;s wellness, entrepreneurship, and community impact.
        </motion.p>

        {/* ── Women Changemakers Summit 2026 — Featured card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.85 }}
          style={{ position: "relative", overflow: "hidden", border: "1px solid rgba(255,150,0,0.22)", marginBottom: "2px" }}>

          {/* Layered warm background */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #130c04 0%, #0e0904 45%, #080808 100%)", zIndex: 0 }} />
          <div style={{ position: "absolute", top: "50%", left: "22%", transform: "translate(-50%,-50%)", width: "560px", height: "420px", background: "radial-gradient(ellipse, rgba(255,120,0,0.09) 0%, transparent 68%)", zIndex: 0, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "30%", right: "10%", width: "300px", height: "300px", background: "radial-gradient(ellipse, rgba(255,100,0,0.05) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

          {/* Diagonal light streaks — right half */}
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              position: "absolute", top: "-20%", right: `${8 + i * 7}%`,
              width: "1px", height: "140%",
              background: "linear-gradient(to bottom, transparent 0%, rgba(255,150,0,0.07) 40%, rgba(255,150,0,0.12) 55%, rgba(255,150,0,0.05) 80%, transparent 100%)",
              transform: "rotate(-28deg)",
              transformOrigin: "top center",
              zIndex: 0, pointerEvents: "none",
            }} />
          ))}

          <div className="rsp-grid-1" style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "60% 40%" }}>

            {/* ── LEFT: Award details ── */}
            <div style={{ padding: "52px 48px 52px 52px", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "1px solid rgba(255,150,0,0.1)" }}>
              <div style={{ marginBottom: "4px" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "1.2rem", fontStyle: "italic", fontWeight: 800, color: "#F5F0EB" }}>She</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "1.2rem", fontStyle: "italic", fontWeight: 800, color: "#FF8200" }}>Inspire</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 600, color: "rgba(245,240,235,0.35)", letterSpacing: "0.18em", marginLeft: "8px" }}>MAGAZINE</span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.28em", color: "rgba(245,240,235,0.35)", marginBottom: "16px" }}>PRESENTS</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.24em", color: "rgba(245,240,235,0.55)", marginBottom: "16px" }}>MEET THE VOICE OF CHANGE</div>
              <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", marginBottom: "22px" }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ lineHeight: 0.88, marginBottom: "18px" }}>
                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3rem,4.5vw,4.2rem)", color: "#F5F0EB", letterSpacing: "0.04em" }}>WOMEN</div>
                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3rem,4.5vw,4.2rem)", color: "#FF8200", letterSpacing: "0.04em" }}>CHANGEMAKERS</div>
                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2rem,3vw,2.8rem)", color: "#F5F0EB", letterSpacing: "0.04em" }}>SUMMIT 2026</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", color: "rgba(245,240,235,0.35)", marginBottom: "14px" }}>BOLD VOICES &nbsp;·&nbsp; REAL IMPACT &nbsp;·&nbsp; GLOBAL CHANGE</div>
                  <div style={{ display: "inline-block", border: "1px solid rgba(245,240,235,0.15)", borderRadius: "6px", padding: "8px 18px" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "#F5F0EB" }}>MAY 23, 2026 &nbsp;|&nbsp; RAMADA BY WYNDHAM, BANGALORE</span>
                  </div>
                </div>
                <div style={{ flex: 1, position: "relative", marginTop: "-32px", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,150,0,0.18)", borderRadius: "14px", boxShadow: "0 0 40px rgba(255,130,0,0.07), inset 0 1px 0 rgba(255,255,255,0.04)", padding: "24px 22px 20px", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -1, left: "15%", right: "15%", height: "2px", background: "linear-gradient(to right, transparent, rgba(255,130,0,0.7), transparent)", filter: "blur(2px)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: -1, left: "15%", right: "15%", height: "1px", background: "linear-gradient(to right, transparent, #FF8200, transparent)", pointerEvents: "none" }} />
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "2.2rem", color: "rgba(255,130,0,0.22)", lineHeight: 1, marginBottom: "10px" }}>&ldquo;</div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontStyle: "italic", fontWeight: 300, color: "rgba(245,240,235,0.62)", lineHeight: 1.85, margin: 0 }}>At Healthify, our biggest achievement is the trust, transformations, and positive feedback we receive from the women who are part of our fitness community. Every fitness milestone achieved by our members is a recognition of the work we do.</p>
                  <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "18px", height: "1px", background: "rgba(255,130,0,0.45)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,130,0,0.65)" }}>AURSHIA TAHIR &nbsp;·&nbsp; FOUNDER, HEALTHIFY</span>
                  </div>
                </div>
              </div>
              <div style={{ borderLeft: "2px solid #FF8200", paddingLeft: "16px", marginBottom: "20px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(245,240,235,0.32)", marginBottom: "6px" }}>CONFERENCE THEME</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", fontStyle: "italic", fontWeight: 500, color: "#F5F0EB", lineHeight: 1.55 }}>&ldquo;Leading the Future: Women at the Forefront of Change&rdquo;</div>
              </div>
              <div style={{ position: "relative", border: "1px solid rgba(255,150,0,0.12)", borderRadius: "12px", padding: "20px 22px 28px", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -1, left: 14, right: 14, height: "1px", background: "linear-gradient(to right, transparent, rgba(255,130,0,0.3), transparent)" }} />
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", lineHeight: 1.9, margin: 0 }}>She is Aurshia, the founder of Healthify, a women-focused fitness community dedicated to empowering women to take charge of their health, confidence, and overall well-being. Through Healthify, she has built a supportive and motivating space where women uplift each other, stay consistent, and grow stronger together.</p>
                <div style={{ position: "absolute", bottom: 8, right: 14, fontFamily: "Georgia, serif", fontSize: "2.2rem", color: "rgba(255,130,0,0.18)", lineHeight: 1 }}>&rdquo;</div>
              </div>
            </div>

            {/* ── RIGHT: Identity + photo ── */}
            <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px" }}>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", fontStyle: "italic", fontWeight: 600, color: "#FF8200" }}>Honoring</span>
                <div style={{ width: "44px", height: "1px", background: "rgba(255,130,0,0.5)", margin: "8px auto" }} />
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 400, color: "rgba(245,240,235,0.65)", lineHeight: 1.7, textAlign: "center", margin: 0 }}>Strong, Powerful,<br />Independent Women Globally</p>
              </div>
              <div style={{ background: "#FF8200", padding: "5px 22px", fontFamily: "var(--font-body)", fontSize: "0.78rem", fontStyle: "italic", fontWeight: 700, color: "#080808" }}>Selected South Zone</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <LaurelIcon />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1.2rem", color: "#F5F0EB", letterSpacing: "0.07em", lineHeight: 1 }}>CONGRATULATIONS</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.66rem", color: "rgba(245,240,235,0.5)", letterSpacing: "0.1em", marginTop: "3px" }}>On Your Achievement</div>
                </div>
                <LaurelIcon flip />
              </div>
              <div style={{ width: "190px" }}>
                <div style={{ border: "2px solid rgba(255,150,0,0.4)", borderRadius: "10px 10px 0 0", overflow: "hidden" }}>
                  <img src="/images/aurshia.png" alt="Aurshia Tahir" style={{ width: "100%", height: "220px", display: "block", objectFit: "cover", objectPosition: "top center" }} />
                </div>
                <div style={{ background: "#FF8200", padding: "10px 16px", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1.25rem", color: "#080808", letterSpacing: "0.05em", lineHeight: 1 }}>Aurshia Tahir</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.63rem", color: "rgba(0,0,0,0.75)", lineHeight: 1.5, marginTop: "2px" }}>Founder Healthify · Women&apos;s Fitness Club</div>
                </div>
                <div style={{ marginTop: "1px", background: "rgba(255,130,0,0.05)", border: "1px solid rgba(255,130,0,0.18)", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "14px 16px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(255,130,0,0.4), transparent)" }} />
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "7.5px", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,130,0,0.7)", marginBottom: "5px" }}>TWELL MAGAZINE · 2026</div>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1rem", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 1.15, marginBottom: "2px" }}>S. INDIA WOMEN ACHIEVERS</div>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: "0.85rem", color: "#FF8200", letterSpacing: "0.06em", marginBottom: "8px" }}>AWARDS (SIWAA)</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.62rem", color: "rgba(245,240,235,0.38)", lineHeight: 1.5 }}>Changemaker<br />Women&apos;s Wellness</div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.18em", color: "#FF8200", border: "1px solid rgba(255,130,0,0.45)", padding: "4px 10px", flexShrink: 0 }}>WINNER</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function AwardsSwitcher() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile ? <AwardsSectionMobile /> : <AwardsSection />;
}

// ─── Trainers section ─────────────────────────────────────────────────────────

function TrainersSection() {
  return (
    <section className="rsp-section" style={{ position: "relative", padding: "100px 80px", background: "#050505" }}>
      <HexBackground />
      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionHeader eyebrow="THE TEAM" title="Meet The" accent="Trainers" />

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {TRAINERS.map((trainer, i) => {
            const badgeLabel = trainer.role.split(" ").slice(0, 2).join(" ").toUpperCase();
            const isHead = i === 0;

            return (
              <motion.div key={trainer.name}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }}
                transition={{ duration: 0.7, delay: i * 0.07 }}
                className="rsp-flex-col" style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>

                {/* ── LEFT: Photo + Info ── */}
                <HealthifyCard style={{ flex: 1 }}>
                  <div className="rsp-trainer-inner" style={{ display: "grid", gridTemplateColumns: "220px 1fr", height: "100%" }}>

                  {/* Photo */}
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img src={trainer.image} alt={trainer.name}
                      style={{ width: "100%", height: "100%", minHeight: "280px", objectFit: "cover", objectPosition: "top center", display: "block" }} />
                    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "60px", background: "linear-gradient(to right, transparent, #120F17)" }} />
                  </div>

                  {/* Info */}
                  <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, #FF8200, transparent)" }} />

                    {/* Badge + experience */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
                      {isHead ? (
                        <span style={{ background: "#FF8200", padding: "5px 14px", fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", color: "#080808" }}>HEAD TRAINER</span>
                      ) : (
                        <span style={{ border: "1px solid rgba(255,130,0,0.4)", padding: "4px 12px", fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", color: "rgba(255,130,0,0.8)" }}>{badgeLabel}</span>
                      )}
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", color: "rgba(245,240,235,0.4)" }}>{trainer.experience.toUpperCase()}</span>
                    </div>

                    <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(1.8rem, 2.2vw, 2.6rem)", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 1, marginBottom: "6px" }}>
                      {trainer.name}
                    </h3>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 500, color: "#FF8200", marginBottom: "18px", letterSpacing: "0.02em" }}>
                      {trainer.role}
                    </div>

                    {/* Cert pills */}
                    {trainer.certs.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "10px" }}>
                        {trainer.certs.map((c) => (
                          <span key={c} style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", color: "rgba(255,130,0,0.8)", border: "1px solid rgba(255,130,0,0.25)", padding: "5px 12px" }}>{c}</span>
                        ))}
                      </div>
                    )}

                    {/* Spec pills */}
                    {trainer.specs.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                        {trainer.specs.map((s) => (
                          <span key={s} style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", color: "rgba(245,240,235,0.6)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "5px 12px" }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  </div>
                </HealthifyCard>

                {/* ── RIGHT: Quote card with HealthifyCard hover glow ── */}
                <HealthifyCard className="rsp-quote-card" style={{ flexShrink: 0, width: "380px" }}>
                  <div style={{ padding: "44px 40px", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>

                    {/* Opening quote mark */}
                    <div style={{ fontFamily: "Georgia, serif", fontSize: "5.5rem", lineHeight: 0.75, color: "rgba(255,107,0,0.2)", marginBottom: "18px", userSelect: "none" }}>&ldquo;</div>

                    <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", fontStyle: "italic", fontWeight: 300, color: "rgba(245,240,235,0.82)", lineHeight: 1.95, margin: "0 0 36px" }}>
                      {trainer.quote}
                    </p>

                    {/* Attribution */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "28px", height: "2px", background: "#FF6B00", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#FF8200" }}>{trainer.name.toUpperCase()}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.12em", color: "rgba(245,240,235,0.38)", marginTop: "4px" }}>{trainer.role.toUpperCase()}</div>
                      </div>
                    </div>

                  </div>
                </HealthifyCard>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Hex background ───────────────────────────────────────────────────────────

function HexBackground() {
  return (
    <svg
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
        maskImage: "linear-gradient(to bottom, transparent, black 96px, black calc(100% - 96px), transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 96px, black calc(100% - 96px), transparent)",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="about-hex" width="83" height="144" patternUnits="userSpaceOnUse">
          <path d="M42,0 L83,24 L83,72 L42,96 L0,72 L0,24 Z M42,96 L42,144" fill="none" stroke="rgba(255,130,0,0.15)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#about-hex)" />
    </svg>
  );
}

// ─── Section header helper ────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, accent }: { eyebrow: string; title: string; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      style={{ textAlign: "center", marginBottom: "64px" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.5 }} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>{eyebrow}</span>
        <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.5 }} />
      </div>
      <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3rem, 5vw, 5rem)", color: "#F5F0EB", lineHeight: 0.92 }}>
        {title} <span style={{ color: "#FF8200" }}>{accent}</span>
      </h2>
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const WHY_ITEMS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="5"/><line x1="12" y1="14" x2="12" y2="21"/><line x1="9" y1="18" x2="15" y2="18"/>
      </svg>
    ),
    title: "Women-Only Environment",
    desc: "A safe, judgment-free space built exclusively for women — train comfortably without hesitation.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    title: "Female Trainers",
    desc: "Certified female coaches who understand your body, guide every session, and track your progress.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="20" x2="3" y2="15"/><line x1="9" y1="20" x2="9" y2="9"/><line x1="15" y1="20" x2="15" y2="4"/><line x1="21" y1="20" x2="21" y2="11"/>
      </svg>
    ),
    title: "Beginner-Friendly",
    desc: "Personalised approach for every fitness level — from complete beginners to seasoned athletes.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
        <line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/>
        <line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>
      </svg>
    ),
    title: "Specialized Programs",
    desc: "Targeted plans for fat loss, toning, strength gain, and weight gain — built around your goals.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: "Postpartum Support",
    desc: "Safe, structured fitness programs designed specifically for new mothers returning to training.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "PCOS / Thyroid Guidance",
    desc: "Expert support for women managing PCOS, PCOD, and thyroid concerns through fitness.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    title: "Sustainable Results",
    desc: "No quick fixes — real, lasting transformation through consistency, education, and structure.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Community-Driven",
    desc: "A positive, motivating sisterhood where every milestone is celebrated and no one trains alone.",
  },
];



const TRAINERS = [
  {
    name: "Basaka Chakraborty",
    role: "Head Trainer & Zumba Instructor",
    specs: ["Women's Fitness", "Strength Training", "Weight Management", "Functional Training", "Zumba"],
    experience: "3 Years",
    certs: ["K11 Certified Trainer", "Women's Fitness Expert", "ZIN Zumba Trainer", "BPES Graduate"],
    quote: "Fitness is not about being better than others, it's about becoming stronger, healthier, and better than who you were yesterday.",
    image: "/images/basaka.png",
  },
  {
    name: "Sandhya Laskar",
    role: "Personal Trainer & Special Population Coach",
    specs: ["Prenatal / Postnatal", "Senior Fitness", "Injury Support", "Kids Training"],
    experience: "3 Years",
    certs: ["Certified Personal Trainer", "Special Population Coach", "JBT Diploma"],
    quote: "Fitness is not just about looks, it's about confidence and strength.",
    image: "/images/sandhya.png",
  },
  {
    name: "N Bhavana",
    role: "Floor Trainer",
    specs: ["Strength"],
    experience: "1 Year",
    certs: ["BPES Graduate"],
    quote: "Being healthy isn't about the weight you lose, it's about the life you gain.",
    image: "/images/bhavana.png",
  },
  {
    name: "Baipalli Brundavathi",
    role: "Floor Trainer",
    specs: ["Strength", "Zumba"],
    experience: "8 Months",
    certs: [],
    quote: "Fitness is not punishment — it's self-respect.",
    image: "/images/baipalli.png",
  },
  {
    name: "S. Ankita",
    role: "Zumba Trainer",
    specs: ["Zumba", "Strength"],
    experience: "3 Months",
    certs: [],
    quote: "Fitness should be fun, energetic and empowering for everyone.",
    image: "/images/ankita.png",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const storyRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ background: "#080808", minHeight: "100vh", position: "relative", overflow: "hidden" }}>

      <AboutParticles />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", height: "100vh", width: "100%", overflow: "hidden" }}>

        {/* GridMotion image grid background */}
        <GridMotion items={ABOUT_GRID_IMAGES} gradientColor="#FF6B00" />

        {/* Content overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          paddingTop: "120px", paddingBottom: "40px",
        }}>

          {/* Frosted card behind text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}
            className="about-hero-card"
            style={{
              position: "relative",
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "48px 56px 44px",
              borderRadius: "24px",
              background: "rgba(8, 8, 8, 0.55)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              maxWidth: "680px",
              width: "calc(100% - 48px)",
            }}>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
              <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.6 }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.35em", color: "#FF8200" }}>HEALTHIFY WOMEN&apos;S FITNESS</span>
              <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.6 }} />
            </div>

            <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)", lineHeight: 0.95, color: "#F5F0EB", margin: "0 0 24px", textAlign: "center" }}>
              EMPOWERING
              <br />
              WOMEN
              <br />
              <span style={{ color: "#FF8200", textShadow: "0 0 60px rgba(255,130,0,0.6)", whiteSpace: "nowrap" }}>THROUGH FITNESS.</span>
            </h1>

            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 300, color: "rgba(245,240,235,0.72)", textAlign: "center", maxWidth: "480px", lineHeight: 1.85, margin: "0 0 36px" }}>
              Train with women who lift each other up.
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{ display: "inline-block" }}
              >
                <Link href="/memberships"
                  style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", color: "#080808", background: "#FF8200", padding: "16px 40px", textDecoration: "none", borderRadius: "6px", display: "inline-block", transition: "box-shadow 0.22s, filter 0.22s" }}
                  onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(255,130,0,0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  START YOUR JOURNEY →
                </Link>
              </motion.div>
              <motion.button
                onClick={() => storyRef.current?.scrollIntoView({ behavior: "smooth" })}
                whileHover={{ y: -3, scale: 1.02, borderColor: "rgba(255,130,0,0.8)", boxShadow: "0 10px 28px rgba(255,130,0,0.18)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", color: "#FF8200", background: "transparent", border: "1px solid rgba(255,130,0,0.4)", padding: "16px 40px", cursor: "pointer", borderRadius: "6px" }}>
                OUR STORY ↓
              </motion.button>
            </div>
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ position: "absolute", bottom: "40px", right: "48px", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 600, letterSpacing: "0.25em", color: "rgba(255,130,0,0.5)" }}>SCROLL</span>
          <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, rgba(255,130,0,0.5), transparent)" }} />
        </motion.div>

      </section>

      {/* ── Our Story ──────────────────────────────────────────────────────── */}
      <section ref={storyRef} className="rsp-section" style={{ position: "relative", padding: "120px 80px" }}>
        <HexBackground />
        <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="rsp-story-card" style={{
            background: "rgba(20,20,20,0.72)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,130,0,0.3)", borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 48px rgba(255,130,0,0.12)",
            padding: "64px",
          }}>
            <div className="rsp-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>

              {/* Left: text */}
              <motion.div className="rsp-story-text" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ width: "32px", height: "1px", background: "#FF8200" }} />
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>OUR STORY</span>
                </div>
                <h2 className="rsp-story-heading" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3.5rem, 5.5vw, 6rem)", color: "#F5F0EB", lineHeight: 0.92, marginBottom: "28px" }}>
                  BORN FOR<br /><span style={{ color: "#FF8200" }}>WOMEN,</span><br />BY WOMEN
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", fontWeight: 300, color: "rgba(245,240,235,0.6)", lineHeight: 1.85, marginBottom: "20px" }}>
                  Healthify was started to provide women with a comfortable, judgment-free, and encouraging fitness environment where they can train confidently and focus on their health goals without hesitation.
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", fontWeight: 300, color: "rgba(245,240,235,0.6)", lineHeight: 1.85 }}>
                  We wanted to create a space where women of all ages and fitness levels feel supported, motivated, and guided throughout their fitness journey.
                </p>
              </motion.div>

              {/* Right: polaroid collage */}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.8, delay: 0.15 }}>
                <StoryCollage />
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ───────────────────────────────────────────────── */}
      <section className="rsp-section" style={{ position: "relative", padding: "100px 80px", background: "#050505" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionHeader eyebrow="PURPOSE" title="Mission &" accent="Vision" />

          <div className="rsp-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
            {[
              {
                tag: "OUR MISSION",
                heading: "WHAT WE DO",
                body: "To empower women to prioritize fitness, improve their health, and build confidence through professional guidance, structured training programs, and a positive fitness community.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                  </svg>
                ),
              },
              {
                tag: "OUR VISION",
                heading: "WHERE WE'RE GOING",
                body: "To become the most trusted women-only fitness community that helps women achieve sustainable transformations through consistency, education, and a supportive environment.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                  </svg>
                ),
              },
            ].map((item, i) => (
              <motion.div key={item.tag}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.15 }}>
                <HealthifyCard>
                  <div style={{ padding: "52px 44px", position: "relative", overflow: "hidden" }}>
                    <div style={{ marginBottom: "20px" }}>{item.icon}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.28em", color: "#FF8200", marginBottom: "12px" }}>{item.tag}</div>
                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: "2.6rem", color: "#F5F0EB", letterSpacing: "0.04em", marginBottom: "20px", lineHeight: 1 }}>{item.heading}</div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", fontWeight: 300, color: "rgba(245,240,235,0.55)", lineHeight: 1.85 }}>{item.body}</p>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: i === 0 ? "linear-gradient(to right, #FF8200, transparent)" : "linear-gradient(to left, #FF8200, transparent)" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "60px", background: "linear-gradient(to bottom, #FF8200, transparent)" }} />
                  </div>
                </HealthifyCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet The Trainers ──────────────────────────────────────────────── */}
      <TrainersSection />

      {/* ── Awards & Recognition ───────────────────────────────────────────── */}
      <AwardsSwitcher />

      {/* ── Why Healthify ──────────────────────────────────────────────────── */}
      <section className="rsp-section" style={{ position: "relative", padding: "100px 80px" }}>
        <HexBackground />
        <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionHeader eyebrow="OUR DIFFERENCE" title="What Makes Us" accent="Different" />

          <div className="rsp-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }}>
            {WHY_ITEMS.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                style={{ background: "#0A0A0A", border: "1px solid rgba(255,130,0,0.1)", padding: "36px 24px", position: "relative", overflow: "hidden", cursor: "default", transition: "border-color 0.3s, box-shadow 0.3s" }}
                onHoverStart={() => {}} onHoverEnd={() => {}}>
                <div style={{ marginBottom: "16px" }}>{item.icon}</div>
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1.2rem", color: "#F5F0EB", letterSpacing: "0.05em", marginBottom: "10px", lineHeight: 1.2 }}>{item.title}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", lineHeight: 1.75 }}>{item.desc}</p>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, #FF8200, transparent)" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="rsp-section" style={{ position: "relative", padding: "120px 80px", background: "transparent", textAlign: "center", overflow: "hidden" }}>
        <HexBackground />
        {/* Warm gradient wash */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,8,8,0) 0%, rgba(20,10,4,0.92) 30%, rgba(20,10,4,0.92) 70%, rgba(8,8,8,0) 100%)", pointerEvents: "none", zIndex: 0 }} />
        {/* Central orange glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "900px", height: "600px", background: "radial-gradient(ellipse, rgba(255,130,0,0.12) 0%, rgba(255,130,0,0.04) 40%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        {/* Decorative hex — right */}
        <div className="rsp-cta-hex" style={{ position: "absolute", right: "-80px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 0 }}>
          <svg width="420" height="420" viewBox="0 0 200 200" fill="none">
            <polygon points="100,12 174,54 174,146 100,188 26,146 26,54" stroke="#FF8200" strokeWidth="1.5" fill="none" opacity="0.22" />
            <polygon points="100,28 161,63 161,137 100,172 39,137 39,63" stroke="#FF8200" strokeWidth="1" fill="none" opacity="0.12" />
          </svg>
        </div>
        {/* Decorative hex — left */}
        <div className="rsp-cta-hex" style={{ position: "absolute", left: "-80px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 0 }}>
          <svg width="420" height="420" viewBox="0 0 200 200" fill="none">
            <polygon points="100,12 174,54 174,146 100,188 26,146 26,54" stroke="#FF8200" strokeWidth="1.5" fill="none" opacity="0.22" />
            <polygon points="100,28 161,63 161,137 100,172 39,137 39,63" stroke="#FF8200" strokeWidth="1" fill="none" opacity="0.12" />
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.6 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>START TODAY</span>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: 0.95, marginBottom: "24px" }}>
            <span style={{ color: "#F5F0EB" }}>READY TO </span><span style={{ color: "#FF8200", textShadow: "0 0 60px rgba(255,130,0,0.5)" }}>TRANSFORM?</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", lineHeight: 1.8, marginBottom: "48px" }}>
            Join 200+ women who have already transformed their lives at Healthify. Your strongest self is waiting.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/memberships"
              style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", color: "#080808", background: "#FF8200", padding: "18px 44px", textDecoration: "none", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "10px" }}
              onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
              onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
              VIEW MEMBERSHIPS
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#080808" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <motion.a href="/contact"
              whileHover={{ borderColor: "rgba(255,130,0,0.5)", color: "#F5F0EB" }}
              style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(245,240,235,0.5)", background: "transparent", border: "1px solid rgba(255,130,0,0.2)", padding: "18px 44px", textDecoration: "none", borderRadius: "8px", display: "inline-block", transition: "border-color 0.3s, color 0.3s" }}>
              CONTACT US
            </motion.a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
