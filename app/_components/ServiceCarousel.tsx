"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import HealthifyCard from "./HealthifyCard";

// ─── Icons ─────────────────────────────────────────────────────────────────────

const ICONS = {
  personalTraining: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 5h2v14H6zM16 5h2v14h-2z" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9h5M16 9h5M3 15h5M16 15h5M8 12h8" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  zumba: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M9 18V5l12-2v13" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" stroke="#FF8200" strokeWidth="1.5" />
      <circle cx="18" cy="16" r="3" stroke="#FF8200" strokeWidth="1.5" />
    </svg>
  ),
  wellness: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  nutrition: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M11 20A7 7 0 0 1 4 13C4 7 9 3 12 2c3 1 8 5 8 11a7 7 0 0 1-9 7z" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2v18" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  yoga: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="4" r="2" stroke="#FF8200" strokeWidth="1.5" />
      <path d="M12 6v6" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12l-4 4M12 12l4 4" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 17c1.5 1.5 3.5 2 6 2s4.5-.5 6-2" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  online: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="13" rx="2" stroke="#FF8200" strokeWidth="1.5" />
      <path d="M8 20h8M12 17v3" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.5 9.5l2 2 3-3" stroke="#FF8200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 1,
    name: "Personal Training",
    tagline: "Your Custom Path to Fitness",
    icon: ICONS.personalTraining,
    description:
      "Work 1-on-1 with certified trainers who create personalized routines based on your goals, fitness level, and preferences. Real-time form correction, progress tracking, and full accountability.",
    benefits: [
      "Fully customized workout plans",
      "Expert form correction & injury prevention",
      "Flexible scheduling to match your lifestyle",
      "Progress tracking & regular assessments",
    ],
    pricing: {
      startingPrice: "From ₹5,500/mo",
      options: [
        { duration: "Monthly", members: "₹3,000", nonMembers: "₹3,500" },
        { duration: "Quarterly", members: "₹6,000", nonMembers: "₹9,000" },
        { duration: "Half-yearly", members: "₹10,000", nonMembers: "₹15,000" },
      ],
    },
    details: { Duration: "30 – 60 mins", Frequency: "2 – 6 sessions/wk" },
    ctaText: "Book Your First Session",
  },
  {
    id: 2,
    name: "Zumba / Aerobics",
    tagline: "Dance Your Way to Fitness",
    icon: ICONS.zumba,
    description:
      "High-energy group classes that feel more like a party than a workout. Burn calories, build cardio endurance, and join a vibrant community — all while having fun to amazing music.",
    benefits: [
      "Full-body cardio workout",
      "Fun, motivating group energy",
      "Expert choreography for all levels",
      "Stress relief through dance",
    ],
    pricing: {
      startingPrice: "From ₹3,000/mo",
      options: [
        { duration: "Monthly", members: "₹3,000", nonMembers: "₹3,500" },
        { duration: "Quarterly", members: "₹6,000", nonMembers: "₹9,000" },
        { duration: "Half-yearly", members: "₹10,000", nonMembers: "₹15,000" },
      ],
    },
    details: { Duration: "45 – 60 mins", Frequency: "8 – 12 classes/wk" },
    ctaText: "Join a Class",
  },
  {
    id: 3,
    name: "Women Wellness",
    tagline: "Fitness, Strength & Well-Being",
    icon: ICONS.wellness,
    description:
      "A safe, supportive space designed by women for women. Holistic approach combining functional strength, flexibility, mental wellness, and community — addressing every woman's unique fitness journey.",
    benefits: [
      "Female-only, judgment-free environment",
      "Holistic wellness — body + mind",
      "Personalized attention to individual goals",
      "Built-in community & accountability",
    ],
    pricing: {
      startingPrice: "From ₹3,000/mo",
      options: [
        { duration: "Monthly", members: "₹3,000", nonMembers: "₹3,500" },
        { duration: "Quarterly", members: "₹6,000", nonMembers: "₹9,000" },
        { duration: "Half-yearly", members: "₹10,000", nonMembers: "₹15,000" },
      ],
    },
    details: { Duration: "45 – 60 mins", Frequency: "6 – 8 classes/wk" },
    ctaText: "Start Your Wellness Journey",
  },
  {
    id: 4,
    name: "Nutritional Guidance",
    tagline: "Fuel Your Fitness Goals",
    icon: ICONS.nutrition,
    description:
      "Work with certified nutritionists to design meal plans tailored to your body, goals, and lifestyle. Science-backed guidance on nutrition and supplementation that actually sticks.",
    benefits: [
      "Personalized meal plans for your goals",
      "Science-backed nutritional advice",
      "Supplement guidance & recommendations",
      "Regular check-ins & progress adjustments",
    ],
    pricing: {
      startingPrice: "Included w/ membership",
      options: [
        { duration: "Single Session", members: "Included", nonMembers: "₹1,000" },
        { duration: "3-Session Pack", members: "Included", nonMembers: "₹2,500" },
        { duration: "Monthly", members: "Included", nonMembers: "₹5,000" },
      ],
    },
    details: { Duration: "30 – 45 mins", Frequency: "Flexible" },
    ctaText: "Schedule a Consultation",
  },
  {
    id: 5,
    name: "Yoga & Strength",
    tagline: "Strength Meets Serenity",
    icon: ICONS.yoga,
    description:
      "Blend the best of yoga and strength training in one powerful practice. Build functional strength, improve flexibility, calm your mind, and create a strong mind-body connection.",
    benefits: [
      "Functional strength development",
      "Improved flexibility & mobility",
      "Stress relief & mental clarity",
      "Mind-body-spirit integration",
    ],
    pricing: {
      startingPrice: "From ₹3,000/mo",
      options: [
        { duration: "Monthly", members: "₹3,000", nonMembers: "₹3,500" },
        { duration: "Quarterly", members: "₹6,000", nonMembers: "₹9,000" },
        { duration: "Half-yearly", members: "₹10,000", nonMembers: "₹15,000" },
      ],
    },
    details: { Duration: "60 mins", Frequency: "6 – 8 classes/wk" },
    ctaText: "Book Your First Class",
  },
  {
    id: 6,
    name: "Online Training",
    tagline: "Train From Anywhere",
    icon: ICONS.online,
    comingSoon: true,
    description:
      "Expert-led personal training sessions delivered online — so you can train with Healthify's certified coaches from the comfort of your home, anywhere in the world.",
    benefits: [
      "Live 1-on-1 sessions with certified trainers",
      "Custom workout plans delivered digitally",
      "Progress tracking & check-ins via WhatsApp",
      "Flexible scheduling across time zones",
    ],
    pricing: {
      startingPrice: "Coming Soon",
      options: [
        { duration: "Monthly", members: "TBA", nonMembers: "TBA" },
      ],
    },
    details: { Duration: "45 – 60 mins", Frequency: "Flexible" },
    ctaText: "Notify Me When Live",
  },
];

type Service = (typeof SERVICES)[0];

// ─── Layout constants ──────────────────────────────────────────────────────────

const EXP_W = 360;
const COL_W = 140;
const GAP = 20;
const EXP_H = 510;
const COL_H = 300;
const TRACK_H = 550;
const EASE = [0.45, 0, 0.55, 1] as [number, number, number, number]; // gentle symmetric ease-in-out

// ─── Collapsed card ───────────────────────────────────────────────────────────

function CollapsedCard({ service, onClick }: { service: Service; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: "20px 8px",
        cursor: "pointer",
        opacity: hov ? 0.9 : 0.55,
        transition: "opacity 0.3s",
      }}
    >
      {/* Icon box */}
      <div
        style={{
          width: 42,
          height: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: hov ? "rgba(255,130,0,0.14)" : "rgba(255,130,0,0.07)",
          border: "1px solid rgba(255,130,0,0.2)",
          borderRadius: 10,
          transition: "background 0.3s",
          flexShrink: 0,
        }}
      >
        {service.icon}
      </div>

      <p
        style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "0.82rem",
          color: "#F5F0EB",
          letterSpacing: "0.08em",
          textAlign: "center",
          writingMode: "vertical-lr",
          transform: "rotate(180deg)",
          lineHeight: 1.4,
        }}
      >
        {service.name}
      </p>

      <div
        style={{
          background: service.comingSoon ? "rgba(255,200,0,0.1)" : "rgba(255,130,0,0.12)",
          border: `1px solid ${service.comingSoon ? "rgba(255,200,0,0.3)" : "rgba(255,130,0,0.25)"}`,
          borderRadius: 4,
          padding: "3px 7px",
          fontSize: "0.52rem",
          fontFamily: "var(--font-display)",
          color: service.comingSoon ? "#FFD700" : "#FF8200",
          letterSpacing: "0.08em",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {service.comingSoon ? "COMING SOON" : service.pricing.startingPrice}
      </div>
    </div>
  );
}

// ─── Expanded card ────────────────────────────────────────────────────────────

function ExpandedCard({ service }: { service: Service }) {
  return (
    <div
      style={{
        padding: "24px 22px 22px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0, // allow flex children to shrink
      }}
    >
      {/* Header: icon box + name/tagline */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,130,0,0.1)",
            border: "1px solid rgba(255,130,0,0.25)",
            borderRadius: 12,
            flexShrink: 0,
          }}
        >
          {service.icon}
        </div>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "1.4rem",
              color: "#F5F0EB",
              letterSpacing: "0.05em",
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            {service.name}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.57rem",
              color: "#FF8200",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {service.tagline}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(to right, #FF8200, transparent)",
          opacity: 0.3,
          marginBottom: 12,
        }}
      />

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.71rem",
          fontWeight: 300,
          color: "rgba(245,240,235,0.55)",
          lineHeight: 1.7,
          marginBottom: 12,
        }}
      >
        {service.description}
      </p>

      {/* Benefits */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 12px",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        {service.benefits.slice(0, 3).map((b) => (
          <li
            key={b}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              fontFamily: "var(--font-body)",
              fontSize: "0.68rem",
              fontWeight: 300,
              color: "rgba(245,240,235,0.62)",
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              style={{ marginTop: 3, flexShrink: 0 }}
            >
              <path
                d="M1.5 5l2.5 2.5 5-5"
                stroke="#FF8200"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {b}
          </li>
        ))}
      </ul>

      {/* Pricing block */}
      <div
        style={{
          background: "rgba(255,130,0,0.05)",
          border: "1px solid rgba(255,130,0,0.12)",
          borderRadius: 8,
          padding: "9px 12px",
          marginBottom: 10,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.52rem",
            letterSpacing: "0.18em",
            color: "#FF8200",
            textTransform: "uppercase",
            marginBottom: 7,
          }}
        >
          Pricing
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {service.pricing.options.slice(0, 2).map((o) => (
            <div
              key={o.duration}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.62rem",
                  color: "rgba(245,240,235,0.4)",
                }}
              >
                {o.duration}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.65rem",
                    color: "#FF8200",
                    fontWeight: 700,
                  }}
                >
                  {o.members}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.55rem",
                    color: "rgba(245,240,235,0.22)",
                  }}
                >
                  · {o.nonMembers}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.5rem",
            color: "rgba(245,240,235,0.2)",
            marginTop: 5,
            textAlign: "right",
          }}
        >
          member · non-member
        </p>
      </div>

      {/* Details chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {Object.entries(service.details).map(([k, v]) => (
          <div
            key={k}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 6,
              padding: "6px 8px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.48rem",
                color: "#FF8200",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              {k}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6rem",
                fontWeight: 300,
                color: "rgba(245,240,235,0.5)",
              }}
            >
              {v}
            </p>
          </div>
        ))}
      </div>

      {/* CTA — pinned to bottom via marginTop auto */}
      <div style={{ marginTop: "auto" }}>
        {service.comingSoon ? (
          <div style={{
            width: "100%",
            padding: "13px 20px",
            background: "rgba(255,200,0,0.06)",
            border: "1px solid rgba(255,200,0,0.25)",
            borderRadius: 8,
            fontFamily: "var(--font-display)",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
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
          <Link href="/contact" style={{ display: "block", textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(255,130,0,0.45)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%",
                padding: "13px 20px",
                background: "linear-gradient(135deg, #FF8200, #e07520)",
                border: "none",
                borderRadius: 8,
                fontFamily: "var(--font-display)",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#080808",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {service.ctaText}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Arrow button ─────────────────────────────────────────────────────────────

function ArrowBtn({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const posStyle = direction === "left" ? { left: 8 } : { right: 8 };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={direction === "left" ? "Previous service" : "Next service"}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        ...posStyle,
        zIndex: 20,
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: hov ? "rgba(255,130,0,0.2)" : "rgba(13,13,13,0.85)",
        border: hov ? "1px solid rgba(255,130,0,0.6)" : "1px solid rgba(255,130,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background 0.25s, border 0.25s",
        backdropFilter: "blur(8px)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        {direction === "left" ? (
          <path
            d="M10 12L6 8l4-4"
            stroke={hov ? "#FF8200" : "rgba(245,240,235,0.7)"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 4l4 4-4 4"
            stroke={hov ? "#FF8200" : "rgba(245,240,235,0.7)"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ServiceCarousel() {
  const [current, setCurrent] = useState(0);
  const [containerW, setContainerW] = useState(960);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchX = useRef(0);

  // Measure container width
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setContainerW(containerRef.current.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Auto-scroll — continuous, never pauses
  useEffect(() => {
    const id = setInterval(
      () => setCurrent((p) => (p + 1) % SERVICES.length),
      4000
    );
    return () => clearInterval(id);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setCurrent((p) => (p + 1) % SERVICES.length);
      if (e.key === "ArrowLeft") setCurrent((p) => (p - 1 + SERVICES.length) % SERVICES.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const goTo = useCallback((i: number) => setCurrent(i), []);
  const goNext = () => goTo((current + 1) % SERVICES.length);
  const goPrev = () => goTo((current - 1 + SERVICES.length) % SERVICES.length);

  const isMobile = containerW < 680;
  const trackX = containerW / 2 - (current * (COL_W + GAP) + EXP_W / 2);

  return (
    <section
      style={{ padding: "80px 50px", background: "transparent", position: "relative" }}
      aria-label="Services carousel"
    >
      {/* Ambient orb */}
      <div
        style={{
          position: "absolute",
          top: "-250px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "900px",
          background:
            "radial-gradient(circle, rgba(255,130,0,0.09) 0%, rgba(255,130,0,0.03) 45%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div style={{ width: 40, height: 1, background: "#FF8200", opacity: 0.4 }} />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.3em",
                color: "#FF8200",
              }}
            >
              OUR SERVICES
            </span>
            <div style={{ width: 40, height: 1, background: "#FF8200", opacity: 0.4 }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(3rem, 5.5vw, 5rem)",
              lineHeight: 0.92,
              marginBottom: 16,
            }}
          >
            <span style={{ color: "#F5F0EB" }}>EXPERT-LED </span>
            <span style={{ color: "#FF8200", textShadow: "0 0 30px rgba(255,130,0,0.3)" }}>
              PROGRAMS.
            </span>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              fontWeight: 300,
              color: "rgba(245,240,235,0.45)",
              marginBottom: 20,
            }}
          >
            Designed for every goal and every stage of your fitness journey.
          </p>

          <a
            href="/services"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#FF8200",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            VIEW ALL SERVICES →
          </a>
        </motion.div>

        {/* ── Carousel ── */}
        <div
          ref={containerRef}
          style={{ position: "relative" }}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
          }}
        >
          {isMobile ? (
            /* Mobile: single full-width card + nav row below */
            <div>
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  minHeight: EXP_H,
                  boxShadow: "0 0 20px rgba(255,130,0,0.2), 0 0 60px rgba(255,130,0,0.1), 0 20px 40px rgba(0,0,0,0.4)",
                }}
              >
                <HealthifyCard variant="bold" style={{ height: "100%" }}>
                  <ExpandedCard service={SERVICES[current]} />
                </HealthifyCard>
              </motion.div>
              {/* Nav row — below card, never overlapping */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 20 }}>
                <button
                  onClick={goPrev}
                  aria-label="Previous service"
                  style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(13,13,13,0.9)", border: "1px solid rgba(255,130,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 12L6 8l4-4" stroke="rgba(245,240,235,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#555" }}>
                  {current + 1} / {SERVICES.length}
                </span>
                <button
                  onClick={goNext}
                  aria-label="Next service"
                  style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(13,13,13,0.9)", border: "1px solid rgba(255,130,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="rgba(245,240,235,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* Desktop: full 5-card track */
            <div style={{ position: "relative", height: TRACK_H, overflow: "hidden" }}>
              {/* Centering wrapper */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
                <motion.div
                  animate={{ x: trackX }}
                  transition={{ duration: 1.1, ease: EASE }}
                  style={{ display: "flex", gap: GAP, position: "relative" }}
                >
                  {SERVICES.map((service, i) => {
                    const isActive = i === current;
                    return (
                      <motion.div
                        key={service.id}
                        animate={{
                          width: isActive ? EXP_W : COL_W,
                          height: isActive ? EXP_H : COL_H,
                          opacity: isActive ? 1 : 0.5,
                        }}
                        transition={{ duration: 1.1, ease: EASE }}
                        style={{
                          flexShrink: 0,
                          boxShadow: isActive
                            ? "0 0 20px rgba(255,130,0,0.2), 0 0 60px rgba(255,130,0,0.1), 0 20px 40px rgba(0,0,0,0.4)"
                            : "none",
                          transition: "box-shadow 1.2s ease",
                          borderRadius: 16,
                        }}
                      >
                        <HealthifyCard
                          variant={isActive ? "bold" : "subtle"}
                          style={{ height: "100%" }}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isActive ? (
                              <motion.div
                                key="expanded"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                style={{ height: "100%" }}
                              >
                                <ExpandedCard service={service} />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="collapsed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                style={{ height: "100%" }}
                              >
                                <CollapsedCard service={service} onClick={() => goTo(i)} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </HealthifyCard>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Edge fades */}
              <div
                style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 80,
                  background: "linear-gradient(to right, #0d0d0d, transparent)",
                  pointerEvents: "none", zIndex: 10,
                }}
              />
              <div
                style={{
                  position: "absolute", right: 0, top: 0, bottom: 0, width: 80,
                  background: "linear-gradient(to left, #0d0d0d, transparent)",
                  pointerEvents: "none", zIndex: 10,
                }}
              />

              <ArrowBtn direction="left" onClick={goPrev} />
              <ArrowBtn direction="right" onClick={goNext} />
            </div>
          )}
        </div>

        {/* ── Dot indicators ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginTop: 28,
          }}
        >
          {SERVICES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to ${SERVICES[i].name}`}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? "#FF8200" : "rgba(255,130,0,0.22)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.35s ease, background 0.35s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
