"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import HeroParticles from "./HeroParticles";

const TOTAL = 40;
const URLS = Array.from({ length: TOTAL }, (_, i) =>
  `/images/hero/frame_${String(i + 1).padStart(2, "0")}.webp`
);

export default function HeroSectionMobile() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRefs    = useRef<(HTMLImageElement | null)[]>([]);
  const rafPending = useRef(false);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) { rafPending.current = false; return; }

      const rect      = section.getBoundingClientRect();
      const maxScroll = section.offsetHeight - window.innerHeight;
      const prog      = maxScroll > 0 ? Math.max(0, Math.min(1, -rect.top / maxScroll)) : 0;

      const exact = prog * (TOTAL - 1);
      const lo    = Math.floor(exact);
      const hi    = Math.min(TOTAL - 1, lo + 1);
      const blend = exact - lo;

      imgRefs.current.forEach((img, i) => {
        if (!img) return;
        if (i === lo)      img.style.opacity = String(1 - blend);
        else if (i === hi) img.style.opacity = String(blend);
        else               img.style.opacity = "0";
      });

      rafPending.current = false;
    };

    const onScroll = () => {
      if (!rafPending.current) {
        rafPending.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} style={{ height: "350vh", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0,
        height: "100vh", overflow: "hidden", background: "#000",
        zIndex: 10,
      }}>
        {URLS.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            ref={el => { imgRefs.current[i] = el; }}
            src={src}
            alt={i === 0 ? "Healthify dumbbell" : ""}
            loading="eager"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 20%",
              opacity: i === 0 ? 1 : 0,
              pointerEvents: "none",
              filter: "brightness(1.35) contrast(1.1)",
            }}
          />
        ))}

        {/* Site-wide particle system */}
        <HeroParticles />

        {/* Dark scrim */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.35)",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* Vignette — extra darkening at edges */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "25%",
          background: "linear-gradient(to bottom, transparent, #000)",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* Text — absolute centre */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 6, textAlign: "center", width: "100%", padding: "0 28px",
          pointerEvents: "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "22px", height: "1px", background: "#FF8200" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.28em", color: "#FF8200", textTransform: "uppercase", textShadow: "0 0 12px rgba(255,130,0,0.8)" }}>
              Women Only Fitness Club
            </span>
            <div style={{ width: "22px", height: "1px", background: "#FF8200" }} />
          </div>

          <div style={{ fontFamily: "var(--font-bebas)", lineHeight: 0.92, margin: 0 }}>
            <span style={{ display: "block", fontSize: "clamp(2.6rem, 14vw, 3.4rem)", color: "#fff", textShadow: "0 0 20px rgba(0,0,0,0.9), 0 2px 16px rgba(0,0,0,0.8)" }}>LIFT. SWEAT.</span>
            <span style={{ display: "block", fontSize: "clamp(2.6rem, 14vw, 3.4rem)", color: "#FF8200", textShadow: "0 0 30px rgba(255,130,0,0.95), 0 0 60px rgba(255,130,0,0.5), 0 2px 8px rgba(0,0,0,0.8)" }}>CONQUER.</span>
          </div>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 300, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, maxWidth: "240px", margin: "12px auto", textShadow: "0 1px 10px rgba(0,0,0,0.95)" }}>
            Empowering women of all ages to build strength and confidence.
          </p>

          <div style={{ pointerEvents: "auto" }}>
            <Link href="/memberships" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "11px 26px", background: "#FF8200", color: "#080808",
              fontFamily: "var(--font-display)", fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
              borderRadius: "4px",
            }}>JOIN NOW →</Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", pointerEvents: "none",
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.28em", color: "rgba(255,255,255,0.35)" }}>SCROLL</span>
          <div style={{ width: "1px", height: "26px", background: "linear-gradient(to bottom, rgba(255,130,0,0.6), transparent)" }} />
        </div>
      </div>
    </section>
  );
}
