"use client";

import Link from "next/link";

type Step = { title: string; text: string; cta?: boolean };

const STEPS: Step[] = [
  {
    title: "A Safe Space Is Born",
    text: "Healthify was founded with one purpose – to give women a comfortable, judgment-free environment to train confidently and focus on their goals.",
  },
  {
    title: "Women Training Women",
    text: "We brought in female trainers who understand your body, your mind, and your goals – making every session comfortable and effective.",
  },
  {
    title: "Your Transformation Starts Here",
    text: "Every session is designed to build strength, confidence, and community – because your wellness journey matters.",
  },
  {
    title: "Ready to Start?",
    text: "Join our community of women empowering women.",
    cta: true,
  },
];

export default function OurJourneyMobile() {
  return (
    <section style={{ background: "#000", padding: "64px 28px 72px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "52px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "14px" }}>
          <div style={{ width: "32px", height: "1px", background: "#FF8200", opacity: 0.45 }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.32em", color: "#FF8200", textTransform: "uppercase" }}>
            Our Story
          </span>
          <div style={{ width: "32px", height: "1px", background: "#FF8200", opacity: 0.45 }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "2.2rem", lineHeight: 0.95, letterSpacing: "0.04em", margin: 0 }}>
          <span style={{ color: "#fff" }}>THE HEALTHIFY </span>
          <span style={{ color: "#FF8200" }}>JOURNEY</span>
        </h2>
      </div>

      {/* Timeline cards */}
      <div style={{ maxWidth: "420px", margin: "0 auto" }}>
        {STEPS.map((step, i) => {
          const isLast = i === STEPS.length - 1;
          return (
            <div key={i} style={{ display: "flex", gap: "18px", alignItems: "stretch" }}>

              {/* Left rail: dot + connecting line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: "3px" }}>
                {/* Outer ring */}
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                  border: "1px solid rgba(255,130,0,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF8200" }} />
                </div>
                {/* Connecting line */}
                {!isLast && (
                  <div style={{
                    width: "1px", flex: 1, minHeight: "48px", marginTop: "6px",
                    background: "linear-gradient(to bottom, #FF8200, rgba(255,130,0,0.08))",
                  }} />
                )}
              </div>

              {/* Right: card content */}
              <div style={{ paddingBottom: isLast ? 0 : "36px", flex: 1 }}>
                {/* Step number */}
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700,
                  letterSpacing: "0.25em", color: "rgba(255,130,0,0.45)", textTransform: "uppercase",
                  display: "block", marginBottom: "6px",
                }}>
                  Step 0{i + 1}
                </span>

                <h3 style={{
                  fontFamily: "var(--font-bebas)", fontSize: "1.35rem",
                  letterSpacing: "0.05em", lineHeight: 1.1,
                  color: "#fff", margin: "0 0 10px",
                }}>
                  {step.title}
                </h3>

                <p style={{
                  fontFamily: "var(--font-body)", fontSize: "0.825rem",
                  fontWeight: 300, color: "#888", lineHeight: 1.7,
                  margin: step.cta ? "0 0 18px" : 0,
                }}>
                  {step.text}
                </p>

                {step.cta && (
                  <Link
                    href="/memberships"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      background: "#FF8200", color: "#080808",
                      fontFamily: "var(--font-display)", fontSize: "0.75rem",
                      fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
                      textDecoration: "none", padding: "11px 22px", borderRadius: "5px",
                    }}
                  >
                    Start Your Journey →
                  </Link>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
