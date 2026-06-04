"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { SparklesCore } from "@/app/_components/SparklesCore";
import OTPModal from "../_components/OTPModal";
import HealthifyCard from "../_components/HealthifyCard";
import { useAuth } from "@/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "All" | "Strength" | "Cardio" | "Wellness" | "Mind & Body" | "Personal";

interface Service {
  id: string;
  title: string;
  tagline: string;
  category: Category;
  image: string;
  imagePosition?: string;
  description: string;
  features: string[];
  duration: string;
  frequency: string;
  intensity: "Low" | "Medium" | "High";
  startingPrice: string;
  memberPrice: string;
  nonMemberPrice: string;
  cta: string;
  comingSoon?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
  {
    id: "personal-training",
    title: "Personal Training",
    tagline: "Your Custom Path to Fitness",
    category: "Personal",
    image: "/images/services/personal-training-new.png",
    description:
      "Work 1-on-1 with certified trainers who build personalized routines around your goals, fitness level, and schedule. Real-time form correction and full accountability.",
    features: [
      "Fully customized workout plans",
      "Expert form correction & injury prevention",
      "Flexible scheduling to match your lifestyle",
    ],
    duration: "30 – 60 mins",
    frequency: "2 – 6 sessions/wk",
    intensity: "High",
    startingPrice: "From ₹3,000/mo",
    memberPrice: "₹3,000",
    nonMemberPrice: "₹3,500",
    cta: "Book a Session",
  },
  {
    id: "strength-training",
    title: "Strength Training",
    tagline: "Build Lean, Stay Strong",
    category: "Strength",
    image: "/images/services/strength-training-new.png",
    description:
      "Progressive resistance training designed for women of all levels. Build lean muscle, improve bone density and transform your physique with structured programming.",
    features: [
      "Progressive overload system",
      "Form coaching every session",
      "6-week program cycles",
    ],
    duration: "60 mins",
    frequency: "Mon · Wed · Fri",
    intensity: "High",
    startingPrice: "From ₹3,000/mo",
    memberPrice: "₹3,000",
    nonMemberPrice: "₹3,500",
    cta: "Start Training",
  },
  {
    id: "zumba-aerobics",
    title: "Zumba / Aerobics",
    tagline: "Dance Your Way to Fitness",
    category: "Cardio",
    image: "/images/services/zumba-new.png",
    imagePosition: "center top",
    description:
      "High-energy group classes that feel more like a party than a workout. Burn calories, build cardio endurance, and join a vibrant community to amazing music.",
    features: [
      "Full-body cardio workout",
      "Expert choreography for all levels",
      "Stress relief through dance",
    ],
    duration: "45 – 60 mins",
    frequency: "8 – 12 classes/wk",
    intensity: "Medium",
    startingPrice: "From ₹3,000/mo",
    memberPrice: "₹3,000",
    nonMemberPrice: "₹3,500",
    cta: "Join a Class",
  },
  {
    id: "women-wellness",
    title: "Women Wellness",
    tagline: "Fitness, Strength & Well-Being",
    category: "Wellness",
    image: "/images/services/women-wellness-new.png",
    description:
      "A safe, supportive space designed by women for women. Holistic approach combining functional strength, flexibility, mental wellness, and community support.",
    features: [
      "Female-only, judgment-free environment",
      "Holistic wellness — body + mind",
      "Built-in community & accountability",
    ],
    duration: "45 – 60 mins",
    frequency: "6 – 8 classes/wk",
    intensity: "Low",
    startingPrice: "From ₹3,000/mo",
    memberPrice: "₹3,000",
    nonMemberPrice: "₹3,500",
    cta: "Start Your Journey",
  },
  {
    id: "nutritional-guidance",
    title: "Nutritional Guidance",
    tagline: "Fuel Your Fitness Goals",
    category: "Wellness",
    image: "/images/services/nutritional-guidance-new.jpg",
    description:
      "Work with certified nutritionists to design meal plans tailored to your body, goals, and lifestyle. Science-backed guidance on nutrition that actually sticks.",
    features: [
      "Personalized meal plans for your goals",
      "Science-backed nutritional advice",
      "Regular check-ins & progress adjustments",
    ],
    duration: "30 – 45 mins",
    frequency: "Flexible",
    intensity: "Low",
    startingPrice: "Included w/ membership",
    memberPrice: "Included",
    nonMemberPrice: "₹1,000/session",
    cta: "Book a Consultation",
  },
  {
    id: "yoga-strength",
    title: "Yoga & Strength",
    tagline: "Strength Meets Serenity",
    category: "Mind & Body",
    image: "/images/services/yoga-new.png",
    description:
      "Blend the best of yoga and strength training in one powerful practice. Build functional strength, improve flexibility, and create a strong mind-body connection.",
    features: [
      "Functional strength development",
      "Improved flexibility & mobility",
      "Stress relief & mental clarity",
    ],
    duration: "60 mins",
    frequency: "6 – 8 classes/wk",
    intensity: "Medium",
    startingPrice: "From ₹3,000/mo",
    memberPrice: "₹3,000",
    nonMemberPrice: "₹3,500",
    cta: "Book Your First Class",
  },
  {
    id: "online-training",
    title: "Online Training",
    tagline: "Train From Anywhere",
    category: "Personal",
    image: "/images/services/personal-training-new.png",
    description:
      "Expert-led personal training sessions delivered online — train with Healthify's certified coaches from the comfort of your home, anywhere in the world.",
    features: [
      "Live 1-on-1 sessions with certified trainers",
      "Custom workout plans delivered digitally",
      "Progress tracking & check-ins via WhatsApp",
    ],
    duration: "45 – 60 mins",
    frequency: "Flexible",
    intensity: "High",
    startingPrice: "Coming Soon",
    memberPrice: "TBA",
    nonMemberPrice: "TBA",
    cta: "Notify Me When Live",
    comingSoon: true,
  },
];

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  {
    label: "All",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    label: "Strength",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3.5 3h1.2v8H3.5zM9.3 3h1.2v8H9.3z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M1.5 5.2h3M9.5 5.2h3M1.5 8.8h3M9.5 8.8h3M4.7 7h4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Cardio",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 2c0 2.5-3.5 3.5-3.5 6.5a3.5 3.5 0 0 0 7 0C10.5 5.5 7 4.5 7 2z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Wellness",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 12S1.5 8.5 1.5 5a2.9 2.9 0 0 1 5.5-1.3A2.9 2.9 0 0 1 12.5 5C12.5 8.5 7 12 7 12z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Mind & Body",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7 4.5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M7 8.5l-2.5 2.5M7 8.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M3.5 10c1 1 2 1.5 3.5 1.5s2.5-.5 3.5-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Personal",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M9.5 3.5l1 1-1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const INTENSITY_STYLE = {
  Low: { color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  Medium: { color: "#facc15", bg: "rgba(250,204,21,0.1)" },
  High: { color: "#FF8200", bg: "rgba(255,130,0,0.1)" },
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const MEMBER_PRODUCTS = [
  { src: "/images/products/product-1.jpg",  label: "HK Vitals Multivitamin Women" },
  { src: "/images/products/product-2.jpg",  label: "MB Fit Protein Bar 10g · Choco Cranberry" },
  { src: "/images/products/product-3.jpg",  label: "FURR Charcoal Nose Strips" },
  { src: "/images/products/product-5.jpg",  label: "MB Fit Protein Bar 20g · Choco Almond" },
  { src: "/images/products/product-8.jpg",  label: "MyFitness Choco Peanut Butter 510g" },
  { src: "/images/products/product-9.jpg",  label: "MyFitness Original Peanut Butter 510g" },
  { src: "/images/product-2.jpg",           label: "HK Vitals Supplement Range" },
  { src: "/images/product-3.jpg",           label: "HK Vitals Apple Cider Vinegar 750mg" },
  { src: "/images/product-4.jpg",           label: "MB Fit Protein Bar 20g · Choco Almond" },
  { src: "/images/product-5.jpg",           label: "MuscleBlaze Biozyme Performance Whey 2kg" },
];

// ─── Floating particles ───────────────────────────────────────────────────────

function ServicesParticles() {
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

// ─── Hex background ───────────────────────────────────────────────────────────

function HexBg() {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="svc-hex" width="83" height="144" patternUnits="userSpaceOnUse">
          <path d="M42,0 L83,24 L83,72 L42,96 L0,72 L0,24 Z M42,96 L42,144" fill="none" stroke="rgba(255,130,0,0.13)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#svc-hex)" />
    </svg>
  );
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

function FilterTabs({ active, onChange }: { active: Category; onChange: (c: Category) => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {CATEGORIES.map(({ label, icon }) => {
        const isActive = active === label;
        return (
          <motion.button
            key={label}
            onClick={() => onChange(label)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 18px",
              borderRadius: 100,
              border: isActive ? "1px solid rgba(255,130,0,0.6)" : "1px solid rgba(255,255,255,0.08)",
              background: isActive
                ? "linear-gradient(135deg, rgba(255,130,0,0.2), rgba(255,130,0,0.08))"
                : "rgba(255,255,255,0.03)",
              color: isActive ? "#FF8200" : "rgba(245,240,235,0.45)",
              fontFamily: "var(--font-display)",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: isActive ? "0 0 16px rgba(255,130,0,0.15)" : "none",
            }}
          >
            {icon}
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────────

function ServiceCard({ service, index, onBook }: { service: Service; index: number; onBook: () => void }) {
  const [imgError, setImgError] = useState(false);
  const [hov, setHov] = useState(false);
  const intensity = INTENSITY_STYLE[service.intensity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: EASE }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hov
          ? "0 0 30px rgba(255,130,0,0.08), 0 24px 48px rgba(0,0,0,0.5)"
          : "0 4px 24px rgba(0,0,0,0.3)",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
      }}
    >
      <HealthifyCard>
        <div style={{ display: "flex", flexDirection: "column" }}>
      {/* ── Image ── */}
      <div
        style={{
          position: "relative",
          height: 210,
          background: "#0a0a0a",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {!imgError ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              objectPosition: service.imagePosition ?? "center",
              transform: hov ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.7s ease",
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #1a0d00, #0f0f0f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        )}

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(8,8,8,0.6) 70%, rgba(8,8,8,0.95) 100%)" }} />
        {/* Hover orange wash */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(255,130,0,0.12), transparent 55%)", opacity: hov ? 1 : 0, transition: "opacity 0.4s ease" }} />
        {/* Top-left corner accent */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: 60, background: "linear-gradient(to bottom, #FF8200, transparent)" }} />

        {/* Category badge */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            padding: "4px 10px",
            background: "rgba(8,8,8,0.7)",
            border: "1px solid rgba(255,130,0,0.3)",
            borderRadius: 100,
            fontFamily: "var(--font-display)",
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "#FF8200",
            textTransform: "uppercase",
            backdropFilter: "blur(6px)",
          }}
        >
          {service.category}
        </div>

        {/* Intensity badge */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            padding: "4px 10px",
            background: intensity.bg,
            border: `1px solid ${intensity.color}40`,
            borderRadius: 100,
            fontFamily: "var(--font-display)",
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: intensity.color,
            textTransform: "uppercase",
            backdropFilter: "blur(6px)",
          }}
        >
          {service.intensity}
        </div>

        {/* Duration + frequency bottom of image */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 14,
            right: 14,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.55rem",
              color: "rgba(245,240,235,0.5)",
              letterSpacing: "0.1em",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1" />
              <path d="M5 2.5v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            {service.duration}
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.5rem" }}>·</span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.55rem",
              color: "rgba(245,240,235,0.5)",
              letterSpacing: "0.1em",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="1.5" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
              <path d="M3 1v1.5M7 1v1.5M1 4h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            {service.frequency}
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: "22px 22px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Title + tagline */}
        <h3
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "1.45rem",
            color: "#F5F0EB",
            letterSpacing: "0.05em",
            lineHeight: 1,
            marginBottom: 5,
          }}
        >
          {service.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.58rem",
            color: "#FF8200",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          {service.tagline}
        </p>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.78rem",
            fontWeight: 300,
            color: "rgba(245,240,235,0.5)",
            lineHeight: 1.75,
            marginBottom: 16,
          }}
        >
          {service.description}
        </p>

        {/* Features */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 18px",
            display: "flex",
            flexDirection: "column",
            gap: 7,
          }}
        >
          {service.features.map((f) => (
            <li
              key={f}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 9,
                fontFamily: "var(--font-body)",
                fontSize: "0.73rem",
                fontWeight: 300,
                color: "rgba(245,240,235,0.62)",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ marginTop: 3, flexShrink: 0 }}>
                <path d="M2 5.5l2.5 2.5 5-5" stroke="#FF8200" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {/* Pricing row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            background: "rgba(255,130,0,0.05)",
            border: "1px solid rgba(255,130,0,0.1)",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.5rem", color: "rgba(245,240,235,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>
              Starting from
            </p>
            <p style={{ fontFamily: "var(--font-bebas)", fontSize: "1.1rem", color: "#FF8200", letterSpacing: "0.04em", lineHeight: 1 }}>
              {service.memberPrice}
              <span style={{ fontFamily: "var(--font-display)", fontSize: "0.5rem", color: "rgba(245,240,235,0.3)", letterSpacing: "0.1em", marginLeft: 4 }}>/mo · members</span>
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.5rem", color: "rgba(245,240,235,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>
              Non-member
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.72rem", color: "rgba(245,240,235,0.5)", fontWeight: 700, letterSpacing: "0.04em" }}>
              {service.nonMemberPrice}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: "auto" }}>
          {service.comingSoon ? (
            <div style={{
              width: "100%",
              padding: "13px 20px",
              background: "rgba(255,200,0,0.06)",
              border: "1px solid rgba(255,200,0,0.25)",
              borderRadius: 10,
              fontFamily: "var(--font-display)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#FFD700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}>
              ⏳ COMING SOON
            </div>
          ) : (
            <motion.button
              onClick={onBook}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(255,130,0,0.4)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%",
                padding: "13px 20px",
                background: "linear-gradient(135deg, #FF8200, #e07520)",
                border: "none",
                borderRadius: 10,
                fontFamily: "var(--font-display)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#080808",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {service.cta}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
        </div>
      </HealthifyCard>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// ─── Equipment images ─────────────────────────────────────────────────────────

const EQUIPMENT_IMAGES = Array.from({ length: 11 }, (_, i) => `/images/equipment/equip-${i + 1}.png`);
const EQUIP_MARQUEE_HALF_W = 11 * 320 + 10 * 16;

// ─── Member products marquee (RAF-driven, GPU-composited) ────────────────────

// 10 cards × 260px + 9 gaps × 16px = 2744px (one full set width)
const MARQUEE_HALF_W = 10 * 260 + 9 * 16;

function GymEquipmentMarqueeSection() {
  const trackW = EQUIP_MARQUEE_HALF_W + 16;
  const trackRef = useRef<HTMLDivElement>(null);
  const DURATION = 32;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let dragging = false, startX = 0, startTX = 0;
    const getTX = () => new DOMMatrix(getComputedStyle(track).transform).m41;
    const onStart = (clientX: number) => {
      dragging = true; startX = clientX; startTX = getTX();
      track.style.animation = "none";
      track.style.transform = `translateX(${startTX}px)`;
      track.style.cursor = "grabbing";
    };
    const onMove = (clientX: number) => {
      if (!dragging) return;
      track.style.transform = `translateX(${startTX + clientX - startX}px)`;
    };
    const onEnd = () => {
      if (!dragging) return; dragging = false;
      const tx = getTX();
      const progress = ((-tx % trackW) + trackW) % trackW / trackW;
      track.style.transform = "";
      track.style.animation = `equip-scroll ${DURATION}s linear infinite`;
      track.style.animationDelay = `${-(progress * DURATION)}s`;
      track.style.cursor = "grab";
    };
    const md = (e: MouseEvent) => { e.preventDefault(); onStart(e.clientX); };
    const mm = (e: MouseEvent) => onMove(e.clientX);
    const ts = (e: TouchEvent) => onStart(e.touches[0].clientX);
    const tm = (e: TouchEvent) => { e.preventDefault(); onMove(e.touches[0].clientX); };
    track.addEventListener("mousedown", md);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", onEnd);
    track.addEventListener("touchstart", ts, { passive: true });
    track.addEventListener("touchmove", tm, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      track.removeEventListener("mousedown", md);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", onEnd);
      track.removeEventListener("touchstart", ts);
      track.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", onEnd);
    };
  }, [trackW]);

  return (
    <section style={{ padding: "120px 0 120px", position: "relative", zIndex: 1 }}>
      <style>{`
        @keyframes equip-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${trackW}px); }
        }
        .equip-track {
          display: flex;
          gap: 16px;
          width: max-content;
          will-change: transform;
          animation: equip-scroll 32s linear infinite;
          cursor: grab;
          user-select: none;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ textAlign: "center", marginBottom: 48, padding: "0 60px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 1, background: "#FF8200", opacity: 0.4 }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>THE GYM</span>
          <div style={{ width: 40, height: 1, background: "#FF8200", opacity: 0.4 }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 0.95 }}>
          <span style={{ color: "#F5F0EB" }}>OUR </span>
          <span style={{ color: "#FF8200", textShadow: "0 0 30px rgba(255,130,0,0.3)" }}>EQUIPMENT.</span>
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", marginTop: 12 }}>
          State-of-the-art facilities built exclusively for women
        </p>
      </motion.div>

      <div style={{ overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 140, background: "linear-gradient(to right, #0d0d0d, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 140, background: "linear-gradient(to left, #0d0d0d, transparent)", zIndex: 2, pointerEvents: "none" }} />

        <div className="equip-track" ref={trackRef}>
          {[...EQUIPMENT_IMAGES, ...EQUIPMENT_IMAGES].map((src, i) => (
            <div
              key={i}
              style={{
                width: 320,
                height: 240,
                borderRadius: 12,
                overflow: "hidden",
                flexShrink: 0,
                border: "1px solid rgba(255,130,0,0.15)",
                position: "relative",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                background: "#111",
              }}
            >
              <img
                src={src}
                alt="Gym equipment"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="eager"
                decoding="async"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(8,8,8,0.6) 100%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: 40, background: "linear-gradient(to bottom, #FF8200, transparent)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EquipmentMarqueeSection() {
  const trackW = MARQUEE_HALF_W + 16;
  const trackRef = useRef<HTMLDivElement>(null);
  const DURATION = 28;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let dragging = false, startX = 0, startTX = 0;
    const getTX = () => new DOMMatrix(getComputedStyle(track).transform).m41;
    const onStart = (clientX: number) => {
      dragging = true; startX = clientX; startTX = getTX();
      track.style.animation = "none";
      track.style.transform = `translateX(${startTX}px)`;
      track.style.cursor = "grabbing";
    };
    const onMove = (clientX: number) => {
      if (!dragging) return;
      track.style.transform = `translateX(${startTX + clientX - startX}px)`;
    };
    const onEnd = () => {
      if (!dragging) return; dragging = false;
      const tx = getTX();
      const progress = ((-tx % trackW) + trackW) % trackW / trackW;
      track.style.transform = "";
      track.style.animation = `products-scroll ${DURATION}s linear infinite`;
      track.style.animationDelay = `${-(progress * DURATION)}s`;
      track.style.cursor = "grab";
    };
    const md = (e: MouseEvent) => { e.preventDefault(); onStart(e.clientX); };
    const mm = (e: MouseEvent) => onMove(e.clientX);
    const ts = (e: TouchEvent) => onStart(e.touches[0].clientX);
    const tm = (e: TouchEvent) => { e.preventDefault(); onMove(e.touches[0].clientX); };
    track.addEventListener("mousedown", md);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", onEnd);
    track.addEventListener("touchstart", ts, { passive: true });
    track.addEventListener("touchmove", tm, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      track.removeEventListener("mousedown", md);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", onEnd);
      track.removeEventListener("touchstart", ts);
      track.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", onEnd);
    };
  }, [trackW]);

  return (
    <section style={{ padding: "120px 0 120px", position: "relative", zIndex: 1 }}>
      <style>{`
        @keyframes products-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${trackW}px); }
        }
        .products-track {
          display: flex;
          gap: 16px;
          width: max-content;
          will-change: transform;
          animation: products-scroll 28s linear infinite;
          cursor: grab;
          user-select: none;
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ textAlign: "center", marginBottom: 48, padding: "0 60px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 1, background: "#FF8200", opacity: 0.4 }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>MEMBER BENEFITS</span>
          <div style={{ width: 40, height: 1, background: "#FF8200", opacity: 0.4 }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 0.95 }}>
          <span style={{ color: "#F5F0EB" }}>EXCLUSIVE </span>
          <span style={{ color: "#FF8200", textShadow: "0 0 30px rgba(255,130,0,0.3)" }}>HEALTH PRODUCTS.</span>
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", marginTop: 12 }}>
          Premium supplements &amp; wellness products available for our members
        </p>
      </motion.div>

      {/* Strip */}
      <div style={{ overflow: "hidden", position: "relative" }}>
        {/* Edge fades */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 140, background: "linear-gradient(to right, #0d0d0d, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 140, background: "linear-gradient(to left, #0d0d0d, transparent)", zIndex: 2, pointerEvents: "none" }} />

        <div className="products-track" ref={trackRef}>
          {[...MEMBER_PRODUCTS, ...MEMBER_PRODUCTS].map((product, i) => (
            <div
              key={i}
              style={{
                width: 260,
                height: 320,
                borderRadius: 12,
                overflow: "hidden",
                flexShrink: 0,
                border: "1px solid rgba(255,130,0,0.18)",
                position: "relative",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                background: "#111",
              }}
            >
              <img
                src={product.src}
                alt={product.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="eager"
                decoding="async"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(8,8,8,0.88) 100%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: 40, background: "linear-gradient(to bottom, #FF8200, transparent)" }} />
              <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, fontFamily: "var(--font-display)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(245,240,235,0.85)", textTransform: "uppercase", lineHeight: 1.4 }}>
                {product.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [otpOpen, setOtpOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleBook = () => {
    if (isAuthenticated) {
      // Already logged in — go straight to booking
      router.push("/memberships#booking-section");
    } else {
      // Not logged in — verify first
      handleBook();
    }
  };

  const filtered =
    activeCategory === "All"
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

  return (
    <main style={{ minHeight: "100vh", background: "#0d0d0d", position: "relative", overflow: "hidden" }}>
      <HexBg />
      <ServicesParticles />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden"
        style={{ position: "relative", paddingTop: "120px", paddingBottom: "40px" }}
      >
        {/* Background particles */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <SparklesCore
            className="w-full h-full"
            background="transparent"
            minSize={0.3}
            maxSize={0.9}
            particleDensity={350}
            particleColor="#FF8200"
            speed={2.5}
            starField={true}
          />
        </div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: "relative", zIndex: 20, display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}
        >
          <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.6 }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.35em", color: "#FF8200" }}>
            HEALTHIFY WOMEN&apos;S FITNESS
          </span>
          <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.6 }} />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          style={{
            position: "relative",
            zIndex: 20,
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(3.5rem, 9vw, 8rem)",
            lineHeight: 0.9,
            color: "#F5F0EB",
            margin: "0 0 28px",
            textAlign: "center",
          }}
        >
          YOUR PROGRAM.
          <br />
          <span style={{ color: "#FF8200", textShadow: "0 0 60px rgba(255,130,0,0.4)" }}>YOUR JOURNEY.</span>
        </motion.h1>

        {/* Gradient lines + focused particles */}
        <div style={{
          position: "relative",
          width: "min(40rem, 100vw)",
          height: "8rem",
          maskImage: "radial-gradient(ellipse 75% 100% at 50% 0%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 100% at 50% 0%, black 30%, transparent 100%)",
        }}>
          <div style={{ position: "absolute", top: 0, left: "12.5%", width: "75%", height: "2px", background: "linear-gradient(to right, transparent, #FF8200, transparent)", filter: "blur(4px)" }} />
          <div style={{ position: "absolute", top: 0, left: "12.5%", width: "75%", height: "1px", background: "linear-gradient(to right, transparent, #FF8200, transparent)" }} />
          <div style={{ position: "absolute", top: 0, left: "37.5%", width: "25%", height: "5px", background: "linear-gradient(to right, transparent, #FF8200, transparent)", filter: "blur(4px)" }} />
          <div style={{ position: "absolute", top: 0, left: "37.5%", width: "25%", height: "1px", background: "linear-gradient(to right, transparent, #FF8200, transparent)" }} />
          <SparklesCore
            className="w-full h-full"
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            particleColor="#FF8200"
            speed={2.5}
            starField={true}
          />
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rsp-svc-hero-btns"
          style={{ position: "relative", zIndex: 20, display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
        >
          <button
            onClick={() => handleBook()}
            className="rsp-svc-hero-btn"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#080808",
              background: "#FF8200",
              padding: "18px 44px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "none")}
          >
            BOOK A SESSION →
          </button>
          <Link
            href="/memberships"
            className="rsp-svc-hero-btn"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#FF8200",
              background: "transparent",
              border: "1px solid rgba(255,130,0,0.4)",
              padding: "18px 44px",
              textDecoration: "none",
              borderRadius: "6px",
              display: "inline-block",
            }}
          >
            VIEW MEMBERSHIPS ↓
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ position: "absolute", bottom: "40px", right: "48px", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
        >
          <span style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 600, letterSpacing: "0.25em", color: "rgba(255,130,0,0.5)" }}>SCROLL</span>
          <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, rgba(255,130,0,0.5), transparent)" }} />
        </motion.div>
      </section>

      {/* ── Stats strip ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,130,0,0.1)",
          borderBottom: "1px solid rgba(255,130,0,0.1)",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)",
          position: "relative",
          zIndex: 1,
          padding: "48px 0",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {[
            { value: "6+", label: "Program Types" },
            { value: "50+", label: "Weekly Classes" },
            { value: "5", label: "Expert Coaches" },
          ].map(({ value, label }, i, arr) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 16px",
                borderRight: i < arr.length - 1 ? "1px solid rgba(255,130,0,0.1)" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "2rem",
                  color: "#FF8200",
                  lineHeight: 1,
                  textShadow: "0 0 20px rgba(255,130,0,0.4)",
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.55rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  color: "rgba(245,240,235,0.35)",
                  textTransform: "uppercase",
                  marginTop: 5,
                }}
              >
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Services section ── */}
      <section className="rsp-section" style={{ padding: "120px 60px 120px", position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 1, background: "#FF8200", opacity: 0.4 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>
              EXPLORE PROGRAMS
            </span>
            <div style={{ width: 40, height: 1, background: "#FF8200", opacity: 0.4 }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 0.95,
              marginBottom: 32,
            }}
          >
            <span style={{ color: "#F5F0EB" }}>FIND YOUR </span>
            <span style={{ color: "#FF8200", textShadow: "0 0 30px rgba(255,130,0,0.3)" }}>PROGRAM.</span>
          </h2>

          {/* Filter tabs */}
          <FilterTabs active={activeCategory} onChange={setActiveCategory} />
        </motion.div>

        {/* Results count */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, maxWidth: 1200, margin: "0 auto 32px" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", color: "rgba(245,240,235,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Showing{" "}
            <span style={{ color: "#FF8200" }}>{filtered.length}</span>
            {" "}program{filtered.length !== 1 ? "s" : ""}
          </p>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, rgba(255,130,0,0.1), transparent)", margin: "0 20px" }} />
        </div>

        {/* Cards grid */}
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="rsp-grid-1"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 24,
              }}
            >
              {filtered.map((service, i) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={i}
                  onBook={() => handleBook()}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Gym Equipment Marquee ── */}
      <GymEquipmentMarqueeSection />

      {/* ── Health Products Marquee ── */}
      <EquipmentMarqueeSection />

      {/* ── CTA Banner ── */}
      <section style={{ position: "relative", padding: "160px 60px", background: "transparent", textAlign: "center", overflow: "hidden", zIndex: 1 }}>
        {/* Warm gradient wash */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,8,8,0) 0%, rgba(20,10,4,0.92) 30%, rgba(20,10,4,0.92) 70%, rgba(8,8,8,0) 100%)", pointerEvents: "none", zIndex: 0 }} />
        {/* Central orange glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 600, background: "radial-gradient(ellipse, rgba(255,130,0,0.12) 0%, rgba(255,130,0,0.04) 40%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        {/* Decorative hex — right */}
        <div className="rsp-cta-hex" style={{ position: "absolute", right: -80, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 0 }}>
          <svg width="420" height="420" viewBox="0 0 200 200" fill="none">
            <polygon points="100,12 174,54 174,146 100,188 26,146 26,54" stroke="#FF8200" strokeWidth="1.5" fill="none" opacity="0.22" />
            <polygon points="100,28 161,63 161,137 100,172 39,137 39,63" stroke="#FF8200" strokeWidth="1" fill="none" opacity="0.12" />
          </svg>
        </div>
        {/* Decorative hex — left */}
        <div className="rsp-cta-hex" style={{ position: "absolute", left: -80, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 0 }}>
          <svg width="420" height="420" viewBox="0 0 200 200" fill="none">
            <polygon points="100,12 174,54 174,146 100,188 26,146 26,54" stroke="#FF8200" strokeWidth="1.5" fill="none" opacity="0.22" />
            <polygon points="100,28 161,63 161,137 100,172 39,137 39,63" stroke="#FF8200" strokeWidth="1" fill="none" opacity="0.12" />
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6, ease: EASE }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 1, background: "#FF8200", opacity: 0.4 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>READY TO BEGIN?</span>
            <div style={{ width: 40, height: 1, background: "#FF8200", opacity: 0.4 }} />
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: 0.95, marginBottom: 24 }}>
            <span style={{ color: "#F5F0EB" }}>START YOUR </span>
            <span style={{ color: "#FF8200", textShadow: "0 0 60px rgba(255,130,0,0.5)" }}>JOURNEY.</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", marginBottom: 48, lineHeight: 1.7 }}>
            Join 200+ women who have already transformed their lives at Healthify. Pick your program and book your first session today.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <motion.button
              onClick={() => handleBook()}
              whileHover={{ scale: 1.04, boxShadow: "0 8px 40px rgba(255,130,0,0.5)" }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: "18px 44px", background: "#FF8200", border: "none", borderRadius: 8, fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#080808", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
            >
              BOOK A SESSION
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#080808" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
            <motion.a href="/memberships"
              whileHover={{ borderColor: "rgba(255,130,0,0.5)", color: "#F5F0EB" }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: "18px 44px", background: "transparent", border: "1px solid rgba(255,130,0,0.2)", borderRadius: 8, fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,240,235,0.5)", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", transition: "border-color 0.3s, color 0.3s" }}>
              VIEW MEMBERSHIPS →
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── OTP / Auth modal ── */}
      <OTPModal isOpen={otpOpen} onClose={() => setOtpOpen(false)} />
    </main>
  );
}
