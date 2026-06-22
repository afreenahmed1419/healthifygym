"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import HeroSection from "./HeroSection";
import HeroSectionMobile from "./HeroSectionMobile";
import OurJourney from "./OurJourney";
import OurJourneyMobile from "./OurJourneyMobile";
import ServiceCarousel from "./ServiceCarousel";
import HealthifyCard from "./HealthifyCard";

// ─── Scroll reveal wrapper ───────────────────────────────────────────────────

function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
  stretch?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : 0,
      x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    },
    visible: {
      opacity: 1, y: 0, x: 0,
      transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 justify-center mb-4">
      <div className="w-8 h-0.5 bg-[#FF8200]" />
      <span className="text-[#FF8200] text-xs uppercase tracking-[0.3em] font-semibold" style={{ fontFamily: "var(--font-display)" }}>
        {children}
      </span>
      <div className="w-8 h-0.5 bg-[#FF8200]" />
    </div>
  );
}

// ─── Hex grid SVG ─────────────────────────────────────────────────────────────

function HomeHexBackground() {
  return (
    <svg
      className="rsp-hex-bg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="home-hex" width="83" height="144" patternUnits="userSpaceOnUse">
          <path
            d="M42,0 L83,24 L83,72 L42,96 L0,72 L0,24 Z M42,96 L42,144"
            fill="none"
            stroke="rgba(255,130,0,0.15)"
            strokeWidth="1.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#home-hex)" />
    </svg>
  );
}

// ─── Shared page background (particles + grid live in wrapper) ───────────────

function PageBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = { x: number; y: number; size: number; speed: number; opacity: number; drift: number };

    const COUNT = 120;
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
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
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    />
  );
}

// ─── Why Healthify Section ───────────────────────────────────────────────────

const WHY_CARDS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "WOMEN ONLY",
    desc: "A safe and empowering environment built exclusively for women of all ages and fitness levels.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="4" stroke="#FF8200" strokeWidth="1.5" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 11l2 2 4-4" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "EXPERT COACHES",
    desc: "Certified professionals who care for you, track your progress and push you beyond your limits.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="16 7 22 7 22 13" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "RESULTS THAT LAST",
    desc: "Programs designed for real, sustainable change — not quick fixes. Real women, real stories.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="#FF8200" strokeWidth="1.5" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "STRONG COMMUNITY",
    desc: "Sisters who uplift, motivate and celebrate every milestone together. You will never train alone.",
  },
];

function WhyCard({ card, delay }: { card: (typeof WHY_CARDS)[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{ height: "100%" }}
    >
      <HealthifyCard style={{ height: "100%", boxShadow: hovered ? "0 20px 60px rgba(255,130,0,0.1)" : "none", transition: "box-shadow 0.3s ease" }}>
        <div style={{ padding: "48px", position: "relative", overflow: "hidden", height: "100%" }}>
          {/* top-left corner accent — grows on hover */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: "3px",
            height: hovered ? "100px" : "60px",
            background: "linear-gradient(to bottom, #FF8200, transparent)",
            transition: "height 0.3s ease",
          }} />
          {/* top accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, #FF8200, transparent)", opacity: 0.4 }} />

          {/* icon */}
          <div
            style={{
              width: "52px",
              height: "52px",
              background: hovered ? "rgba(255,130,0,0.15)" : "rgba(255,130,0,0.08)",
              border: "1px solid rgba(255,130,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              transition: "background 0.3s",
            }}
          >
            {card.icon}
          </div>

          <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "1.6rem", color: "#F5F0EB", letterSpacing: "0.05em", marginBottom: "12px" }}>
            {card.title}
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 300, color: "rgba(245,240,235,0.5)", lineHeight: 1.8 }}>
            {card.desc}
          </p>

          {/* bottom-right glow */}
          <div style={{ position: "absolute", bottom: "-40px", right: "-40px", width: "120px", height: "120px", background: "radial-gradient(circle, rgba(255,130,0,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        </div>
      </HealthifyCard>
    </motion.div>
  );
}

function WhyHealthify() {
  return (
    <section className="rsp-section" style={{ background: "transparent", padding: "80px 80px", position: "relative" }}>
      {/* Large orange orb top-center */}
      <div className="rsp-why-orb hidden md:block" style={{ position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "900px", height: "900px", background: "radial-gradient(circle, rgba(255,130,0,0.13) 0%, rgba(255,130,0,0.04) 45%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Orange orb bottom-left */}
      <div className="rsp-why-orb hidden md:block" style={{ position: "absolute", bottom: "-200px", left: "-100px", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(255,130,0,0.1) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Orange orb bottom-right */}
      <div className="rsp-why-orb hidden md:block" style={{ position: "absolute", bottom: "-200px", right: "-100px", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(255,130,0,0.1) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Animated header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.5 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>
              WHY CHOOSE US
            </span>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.5 }} />
          </div>

          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 0.95, marginBottom: "16px" }}>
            <span style={{ color: "#F5F0EB" }}>MORE THAN A </span>
            <span style={{ color: "#FF8200", textShadow: "0 0 40px rgba(255,130,0,0.4)" }}>GYM.</span>
          </h2>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 300, color: "rgba(245,240,235,0.5)" }}>
            We are a community built on strength, support and sisterhood.
          </p>
        </motion.div>

        {/* 2×2 cards grid */}
        <div className="rsp-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2px", maxWidth: "900px", margin: "0 auto" }}>
          {WHY_CARDS.map((card, i) => (
            <WhyCard key={card.title} card={card} delay={i * 0.15} />
          ))}
        </div>

        {/* Bottom stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="rsp-stats-row" style={{ marginTop: "80px", paddingTop: "48px", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {[
            { number: "5", label: "EXPERT TRAINERS" },
            { number: "200+", label: "ACTIVE MEMBERS" },
            { number: "100%", label: "WOMEN FOCUSED" },
          ].map((stat, i, arr) => (
            <div key={stat.label} style={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center" }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="stat-inner"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px" }}
              >
                <span style={{ fontFamily: "var(--font-bebas)", fontSize: "4rem", color: "#FF8200", textShadow: "0 0 20px rgba(255,130,0,0.6), 0 0 40px rgba(255,130,0,0.3), 0 0 80px rgba(255,130,0,0.15)", lineHeight: 1 }}>
                  {stat.number}
                </span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(245,240,235,0.4)", marginTop: "8px", textAlign: "center" }}>
                  {stat.label}
                </span>
              </motion.div>
              {i < arr.length - 1 && (
                <div className="hidden md:block" style={{ width: "1px", height: "40px", background: "rgba(255,130,0,0.15)", flexShrink: 0 }} />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Services Preview ─────────────────────────────────────────────────────────
// Replaced by ServiceCarousel (imported above)

// ─── Membership Teaser ───────────────────────────────────────────────────────

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "Amazing experience, transformation for women's not only means good shaped body it also means a healthy mental health and we get combination of fitness and mental peace.",
    name: "Ambreen Ayub",
    label: "CUSTOMER · GOOGLE REVIEW",
    stars: 5,
  },
  {
    quote: "After a very long wait there came 'The Ladies Gym- Healthify', exclusively for ladies who has been searching for a gym. I myself joined the gym and it is a very great experience to go and do my daily exercises. I am getting a healthy and perfect set of diet plan, exercises and well versed by equipments. I would highly recommend it to all the ladies out there to create a healthy and fit future.",
    name: "Visudha R",
    label: "CUSTOMER · GOOGLE REVIEW",
    stars: 5,
  },
  {
    quote: "I highly recommend Healthify to anyone looking to improve their fitness. I've seen amazing results which I never thought were possible. It has the best equipments, cleanliness and good gym trainers to guide you in your fitness journey 💪",
    name: "Sunita George",
    label: "CUSTOMER · GOOGLE REVIEW",
    stars: 5,
  },
  {
    quote: "I've always struggled to put on weight, but the personalized training and nutrition plan at this gym completely changed me. In just a few months, I gained 5 kgs of weight in 3 months! My trainer and the environment at the gym keeps me motivated every day.",
    name: "Prabha Stella Kullu",
    label: "MEMBER · TRANSFORMATION",
    stars: 5,
  },
];

function TestimonialCard({ t, index }: { t: (typeof TESTIMONIALS)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{
        height: "100%",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <HealthifyCard style={{ height: "100%", boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.4)" : "none", transition: "box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }}>
        <div style={{ padding: "36px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Top-left corner accent */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "50px", background: "linear-gradient(to bottom, #FF8200, transparent)" }} />
          {/* Top accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, #FF8200, transparent)", opacity: 0.3 }} />

          {/* Quote icon */}
          <div style={{ fontFamily: "var(--font-bebas)", fontSize: "5rem", color: "rgba(255,130,0,0.15)", lineHeight: 0.8, marginBottom: "8px" }}>
            &ldquo;
          </div>

          {/* Quote text */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 300, color: "rgba(245,240,235,0.75)", lineHeight: 1.85, fontStyle: "italic", marginBottom: "28px", flex: 1 }}>
            {t.quote}
          </p>

          {/* Divider */}
          <div style={{ height: "1px", background: "linear-gradient(to right, rgba(255,130,0,0.2), transparent)", marginBottom: "20px" }} />

          {/* Member info row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700, color: "#F5F0EB", letterSpacing: "0.05em" }}>
                {t.name}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", color: "#FF8200", textTransform: "uppercase", marginTop: "4px" }}>
                {t.label}
              </div>
            </div>
            <div style={{ color: "#FF8200", fontSize: "14px", letterSpacing: "2px" }}>
              {"★".repeat(t.stars)}
            </div>
          </div>

          {/* Bottom glow */}
          <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "160px", height: "160px", background: "radial-gradient(circle, rgba(255,130,0,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
        </div>
      </HealthifyCard>
    </motion.div>
  );
}

function MembershipTeaser() {
  return (
    <section className="rsp-section" style={{ background: "transparent", padding: "80px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>
              MEMBER STORIES
            </span>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
          </div>

          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 0.95, textAlign: "center", marginBottom: "16px" }}>
            <span style={{ color: "#F5F0EB" }}>WHAT OUR<br />MEMBERS </span>
            <span style={{ color: "#FF8200", textShadow: "0 0 30px rgba(255,130,0,0.3)" }}>SAY.</span>
          </h2>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", textAlign: "center" }}>
            Stories from women who chose to transform their lives at Healthify.
          </p>
        </motion.div>

        {/* 3-column grid */}
        <div className="rsp-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Transformations teaser ──────────────────────────────────────────────────

const TRANSFORMATIONS = [
  {
    image: "/images/transformation-mini-mol.png",
    name: "Mini Mol",
    stat: "-10 KG",
    substat: "6 inches off waist",
    period: "6 Months",
    story: "Proof that consistency is the key.",
  },
  {
    image: "/images/transformation-apu.png",
    name: "Aparna Haldar",
    stat: "-5 KG",
    substat: "5 inches off waist",
    period: "Results",
    story: "Lost 5 kgs, gained energy, strength and confidence. Arthritis pain also minimised.",
  },
  {
    image: "/images/transformation-savy-singh.png",
    name: "Savy Singh",
    stat: "-18 KG",
    substat: "3 Months",
    period: "3 Months",
    story: "From inches lost to confidence gained — dedication to fitness yields remarkable results.",
  },
  {
    image: "/images/transformation-nikita.jpg",
    name: "Nikita",
    stat: "-4.5 KG",
    substat: "1 Month",
    period: "1 Month",
    story: "Lost 4.5 kg in just one month — making incredible progress.",
  },
];

function TransformationsTeaser() {
  return (
    <section id="transformations" className="rsp-section" style={{ padding: "80px 80px", background: "transparent", position: "relative", overflow: "hidden" }}>
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>
              REAL STORIES
            </span>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 0.95, marginBottom: "16px" }}>
            <span style={{ color: "#F5F0EB" }}>REAL WOMEN. REAL </span>
            <span style={{ color: "#FF8200", textShadow: "0 0 30px rgba(255,130,0,0.35)" }}>RESULTS.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 300, color: "rgba(245,240,235,0.45)" }}>
            These aren&apos;t stock photos. These are our members.
          </p>
        </Reveal>
      </div>

      {/* 4-column card grid */}
      <div className="rsp-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {TRANSFORMATIONS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12} stretch>
            <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }} style={{ height: "100%" }}>
              <HealthifyCard style={{ height: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  {/* Photo */}
                  <div style={{ position: "relative", width: "100%", aspectRatio: "9/16", overflow: "hidden" }}>
                    {t.image ? (
                      <Image
                        src={t.image}
                        alt={`${t.name}’s fitness transformation after training at Healthify gym in Sri Vijaya Puram`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a0d00 0%, #0d0d0d 100%)" }} />
                    )}
                    {/* Gradient overlay bottom */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(8,8,8,0.95) 100%)" }} />
                    {/* Stat badge */}
                    <div style={{ position: "absolute", top: 14, left: 14, background: "#FF8200", padding: "6px 14px", borderRadius: 6 }}>
                      <span style={{ fontFamily: "var(--font-bebas)", fontSize: "1.4rem", color: "#080808", letterSpacing: "0.04em", lineHeight: 1 }}>
                        {t.stat}
                      </span>
                    </div>
                    {/* Period badge */}
                    <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(8,8,8,0.75)", border: "1px solid rgba(255,130,0,0.3)", padding: "5px 10px", borderRadius: 6, backdropFilter: "blur(6px)" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", color: "#FF8200", textTransform: "uppercase" }}>
                        {t.period}
                      </span>
                    </div>
                    {/* Name + substat over bottom gradient */}
                    <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                      <p style={{ fontFamily: "var(--font-bebas)", fontSize: "1.4rem", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 1, marginBottom: 4 }}>
                        {t.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", color: "#FF8200", textTransform: "uppercase" }}>
                        {t.substat}
                      </p>
                    </div>
                  </div>

                  {/* Story text */}
                  <div style={{ padding: "20px 20px 22px", flex: 1, display: "flex", alignItems: "flex-start" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 300, color: "rgba(245,240,235,0.6)", lineHeight: 1.75, fontStyle: "italic" }}>
                      &ldquo;{t.story}&rdquo;
                    </p>
                  </div>
                </div>
              </HealthifyCard>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── CTA Banner ──────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="rsp-section" style={{ padding: "80px 80px", position: "relative", overflow: "hidden", background: "transparent" }}>
      {/* Warm orange gradient wash — gives section its own identity over the shared grid */}
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

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "24px" }}
        >
          <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>
            START YOUR JOURNEY
          </span>
          <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: 0.95, marginBottom: "24px" }}
        >
          <span style={{ color: "#F5F0EB" }}>READY TO BECOME<br /></span>
          <span style={{ color: "#FF8200", textShadow: "0 0 60px rgba(255,130,0,0.5)" }}>UNSTOPPABLE?</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", marginBottom: "48px" }}
        >
          Join 200+ women who&apos;ve already transformed their lives at Healthify.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}
        >
          <Link href="/memberships" style={{ textDecoration: "none" }}>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 8px 40px rgba(255,130,0,0.5)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#080808",
              background: "#FF8200",
              border: "none",
              padding: "18px 44px",
              cursor: "pointer",
              borderRadius: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            BOOK A SESSION
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="#080808" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
          </Link>

          <Link href="/contact" style={{ textDecoration: "none" }}>
          <motion.button
            whileHover={{ borderColor: "rgba(255,130,0,0.5)", color: "#F5F0EB" }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(245,240,235,0.5)",
              background: "transparent",
              border: "1px solid rgba(255,130,0,0.2)",
              padding: "18px 44px",
              cursor: "pointer",
              borderRadius: "8px",
              transition: "border-color 0.3s, color 0.3s",
            }}
          >
            VISIT THE GYM
          </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Hero switcher — mounts only the correct hero to prevent GSAP pin bleed ──

function HeroSwitcher() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile === null) return <div style={{ minHeight: "100vh", background: "#000" }} />;
  return isMobile ? <HeroSectionMobile /> : <HeroSection />;
}

function JourneySwitcher() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile === null) return null;
  return isMobile ? <OurJourneyMobile /> : <OurJourney />;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomeClient() {
  return (
    <main>
      <h1 className="sr-only">
        Healthify — Women&apos;s Fitness Gym in Sri Vijaya Puram (Port Blair), Andaman &amp; Nicobar Islands
      </h1>
      <HeroSwitcher />
      <PageBackground />
      <div style={{ position: "relative", background: "#0a0a0a" }}>
        <HomeHexBackground />
        <JourneySwitcher />
        <WhyHealthify />
        <ServiceCarousel />
        <MembershipTeaser />
        <TransformationsTeaser />
        <CTABanner />
      </div>
    </main>
  );
}
