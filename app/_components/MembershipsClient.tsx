"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/api-client";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { validatePhoneNumber } from "@/lib/auth";
import HealthifyCard from "../_components/HealthifyCard";
import { useAuth } from "@/context/AuthContext";

// ─── Hex grid SVG background ──────────────────────────────────────────────────

function HexBackground() {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="mem-hex" width="83" height="144" patternUnits="userSpaceOnUse">
          <path d="M42,0 L83,24 L83,72 L42,96 L0,72 L0,24 Z M42,96 L42,144" fill="none" stroke="rgba(255,130,0,0.13)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mem-hex)" />
    </svg>
  );
}

// ─── Background canvas (particles) ───────────────────────────────────────────

function MembershipsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

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
        grd.addColorStop(1, `rgba(255,130,0,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ESSENTIAL_ROWS = [
  { type: "MONTHLY",          member: 3000,  nonMember: 3500  as number | null, pt: false },
  { type: "QUARTERLY",        member: 6000,  nonMember: 9000  as number | null, pt: false },
  { type: "HALF YEARLY",      member: 10000, nonMember: 15000 as number | null, pt: false },
  { type: "YEARLY",           member: 18000, nonMember: 25000 as number | null, pt: false },
  { type: "PT / MONTHLY",     member: 5500,  nonMember: 6500  as number | null, pt: true  },
  { type: "PT / QUARTERLY",   member: 15000, nonMember: 19500 as number | null,  pt: true  },
  { type: "PT / HALF YEARLY", member: 27000, nonMember: 39000 as number | null,  pt: true  },
];

const YOGA_ROWS = [
  { type: "MONTHLY",     member: 3000,  nonMember: 3500  },
  { type: "QUARTERLY",   member: 6000,  nonMember: 9000  },
  { type: "HALF YEARLY", member: 10000, nonMember: 15000 },
  { type: "YEARLY",      member: 18000, nonMember: 25000 },
];

const COMBO_ROWS = [
  { type: "MONTHLY",     price: 5000,  benefit: "₹1,000 discount" },
  { type: "QUARTERLY",   price: 10000, benefit: "₹2,000 discount" },
  { type: "HALF YEARLY", price: 17500, benefit: "₹2,500 discount + 01 WEEK PT" },
  { type: "YEARLY",      price: 30000, benefit: "₹6,000 discount + 15 DAYS PT" },
];


// ─── Duration picker ──────────────────────────────────────────────────────────

type DurationOption = {
  label: string;
  planName: string;
  memberPrice: string;
  nonMemberPrice: string | null;
  memberPricePaise: number;
  nonMemberPricePaise: number | null;
};
const PLAN_DURATIONS: Record<string, { title: string; options: DurationOption[] }> = {
  essential: {
    title: "ESSENTIAL (STRENGTH)",
    options: [
      { label: "Monthly",          planName: "Essential (Strength) — Monthly",        memberPrice: "₹3,000",  nonMemberPrice: "₹3,500",  memberPricePaise: 300000,  nonMemberPricePaise: 350000  },
      { label: "Quarterly",        planName: "Essential (Strength) — Quarterly",      memberPrice: "₹6,000",  nonMemberPrice: "₹9,000",  memberPricePaise: 600000,  nonMemberPricePaise: 900000  },
      { label: "Half Yearly",      planName: "Essential (Strength) — Half Yearly",    memberPrice: "₹10,000", nonMemberPrice: "₹15,000", memberPricePaise: 1000000, nonMemberPricePaise: 1500000 },
      { label: "Yearly",           planName: "Essential (Strength) — Yearly",         memberPrice: "₹18,000", nonMemberPrice: "₹25,000", memberPricePaise: 1800000, nonMemberPricePaise: 2500000 },
      { label: "PT / Monthly",     planName: "Essential (Strength) — PT Monthly",     memberPrice: "₹5,500",  nonMemberPrice: "₹6,500",  memberPricePaise: 550000,  nonMemberPricePaise: 650000  },
      { label: "PT / Quarterly",   planName: "Essential (Strength) — PT Quarterly",   memberPrice: "₹15,000", nonMemberPrice: "₹19,500", memberPricePaise: 1500000, nonMemberPricePaise: 1950000 },
      { label: "PT / Half Yearly", planName: "Essential (Strength) — PT Half Yearly", memberPrice: "₹27,000", nonMemberPrice: "₹39,000", memberPricePaise: 2700000, nonMemberPricePaise: 3900000 },
    ],
  },
  yoga: {
    title: "YOGA / AEROBICS / ZUMBA",
    options: [
      { label: "Monthly",     planName: "Yoga / Aerobics / Zumba — Monthly",     memberPrice: "₹3,000",  nonMemberPrice: "₹3,500",  memberPricePaise: 300000,  nonMemberPricePaise: 350000  },
      { label: "Quarterly",   planName: "Yoga / Aerobics / Zumba — Quarterly",   memberPrice: "₹6,000",  nonMemberPrice: "₹9,000",  memberPricePaise: 600000,  nonMemberPricePaise: 900000  },
      { label: "Half Yearly", planName: "Yoga / Aerobics / Zumba — Half Yearly", memberPrice: "₹10,000", nonMemberPrice: "₹15,000", memberPricePaise: 1000000, nonMemberPricePaise: 1500000 },
      { label: "Yearly",      planName: "Yoga / Aerobics / Zumba — Yearly",      memberPrice: "₹18,000", nonMemberPrice: "₹25,000", memberPricePaise: 1800000, nonMemberPricePaise: 2500000 },
    ],
  },
  combo: {
    title: "STRENGTH + ZUMBA / AEROBICS",
    options: [
      { label: "Monthly",     planName: "Strength + Zumba / Aerobics (Combo) — Monthly",     memberPrice: "₹5,000",  nonMemberPrice: null, memberPricePaise: 500000,  nonMemberPricePaise: null },
      { label: "Quarterly",   planName: "Strength + Zumba / Aerobics (Combo) — Quarterly",   memberPrice: "₹10,000", nonMemberPrice: null, memberPricePaise: 1000000, nonMemberPricePaise: null },
      { label: "Half Yearly", planName: "Strength + Zumba / Aerobics (Combo) — Half Yearly", memberPrice: "₹17,500", nonMemberPrice: null, memberPricePaise: 1750000, nonMemberPricePaise: null },
      { label: "Yearly",      planName: "Strength + Zumba / Aerobics (Combo) — Yearly",      memberPrice: "₹30,000", nonMemberPrice: null, memberPricePaise: 3000000, nonMemberPricePaise: null },
    ],
  },
};

function DurationModal({
  planKey, hasLifetime, onConfirm, onClose,
}: {
  planKey: string;
  hasLifetime: boolean;
  onConfirm: (planName: string, includeMembership: boolean) => void;
  onClose: () => void;
}) {
  const plan = PLAN_DURATIONS[planKey];
  const options = plan.options;
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedName, setSelectedName] = useState(options[0].planName);
  const isCombo = planKey === "combo";

  const selectedOpt = options.find((o) => o.planName === selectedName) ?? options[0];
  const MEMBERSHIP_FEE = 3000;
  const withTotal = selectedOpt.memberPricePaise / 100 + MEMBERSHIP_FEE;
  const withTotalStr = inr(withTotal);
  const withoutTotal = selectedOpt.nonMemberPricePaise != null ? selectedOpt.nonMemberPricePaise / 100 : selectedOpt.memberPricePaise / 100;
  const withoutStr = selectedOpt.nonMemberPrice ?? selectedOpt.memberPrice;
  const savings = withoutTotal - withTotal;

  const handleStep1Continue = () => {
    if (hasLifetime) {
      onConfirm(selectedName, false);
      onClose();
    } else {
      setStep(2);
    }
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.78)",
    backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
    justifyContent: "center", padding: "20px",
  };
  const cardStyle: React.CSSProperties = {
    background: "#111", border: "1px solid rgba(255,130,0,0.25)", borderRadius: "16px",
    padding: "32px", width: "100%", maxWidth: "500px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.8)", maxHeight: "90vh", overflowY: "auto" as const,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={overlayStyle} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        style={cardStyle} onClick={(e) => e.stopPropagation()}
      >
        {step === 1 ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", color: "#FF8200", marginBottom: "6px" }}>SELECT DURATION</div>
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1.6rem", color: "#F5F0EB", lineHeight: 1 }}>{plan.title}</div>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(245,240,235,0.4)", cursor: "pointer", fontSize: "22px", lineHeight: 1, padding: "0 0 0 12px" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {options.map((opt) => {
                const active = selectedName === opt.planName;
                return (
                  <div key={opt.planName} onClick={() => setSelectedName(opt.planName)} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 18px", borderRadius: "10px", cursor: "pointer",
                    border: `1px solid ${active ? "#FF8200" : "rgba(255,130,0,0.12)"}`,
                    background: active ? "rgba(255,130,0,0.1)" : "rgba(255,255,255,0.02)",
                    transition: "border-color 0.18s, background 0.18s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${active ? "#FF8200" : "rgba(255,130,0,0.3)"}`,
                        background: active ? "#FF8200" : "transparent", transition: "border-color 0.18s, background 0.18s" }} />
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600,
                        letterSpacing: "0.06em", color: active ? "#F5F0EB" : "rgba(245,240,235,0.65)", textTransform: "uppercase" as const }}>{opt.label}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-bebas)", fontSize: "1.15rem",
                      color: active ? "#FF8200" : "rgba(245,240,235,0.5)", letterSpacing: "0.04em" }}>
                      {opt.nonMemberPrice ?? opt.memberPrice}
                    </span>
                  </div>
                );
              })}
            </div>
            {!hasLifetime && (
              <div style={{ background: "rgba(255,130,0,0.04)", border: "1px solid rgba(255,130,0,0.12)", borderRadius: "8px", padding: "11px 14px", marginBottom: "18px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: "rgba(255,130,0,0.65)", letterSpacing: "0.03em" }}>
                  💡 Members get lower prices — you can add membership in the next step.
                </span>
              </div>
            )}
            <button onClick={handleStep1Continue} style={{
              width: "100%", padding: "15px", background: "#FF8200", color: "#080808",
              fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase" as const,
              border: "none", borderRadius: "8px", cursor: "pointer" }}>
              CONTINUE →
            </button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", color: "#FF8200", marginBottom: "6px" }}>
                  {isCombo ? "MEMBERSHIP REQUIRED" : "ADD LIFETIME MEMBERSHIP?"}
                </div>
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1.35rem", color: "#F5F0EB", lineHeight: 1 }}>{selectedOpt.label} · {plan.title}</div>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(245,240,235,0.4)", cursor: "pointer", fontSize: "22px", lineHeight: 1, padding: "0 0 0 12px" }}>✕</button>
            </div>
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "rgba(255,130,0,0.55)", fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", cursor: "pointer", padding: "0 0 18px 0", display: "block" }}>
              ← CHANGE DURATION
            </button>

            {isCombo ? (
              <>
                <div style={{ background: "rgba(255,130,0,0.06)", border: "1px solid rgba(255,130,0,0.2)", borderRadius: "10px", padding: "20px", marginBottom: "16px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: "rgba(245,240,235,0.45)", marginBottom: "14px" }}>COMBO PLAN IS EXCLUSIVE TO MEMBERS</div>
                  {[
                    { label: "Combo Plan", price: selectedOpt.memberPrice },
                    { label: "Lifetime Membership", price: "₹3,000" },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", color: "rgba(245,240,235,0.65)" }}>{row.label}</span>
                      <span style={{ fontFamily: "var(--font-bebas)", fontSize: "1.05rem", color: "#F5F0EB" }}>{row.price}</span>
                    </div>
                  ))}
                  <div style={{ height: "1px", background: "rgba(255,130,0,0.2)", margin: "10px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#F5F0EB" }}>TOTAL</span>
                    <span style={{ fontFamily: "var(--font-bebas)", fontSize: "1.4rem", color: "#FF8200" }}>{withTotalStr}</span>
                  </div>
                </div>
                <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "8px", padding: "14px 16px", marginBottom: "18px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "#22c55e", marginBottom: "8px" }}>YOUR LIFETIME MEMBER BENEFITS</div>
                  {["Member pricing on all future plans", "Drop-in pass at ₹200 (non-members pay ₹250)", "Exclusive member-only offers"].map((b) => (
                    <div key={b} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ color: "#22c55e", fontSize: "12px", flexShrink: 0 }}>✓</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 300, color: "rgba(245,240,235,0.5)" }}>{b}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { onConfirm(selectedName, true); onClose(); }} style={{
                  width: "100%", padding: "15px", background: "#FF8200", color: "#080808",
                  fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase" as const,
                  border: "none", borderRadius: "8px", cursor: "pointer" }}>
                  CONFIRM & PROCEED →
                </button>
              </>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "18px 14px" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(245,240,235,0.35)", marginBottom: "10px" }}>WITHOUT MEMBERSHIP</div>
                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem", color: "#F5F0EB", lineHeight: 1 }}>{withoutStr}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "rgba(245,240,235,0.28)", marginTop: "6px" }}>standard rate</div>
                  </div>
                  <div style={{ background: "rgba(255,130,0,0.07)", border: "1px solid rgba(255,130,0,0.3)", borderRadius: "10px", padding: "18px 14px" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: "#FF8200", marginBottom: "6px" }}>WITH MEMBERSHIP</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "rgba(245,240,235,0.38)", marginBottom: "4px" }}>₹3,000 + {selectedOpt.memberPrice}</div>
                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem", color: "#FF8200", lineHeight: 1 }}>{withTotalStr}</div>
                    {savings > 0 && (
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: "#22c55e", marginTop: "8px", background: "rgba(34,197,94,0.12)", display: "inline-block", padding: "3px 8px", borderRadius: "4px" }}>
                        SAVE {inr(savings)}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ background: "rgba(255,130,0,0.03)", border: "1px solid rgba(255,130,0,0.1)", borderRadius: "8px", padding: "14px 16px", marginBottom: "18px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", color: "#FF8200", marginBottom: "10px" }}>IS MEMBERSHIP WORTH IT?</div>
                  {[
                    "One-time payment of ₹3,000 — never expires",
                    savings > 0 ? `${selectedOpt.label} plan saves you ${inr(savings)} right away with membership` : "Half Yearly & Yearly plans offer big savings with membership",
                    "Drop-in pass: ₹200 for members (non-members pay ₹250)",
                    "Recommended if you plan to train for 6 months or more",
                  ].map((pt, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "5px" }}>
                      <span style={{ color: "#FF8200", fontSize: "10px", marginTop: "2px", flexShrink: 0 }}>•</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 300, color: "rgba(245,240,235,0.5)", lineHeight: 1.5 }}>{pt}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button onClick={() => { onConfirm(selectedName, true); onClose(); }} style={{
                    width: "100%", padding: "15px", background: "#FF8200", color: "#080808",
                    fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase" as const,
                    border: "none", borderRadius: "8px", cursor: "pointer" }}>
                    YES, ADD MEMBERSHIP — {withTotalStr} TOTAL →
                  </button>
                  <button onClick={() => { onConfirm(selectedName, false); onClose(); }} style={{
                    width: "100%", padding: "14px", background: "transparent", color: "rgba(245,240,235,0.5)",
                    fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 600,
                    letterSpacing: "0.1em", textTransform: "uppercase" as const,
                    border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px", cursor: "pointer" }}>
                    CONTINUE WITHOUT MEMBERSHIP ({withoutStr})
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Active membership types + helpers ───────────────────────────────────────

type ActiveMembership = {
  id: string;
  serviceName: string;
  startDate: string;
  expiresAt: string | null;
  isLifetime: boolean;
};

function getPlanCategory(name: string): "essential" | "yoga" | "combo" | "lifetime" | "dropin" | null {
  const base = name.replace(" + Lifetime Membership", "");
  if (base.startsWith("Essential"))       return "essential";
  if (base.startsWith("Yoga"))            return "yoga";
  if (base.startsWith("Strength + Zumba")) return "combo";
  if (base === "Lifetime Membership")     return "lifetime";
  if (base === "Drop-In Pass (Daily)")   return "dropin";
  return null;
}

function getDurationRank(name: string): number {
  if (name.includes("PT Half Yearly")) return 7;
  if (name.includes("PT Quarterly"))   return 6;
  if (name.includes("PT Monthly"))     return 5;
  if (name.includes("Yearly"))         return 4;
  if (name.includes("Half Yearly"))    return 3;
  if (name.includes("Quarterly"))      return 2;
  if (name.includes("Monthly"))        return 1;
  return 0;
}

function ActiveMemberBanner({ membership }: { membership: ActiveMembership }) {
  const expiry = membership.expiresAt ? new Date(membership.expiresAt) : null;
  const expiryStr = expiry
    ? expiry.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{
        maxWidth: "900px", margin: "0 auto 48px",
        background: "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.03) 100%)",
        border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px",
        padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px",
      }}
    >
      <div style={{
        width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0,
        background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "#22c55e", fontSize: "20px", lineHeight: 1 }}>✓</span>
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.25em", color: "#22c55e", marginBottom: "4px" }}>
          ACTIVE MEMBERSHIP
        </div>
        <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1.4rem", color: "#F5F0EB", lineHeight: 1, marginBottom: "4px" }}>
          {membership.serviceName}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 300, color: "rgba(245,240,235,0.45)" }}>
          {membership.isLifetime ? "Lifetime Access — Never Expires" : expiryStr ? `Valid until ${expiryStr}` : ""}
        </div>
      </div>
    </motion.div>
  );
}

function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

// ─── Shared buttons ───────────────────────────────────────────────────────────

function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -2 }}
      style={{
        width: "100%",
        padding: "18px",
        background: "#FF8200",
        color: "#080808",
        border: "none",
        fontFamily: "var(--font-display)",
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
        cursor: "pointer",
        borderRadius: "8px",
        filter: hov ? "brightness(1.1)" : "none",
        transition: "filter 0.2s",
      }}
    >
      {children}
    </motion.button>
  );
}

function OutlineBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -2 }}
      style={{
        width: "100%",
        padding: "18px",
        background: hov ? "rgba(255,130,0,0.08)" : "transparent",
        color: "#FF8200",
        border: "1px solid rgba(255,130,0,0.3)",
        fontFamily: "var(--font-display)",
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
        cursor: "pointer",
        borderRadius: "8px",
        transition: "background 0.2s",
      }}
    >
      {children}
    </motion.button>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ title, subtitle, subtitleOrange }: { title: string; subtitle?: string; subtitleOrange?: boolean }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "32px" }}>
      <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "2.4rem", color: "#F5F0EB", letterSpacing: "0.05em", marginBottom: subtitle ? "8px" : 0 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontFamily: subtitleOrange ? "var(--font-display)" : "var(--font-body)", fontSize: "0.8rem", fontWeight: subtitleOrange ? 600 : 300, color: subtitleOrange ? "#FF8200" : "rgba(245,240,235,0.4)", letterSpacing: subtitleOrange ? "0.15em" : "normal", textAlign: "center" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Pricing table ────────────────────────────────────────────────────────────

function PricingTable({ rows }: { rows: typeof ESSENTIAL_ROWS }) {
  return (
    <div>
      {/* Header — hidden on mobile */}
      <div className="mem-table-header" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", background: "rgba(255,130,0,0.1)", border: "1px solid rgba(255,130,0,0.2)", padding: "14px 24px", marginBottom: "2px", borderRadius: "8px 8px 0 0", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.18em", color: "#FF8200" }}>SUBSCRIPTION TYPE</span>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.18em", color: "#FF8200" }}>MEMBER</span>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 400, color: "rgba(255,130,0,0.6)", letterSpacing: "0.08em", marginTop: "3px" }}>existing member</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(245,240,235,0.6)" }}>NON-MEMBER</span>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 400, color: "rgba(245,240,235,0.35)", letterSpacing: "0.08em", marginTop: "3px" }}>new joinee</div>
        </div>
      </div>
      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={row.type}
          className="mem-table-row"
          style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", padding: "18px 24px", borderBottom: i < rows.length - 1 ? "1px solid rgba(255,130,0,0.07)" : "none", background: i % 2 === 0 ? "rgba(255,130,0,0.03)" : "rgba(255,255,255,0.01)", borderRadius: i === rows.length - 1 ? "0 0 8px 8px" : 0, alignItems: "center" }}
        >
          <div className="mem-col-type" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, color: "rgba(245,240,235,0.75)", letterSpacing: "0.04em" }}>{row.type}</span>
            {row.pt && (
              <span style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.12em", color: "#FF8200", background: "rgba(255,130,0,0.12)", border: "1px solid rgba(255,130,0,0.25)", padding: "3px 8px", borderRadius: "4px", whiteSpace: "nowrap" as const }}>
                INCLUDES PT
              </span>
            )}
          </div>
          {/* display:contents makes children behave as direct grid items on desktop */}
          <div className="mem-prices-group" style={{ display: "contents" }}>
            <span className="mem-col-member" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "#FF8200", textAlign: "center", letterSpacing: "0.02em" }}>
              {inr(row.member)}
            </span>
            <span className="mem-col-nonmember" style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, color: "rgba(245,240,235,0.4)", textAlign: "right", letterSpacing: "0.02em" }}>
              {row.nonMember != null ? inr(row.nonMember) : "—"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Yoga table ───────────────────────────────────────────────────────────────

function YogaTable({ rows }: { rows: typeof YOGA_ROWS }) {
  return (
    <div>
      <div className="mem-table-header" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", background: "rgba(255,130,0,0.1)", border: "1px solid rgba(255,130,0,0.2)", padding: "14px 24px", marginBottom: "2px", borderRadius: "8px 8px 0 0", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.18em", color: "#FF8200" }}>SUBSCRIPTION TYPE</span>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.18em", color: "#FF8200" }}>MEMBER</span>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 400, color: "rgba(255,130,0,0.6)", letterSpacing: "0.08em", marginTop: "3px" }}>existing member</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(245,240,235,0.6)" }}>NON-MEMBER</span>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 400, color: "rgba(245,240,235,0.35)", letterSpacing: "0.08em", marginTop: "3px" }}>new joinee</div>
        </div>
      </div>
      {rows.map((row, i) => (
        <div
          key={row.type}
          className="mem-table-row"
          style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", padding: "18px 24px", borderBottom: i < rows.length - 1 ? "1px solid rgba(255,130,0,0.07)" : "none", background: i % 2 === 0 ? "rgba(255,130,0,0.03)" : "rgba(255,255,255,0.01)", borderRadius: i === rows.length - 1 ? "0 0 8px 8px" : 0, alignItems: "center" }}
        >
          <span className="mem-col-type" style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, color: "rgba(245,240,235,0.75)", letterSpacing: "0.04em" }}>{row.type}</span>
          <div className="mem-prices-group" style={{ display: "contents" }}>
            <span className="mem-col-member" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "#FF8200", textAlign: "center", letterSpacing: "0.02em" }}>{inr(row.member)}</span>
            <span className="mem-col-nonmember" style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, color: "rgba(245,240,235,0.4)", textAlign: "right", letterSpacing: "0.02em" }}>{inr(row.nonMember)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Combo table ──────────────────────────────────────────────────────────────

function ComboTable({ rows }: { rows: typeof COMBO_ROWS }) {
  return (
    <div>
      <div className="mem-table-header" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", background: "rgba(255,130,0,0.1)", border: "1px solid rgba(255,130,0,0.2)", padding: "14px 24px", marginBottom: "2px", borderRadius: "8px 8px 0 0", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.18em", color: "#FF8200" }}>SUBSCRIPTION</span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.18em", color: "#FF8200", textAlign: "center" }}>PRICE</span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.18em", color: "#FF8200", textAlign: "right" }}>BENEFITS</span>
      </div>
      {rows.map((row, i) => (
        <div
          key={row.type}
          className="mem-combo-row"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", padding: "18px 24px", borderBottom: i < rows.length - 1 ? "1px solid rgba(255,130,0,0.07)" : "none", background: i % 2 === 0 ? "rgba(255,130,0,0.03)" : "rgba(255,255,255,0.01)", borderRadius: i === rows.length - 1 ? "0 0 8px 8px" : 0, alignItems: "center" }}
        >
          <span className="mem-col-type" style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, color: "rgba(245,240,235,0.75)", letterSpacing: "0.04em" }}>{row.type}</span>
          <span className="mem-combo-price" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "#F5F0EB", textAlign: "center", letterSpacing: "0.02em" }}>{inr(row.price)}</span>
          <span className="mem-combo-benefit" style={{ fontFamily: "var(--font-display)", fontSize: "0.88rem", fontWeight: 600, color: "#FF8200", textAlign: "right", letterSpacing: "0.02em" }}>{row.benefit}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Special plan card ────────────────────────────────────────────────────────

function SpecialCard({
  badge, badgeStyle, cardStyle, hoverShadow,
  title, subtitle, price, priceColor, priceGlow, priceLabel, desc, cta,
}: {
  badge: string;
  badgeStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
  hoverShadow: string;
  title: string;
  subtitle?: string;
  price: string;
  priceColor: string;
  priceGlow?: boolean;
  priceLabel: string;
  desc: string;
  cta: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ height: "100%", cursor: "default" }}
    >
      <HealthifyCard style={{ height: "100%", boxShadow: hov ? hoverShadow : "none", transition: "box-shadow 0.35s ease" }}>
        <div style={{ padding: "40px", display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", marginBottom: "20px", borderRadius: "6px", ...badgeStyle }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em" }}>{badge}</span>
          </div>
          <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1.8rem", color: "#F5F0EB", marginBottom: "4px" }}>{title}</div>
          {subtitle && (
            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(255,130,0,0.7)", marginBottom: "20px" }}>{subtitle}</div>
          )}
          <div style={{ fontFamily: "var(--font-bebas)", fontSize: "4.5rem", color: priceColor, lineHeight: 1, textShadow: priceGlow ? "0 0 30px rgba(255,130,0,0.3)" : "none" }}>{price}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(245,240,235,0.4)", marginBottom: "8px" }}>{priceLabel}</div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 300, color: "rgba(245,240,235,0.5)", flex: 1, marginBottom: "28px" }}>{desc}</p>
          <div>{cta}</div>
        </div>
      </HealthifyCard>
    </motion.div>
  );
}

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, stretch }: { children: React.ReactNode; delay?: number; stretch?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={stretch ? { height: "100%" } : undefined}
    >
      {children}
    </motion.div>
  );
}

// ─── Booking section constants ─────────────────────────────────────────────────

const BRANCHES = [
  { id: "portblair", label: "Sri Vijaya Puram" },
  { id: "bambooflat", label: "Bambooflat" },
] as const;
type BranchId = typeof BRANCHES[number]["id"];

const BRANCH_SLOTS: Record<BranchId, string[]> = {
  portblair: [
    "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
  ],
  bambooflat: [
    "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
  ],
};

// Yoga / Aerobics / Zumba has fixed class timings only
const YOGA_BRANCH_SLOTS: Record<BranchId, string[]> = {
  portblair:  ["5:30 PM"],
  bambooflat: ["7:00 AM"],
};
const HAPPY_HOURS = new Set(["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"]);
const GOALS = ["Weight Gain", "Muscle Building", "Flexibility", "General Fitness", "Weight Loss", "Strength Training", "Women Wellness"];
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function generateNext7Days() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      dayName: DAY_NAMES[d.getDay()],
      dayNum: d.getDate(),
      dateStr: d.toISOString().split("T")[0],
      fullLabel: d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }),
    };
  });
}

function iStyle(focused: boolean, hasError = false): React.CSSProperties {
  return {
    background: "#1A1A1A",
    border: `1px solid ${hasError ? "rgba(255,80,80,0.5)" : focused ? "#FF8200" : "rgba(255,130,0,0.15)"}`,
    color: "#F5F0EB",
    fontFamily: "var(--font-display)",
    fontSize: "13px",
    padding: "12px 16px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
    display: "block",
  };
}

// ─── Slot time helpers ────────────────────────────────────────────────────────

function parseSlotMinutes(slot: string): number {
  const [time, period] = slot.split(" ");
  const [h, m] = time.split(":").map(Number);
  let hours = h;
  if (period === "PM" && h !== 12) hours += 12;
  if (period === "AM" && h === 12) hours = 0;
  return hours * 60 + m;
}

function to24HourTime(slot: string): string {
  const totalMinutes = parseSlotMinutes(slot);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function isSlotPassed(slot: string, dateStr: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  if (dateStr !== today) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  // Block slots that start within the next 30 minutes or have already passed
  return parseSlotMinutes(slot) <= currentMinutes + 30;
}

function firstAvailableSlot(branch: BranchId, dateStr: string, slotMap: Record<BranchId, string[]> = BRANCH_SLOTS): string {
  const slots = slotMap[branch];
  return slots.find((s) => !isSlotPassed(s, dateStr)) ?? slots[slots.length - 1];
}

// ─── Booking Section ──────────────────────────────────────────────────────────

function BookingSection({ selectedPlan, selectedIncludesMembership, isMember, planSelected, onChangePlan }: {
  selectedPlan: string;
  selectedIncludesMembership: boolean;
  isMember: boolean;
  planSelected: boolean;
  onChangePlan: () => void;
}) {
  const isYogaPlan = selectedPlan.startsWith("Yoga");
  const activeSlots = isYogaPlan ? YOGA_BRANCH_SLOTS : BRANCH_SLOTS;

  const [days] = useState(() => generateNext7Days());
  const [selectedDay, setSelectedDay] = useState(days[0].dateStr);
  const [selectedBranch, setSelectedBranch] = useState<BranchId>("portblair");
  const [selectedTime, setSelectedTime] = useState(() => firstAvailableSlot("portblair", days[0].dateStr, isYogaPlan ? YOGA_BRANCH_SLOTS : BRANCH_SLOTS));

  // Booking form
  const [bName, setBName] = useState("");
  const [bEmail, setBEmail] = useState("");
  const [bPhone, setBPhone] = useState("");
  const [bWhatsapp, setBWhatsapp] = useState("");
  const [bGoal, setBGoal] = useState("Weight Gain");
  const [bErrors, setBErrors] = useState<Record<string, string>>({});
  const [bLoading, setBLoading] = useState(false);
  const [bSuccess, setBSuccess] = useState(false);
  const [bError, setBError] = useState("");

  // Visit form
  const [vName, setVName] = useState("");
  const [vPhone, setVPhone] = useState("");
  const [vDate, setVDate] = useState("");
  const [vErrors, setVErrors] = useState<Record<string, string>>({});
  const [vLoading, setVLoading] = useState(false);
  const [vSuccess, setVSuccess] = useState(false);
  const [vError, setVError] = useState("");

  const [focused, setFocused] = useState<string | null>(null);

  const selectedDayObj = days.find((d) => d.dateStr === selectedDay) ?? days[0];

  // Auto-select first available slot when day, branch, or plan type changes
  useEffect(() => {
    setSelectedTime(firstAvailableSlot(selectedBranch, selectedDay, activeSlots));
  }, [selectedDay, selectedBranch, isYogaPlan]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBook = async () => {
    const errs: Record<string, string> = {};
    if (!bName.trim()) errs.name = "Name is required";
    if (!bEmail.trim()) errs.email = "Email is required";
    if (!bPhone.trim()) errs.phone = "Phone is required";
    else if (!validatePhoneNumber(bPhone)) errs.phone = "Enter a valid 10-digit Indian mobile number";
    if (!bWhatsapp.trim()) errs.whatsapp = "WhatsApp number is required";
    else if (!validatePhoneNumber(bWhatsapp)) errs.whatsapp = "Enter a valid 10-digit Indian mobile number";
    setBErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setBLoading(true);
    setBError("");
    try {
      const res = await apiClient.post("/api/bookings/create", {
        serviceName: selectedPlan,
        bookingDate: selectedDay,
        bookingTime: to24HourTime(selectedTime),
        userName: bName,
        email: bEmail,
        phone: bPhone,
        whatsappNumber: bWhatsapp,
        goal: bGoal,
        isMember,
        includeMembership: selectedIncludesMembership,
      });
      const { razorpayOrder } = res.data;

      await openRazorpayCheckout({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        description: selectedPlan,
        prefill: { name: bName, email: bEmail, contact: bPhone },
        onSuccess: async (response) => {
          await apiClient.post("/api/payments/verify", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          setBSuccess(true);
        },
        onDismiss: () => setBError("Payment cancelled."),
      });
    } catch (err: unknown) {
      setBError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBLoading(false);
    }
  };

  const handleVisit = async () => {
    const errs: Record<string, string> = {};
    if (!vName.trim()) errs.name = "Name is required";
    if (!vPhone.trim()) errs.phone = "Phone is required";
    else if (!validatePhoneNumber(vPhone)) errs.phone = "Enter a valid 10-digit Indian mobile number";
    setVErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setVLoading(true);
    setVError("");
    try {
      const res = await apiClient.post("/api/appointments/create", {
        name: vName,
        phone: vPhone,
        preferredDate: vDate,
        message: `I would like to visit the gym${vDate ? ` on ${vDate}` : ""}`,
      });
      const { appointment } = res.data;
      if (appointment?.whatsappLink) window.open(appointment.whatsappLink, "_blank");
      setVSuccess(true);
    } catch (err: unknown) {
      setVError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setVLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "8px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "rgba(255,130,0,0.6)",
    marginBottom: "6px",
    display: "block",
  };

  const sectionTagStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "#FF8200",
    marginBottom: "12px",
  };

  return (
    <div
      id="booking-section"
      style={{
        marginTop: "60px",
        background: "transparent",
        position: "relative",
      }}
    >

      <div className="rsp-section" style={{ padding: "60px 80px 40px", position: "relative", zIndex: 1 }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>START YOUR JOURNEY</span>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#F5F0EB", textAlign: "center", lineHeight: 0.92, margin: 0 }}>
            HOW WOULD YOU<br />LIKE TO BEGIN?
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 300, color: "rgba(245,240,235,0.4)", textAlign: "center", marginTop: "16px" }}>
            Choose the path that feels right for you.
          </p>
        </motion.div>

        {/* Two-option grid */}
        <div className="rsp-grid-1" style={{ display: "grid", gridTemplateColumns: planSelected ? "1fr 1fr" : "1fr", gap: "2px", maxWidth: planSelected ? "1100px" : "600px", margin: "0 auto" }}>

          {/* ── Option A: Book Directly ── */}
          {planSelected && <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.05 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="rsp-book-card"
            style={{
              background: "#0F0F0F",
              border: "1px solid rgba(255,130,0,0.12)",
              padding: "48px",
              position: "relative",
            }}
          >
            {/* Top accent line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, #FF8200, transparent)" }} />

            {/* Badge */}
            <div style={{ display: "inline-block", background: "rgba(255,130,0,0.1)", border: "1px solid rgba(255,130,0,0.25)", color: "#FF8200", fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", padding: "5px 14px", marginBottom: "24px", }}>
              ⚡ BOOK DIRECTLY
            </div>

            <div style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem", color: "#F5F0EB", marginBottom: "6px" }}>BOOK A SESSION</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", marginBottom: "32px" }}>
              Select your plan, pick a slot and pay securely online.
            </p>

            {/* Selected plan display */}
            <div className="rsp-plan-bar" style={{ background: "rgba(255,130,0,0.06)", border: "1px solid rgba(255,130,0,0.2)", padding: "14px 20px", marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,130,0,0.6)", marginBottom: "4px" }}>SELECTED PLAN</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 600, color: "#F5F0EB" }}>
                  {selectedIncludesMembership ? `${selectedPlan} + Lifetime Membership` : selectedPlan}
                </div>
              </div>
              <button
                onClick={onChangePlan}
                style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 600, letterSpacing: "0.15em", color: "#FF8200", cursor: "pointer", background: "none", border: "none", padding: 0 }}
              >
                CHANGE PLAN
              </button>
            </div>

            {/* Day picker */}
            <div style={sectionTagStyle}>📅 PICK A DAY</div>
            <div className="rsp-day-picker" style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
              {days.map((day) => {
                const active = selectedDay === day.dateStr;
                return (
                  <button
                    key={day.dateStr}
                    onClick={() => setSelectedDay(day.dateStr)}
                    style={{ flex: 1, padding: "12px 4px", background: active ? "#FF8200" : "#1A1A1A", border: `1px solid ${active ? "#FF8200" : "rgba(255,130,0,0.1)"}`, textAlign: "center", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}
                  >
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.1em", color: active ? "rgba(8,8,8,0.7)" : "rgba(245,240,235,0.4)" }}>{day.dayName}</span>
                    <span style={{ fontFamily: "var(--font-bebas)", fontSize: "1.4rem", color: active ? "#080808" : "#F5F0EB", lineHeight: 1 }}>{day.dayNum}</span>
                  </button>
                );
              })}
            </div>

            {/* Time slots */}
            <div style={sectionTagStyle}>⏰ AVAILABLE TIME SLOTS</div>

            {/* Branch selector */}
            <div className="rsp-branch-tabs" style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              {BRANCHES.map((b) => {
                const active = selectedBranch === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => { setSelectedBranch(b.id); setSelectedTime(firstAvailableSlot(b.id, selectedDay, activeSlots)); }}
                    style={{ flex: 1, padding: "10px 16px", background: active ? "rgba(255,130,0,0.12)" : "#1A1A1A", border: `1px solid ${active ? "#FF8200" : "rgba(255,130,0,0.15)"}`, borderRadius: "4px", fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: active ? "#FF8200" : "rgba(245,240,235,0.5)", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    {b.label.toUpperCase()}
                  </button>
                );
              })}
            </div>

            {/* Happy hours callout — not applicable for yoga class timings */}
            {!isYogaPlan && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: "6px", padding: "10px 14px", marginBottom: "14px" }}>
                <span style={{ fontSize: "14px" }}>🎉</span>
                <div className="rsp-happy-hours-text" style={{ display: "flex", alignItems: "baseline", gap: "0" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "#4ADE80" }}>HAPPY HOURS · 9:00 AM – 3:00 PM</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "rgba(74,222,128,0.7)", marginLeft: "10px", letterSpacing: "0.06em" }}>Flat ₹500 off on all plans</span>
                </div>
              </div>
            )}

            <div className="rsp-timeslots" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "28px" }}>
              {activeSlots[selectedBranch].map((slot) => {
                const passed = isSlotPassed(slot, selectedDay);
                const active = selectedTime === slot && !passed;
                const happy = HAPPY_HOURS.has(slot) && !passed;
                const borderColor = passed ? "rgba(255,255,255,0.05)" : active ? (happy ? "#4ADE80" : "#FF8200") : happy ? "rgba(74,222,128,0.45)" : "rgba(255,130,0,0.15)";
                const bgColor = passed ? "rgba(255,255,255,0.02)" : active ? (happy ? "rgba(74,222,128,0.15)" : "rgba(255,130,0,0.12)") : happy ? "rgba(74,222,128,0.07)" : "#1A1A1A";
                const textColor = passed ? "rgba(245,240,235,0.18)" : active ? (happy ? "#4ADE80" : "#FF8200") : happy ? "#4ADE80" : "rgba(245,240,235,0.85)";
                return (
                  <button
                    key={slot}
                    disabled={passed}
                    onClick={() => !passed && setSelectedTime(slot)}
                    style={{ padding: "12px 8px", background: bgColor, border: `1px solid ${borderColor}`, borderRadius: "4px", fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", color: textColor, cursor: passed ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "4px", width: "100%", position: "relative" as const, opacity: passed ? 0.45 : 1 }}
                  >
                    {slot}
                    {passed && <span style={{ fontSize: "8px", letterSpacing: "0.1em", color: "rgba(245,240,235,0.25)", lineHeight: 1 }}>PASSED</span>}
                    {happy && !passed && (
                      <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", color: active ? "#4ADE80" : "rgba(74,222,128,0.85)", lineHeight: 1 }}>₹500 OFF</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Booking form */}
            <div className="rsp-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>FULL NAME</label>
                <input
                  type="text"
                  value={bName}
                  placeholder="Your full name"
                  onChange={(e) => { setBName(e.target.value); setBErrors((p) => ({ ...p, name: "" })); }}
                  onFocus={() => setFocused("bName")}
                  onBlur={() => setFocused(null)}
                  style={iStyle(focused === "bName", !!bErrors.name)}
                />
                {bErrors.name && <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "rgba(255,80,80,0.8)", marginTop: "4px", display: "block" }}>{bErrors.name}</span>}
              </div>
              <div>
                <label style={labelStyle}>EMAIL</label>
                <input
                  type="email"
                  value={bEmail}
                  placeholder="your@email.com"
                  onChange={(e) => { setBEmail(e.target.value); setBErrors((p) => ({ ...p, email: "" })); }}
                  onFocus={() => setFocused("bEmail")}
                  onBlur={() => setFocused(null)}
                  style={iStyle(focused === "bEmail", !!bErrors.email)}
                />
                {bErrors.email && <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "rgba(255,80,80,0.8)", marginTop: "4px", display: "block" }}>{bErrors.email}</span>}
              </div>
              <div>
                <label style={labelStyle}>PHONE NUMBER</label>
                <input
                  type="tel"
                  value={bPhone}
                  placeholder="+91 98765 43210"
                  onChange={(e) => { setBPhone(e.target.value); setBErrors((p) => ({ ...p, phone: "" })); }}
                  onFocus={() => setFocused("bPhone")}
                  onBlur={() => setFocused(null)}
                  style={iStyle(focused === "bPhone", !!bErrors.phone)}
                />
                {bErrors.phone && <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "rgba(255,80,80,0.8)", marginTop: "4px", display: "block" }}>{bErrors.phone}</span>}
              </div>
              <div>
                <label style={labelStyle}>WHATSAPP NUMBER</label>
                <input
                  type="tel"
                  value={bWhatsapp}
                  placeholder="+91 98765 43210"
                  onChange={(e) => { setBWhatsapp(e.target.value); setBErrors((p) => ({ ...p, whatsapp: "" })); }}
                  onFocus={() => setFocused("bWhatsapp")}
                  onBlur={() => setFocused(null)}
                  style={iStyle(focused === "bWhatsapp", !!bErrors.whatsapp)}
                />
                {bErrors.whatsapp && <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "rgba(255,80,80,0.8)", marginTop: "4px", display: "block" }}>{bErrors.whatsapp}</span>}
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>YOUR GOAL</label>
                <select
                  value={bGoal}
                  onChange={(e) => setBGoal(e.target.value)}
                  onFocus={() => setFocused("bGoal")}
                  onBlur={() => setFocused(null)}
                  style={iStyle(focused === "bGoal")}
                >
                  {GOALS.map((g) => <option key={g} value={g} style={{ background: "#1A1A1A" }}>{g}</option>)}
                </select>
              </div>
            </div>

            {/* Summary */}
            <div style={{ background: "rgba(255,130,0,0.04)", border: "1px solid rgba(255,130,0,0.1)", padding: "14px 18px", marginBottom: "20px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 600, color: "rgba(245,240,235,0.5)" }}>
                Selected: {selectedDayObj.fullLabel} at {selectedTime}
              </span>
            </div>

            {/* Book button / success */}
            {bSuccess ? (
              <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", padding: "18px", textAlign: "center", fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 600, color: "#22c55e" }}>
                🎉 Booking Confirmed! Check your WhatsApp for confirmation details.
              </div>
            ) : (
              <>
                <button
                  onClick={handleBook}
                  disabled={bLoading}
                  onMouseEnter={(e) => { if (!bLoading) { Object.assign((e.currentTarget as HTMLElement).style, { filter: "brightness(1.1)", transform: "translateY(-2px)", boxShadow: "0 8px 32px rgba(255,130,0,0.3)" }); } }}
                  onMouseLeave={(e) => { Object.assign((e.currentTarget as HTMLElement).style, { filter: "none", transform: "none", boxShadow: "none" }); }}
                  style={{ background: bLoading ? "rgba(255,130,0,0.6)" : "#FF8200", color: "#080808", fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", padding: "18px", width: "100%", border: "none", cursor: bLoading ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {bLoading ? (
                    <>
                      <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                      </motion.svg>
                      PROCESSING...
                    </>
                  ) : "BOOK & PAY SECURELY →"}
                </button>
                {bError && <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: "rgba(255,80,80,0.8)", marginTop: "10px", textAlign: "center" }}>{bError}</p>}
              </>
            )}
          </motion.div>}

          {/* ── Option B: Visit Gym ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.05 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="rsp-visit-card"
            style={{ background: "#0A0A0A", border: "1px solid rgba(255,130,0,0.08)", padding: "48px", position: "relative", display: "flex", flexDirection: "column", }}
          >
            {/* Badge */}
            <div style={{ display: "inline-block", background: "rgba(245,240,235,0.04)", border: "1px solid rgba(245,240,235,0.1)", color: "rgba(245,240,235,0.5)", fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", padding: "5px 14px", marginBottom: "24px", }}>
              🏋️ VISIT US FIRST
            </div>

            <div style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem", color: "#F5F0EB", marginBottom: "6px" }}>MEET US IN PERSON</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", marginBottom: "32px" }}>
              Not sure yet? Come visit the gym, meet our trainers and see the space before you decide.
            </p>

            {/* Feature points */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" }}>
              {[
                "Tour the facility and see all equipment before committing",
                "Meet your trainer and discuss your personal fitness goals",
                "Get all your questions answered face to face — no pressure",
              ].map((pt) => (
                <div key={pt} style={{ display: "flex", gap: "12px" }}>
                  <span style={{ color: "#FF8200", fontSize: "14px", marginTop: "2px", flexShrink: 0 }}>✓</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 300, color: "rgba(245,240,235,0.6)", lineHeight: 1.5 }}>{pt}</span>
                </div>
              ))}
            </div>

            {/* Address boxes */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              {[
                { name: "Healthify — Delanipur", address: "Opposite Petrol Pump, Delanipur", hours: "Mon–Sat: 5:00 AM – 8:00 PM" },
                { name: "Healthify — Bambooflat", address: "Opp. GSSS Bambooflat School, Valluvar Nagar", hours: "Mon–Sat: 6:00 AM – 7:00 PM" },
              ].map((loc) => (
                <div key={loc.name} style={{ background: "rgba(255,130,0,0.04)", border: "1px solid rgba(255,130,0,0.1)", padding: "16px 20px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.2em", color: "#FF8200", marginBottom: "6px" }}>📍 OUR LOCATION</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.88rem", fontWeight: 600, color: "#F5F0EB" }}>{loc.name}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", marginTop: "2px" }}>{loc.address}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 300, color: "rgba(245,240,235,0.4)", marginTop: "2px" }}>Sri Vijaya Puram, Andaman &amp; Nicobar Islands</div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "8px" }}>
                    <span style={{ fontSize: "11px" }}>⏰</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 300, color: "rgba(245,240,235,0.4)" }}>{loc.hours}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visit form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>YOUR NAME</label>
                <input
                  type="text"
                  value={vName}
                  placeholder="Your full name"
                  onChange={(e) => { setVName(e.target.value); setVErrors((p) => ({ ...p, name: "" })); }}
                  onFocus={() => setFocused("vName")}
                  onBlur={() => setFocused(null)}
                  style={iStyle(focused === "vName", !!vErrors.name)}
                />
                {vErrors.name && <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "rgba(255,80,80,0.8)", marginTop: "4px", display: "block" }}>{vErrors.name}</span>}
              </div>
              <div>
                <label style={labelStyle}>PHONE NUMBER</label>
                <input
                  type="tel"
                  value={vPhone}
                  placeholder="+91 98765 43210"
                  onChange={(e) => { setVPhone(e.target.value); setVErrors((p) => ({ ...p, phone: "" })); }}
                  onFocus={() => setFocused("vPhone")}
                  onBlur={() => setFocused(null)}
                  style={iStyle(focused === "vPhone", !!vErrors.phone)}
                />
                {vErrors.phone && <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "rgba(255,80,80,0.8)", marginTop: "4px", display: "block" }}>{vErrors.phone}</span>}
              </div>
              <div>
                <label style={labelStyle}>PREFERRED VISIT DATE</label>
                <input
                  type="date"
                  value={vDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setVDate(e.target.value)}
                  onFocus={() => setFocused("vDate")}
                  onBlur={() => setFocused(null)}
                  style={{ ...iStyle(focused === "vDate"), colorScheme: "dark" }}
                />
              </div>
            </div>

            {/* Visit button / success */}
            {vSuccess ? (
              <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", padding: "18px", textAlign: "center", fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 600, color: "#22c55e" }}>
                ✅ Request sent! The owner will contact you on WhatsApp shortly.
              </div>
            ) : (
              <>
                <button
                  onClick={handleVisit}
                  disabled={vLoading}
                  onMouseEnter={(e) => { if (!vLoading) { Object.assign((e.currentTarget as HTMLElement).style, { background: "rgba(255,130,0,0.08)", borderColor: "#FF8200" }); } }}
                  onMouseLeave={(e) => { Object.assign((e.currentTarget as HTMLElement).style, { background: "transparent", borderColor: "rgba(255,130,0,0.3)" }); }}
                  style={{ background: "transparent", border: `1px solid ${vLoading ? "rgba(255,130,0,0.15)" : "rgba(255,130,0,0.3)"}`, color: vLoading ? "rgba(255,130,0,0.4)" : "#FF8200", fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", padding: "18px", width: "100%", cursor: vLoading ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {vLoading ? (
                    <>
                      <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                      </motion.svg>
                      SENDING...
                    </>
                  ) : "SCHEDULE A VISIT →"}
                </button>
                {vError && <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: "rgba(255,80,80,0.8)", marginTop: "10px", textAlign: "center" }}>{vError}</p>}
              </>
            )}

            {/* WhatsApp note */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px" }}>
              <svg width="14" height="14" fill="#22c55e" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 400, color: "rgba(245,240,235,0.3)" }}>
                You&apos;ll be connected with the owner directly on WhatsApp
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MembershipsClient() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("Essential (Strength) — Monthly");
  const [selectedIncludesMembership, setSelectedIncludesMembership] = useState(false);
  const [planSelected, setPlanSelected] = useState(false);
  const [modalPlan, setModalPlan] = useState<string | null>(null);
  const [activeMembership, setActiveMembership] = useState<ActiveMembership | null>(null);
  const [hasLifetime, setHasLifetime] = useState(false);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("healthify_token");
    if (!token) return;
    fetch("/api/memberships/active", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then((data: { activeMembership: ActiveMembership | null; hasLifetime: boolean }) => {
        setActiveMembership(data.activeMembership ?? null);
        setHasLifetime(data.hasLifetime ?? false);
      })
      .catch(() => { /* silently fail — show all plans */ });
  }, [user]);

  const activeCat = activeMembership ? getPlanCategory(activeMembership.serviceName) : null;
  const hasActiveClassPlan = activeCat === "essential" || activeCat === "yoga" || activeCat === "combo";
  const showDropIn    = !hasActiveClassPlan;
  const showClassPlans = !hasActiveClassPlan;

  const selectPlan = (planName: string, includeMembership: boolean) => {
    setSelectedPlan(planName);
    setSelectedIncludesMembership(includeMembership);
    setPlanSelected(true);
    setTimeout(() => {
      document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const scrollToPricing = () => {
    document.getElementById("pricing-plans")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="rsp-memberships-root" style={{ background: "#080808", minHeight: "100vh", padding: "80px 80px 0", position: "relative", overflow: "hidden" }}>
      <MembershipsBackground />
      {/* Orb */}
      <div style={{ position: "absolute", top: "-200px", left: "50%", transform: "translateX(-50%)", width: "900px", height: "900px", background: "radial-gradient(circle, rgba(255,130,0,0.07) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,130,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,130,0,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />
      {/* Hex pattern */}
      <HexBackground />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="rsp-memberships-hero"
          style={{ textAlign: "center", marginBottom: "100px", paddingTop: "200px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>MEMBERSHIP PLANS</span>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3.5rem, 7vw, 7rem)", lineHeight: 0.92, textAlign: "center" }}>
            <span className="sr-only">Healthify women&apos;s gym membership plans in Sri Vijaya Puram (Port Blair) — </span>
            <span style={{ color: "#F5F0EB" }}>CHOOSE YOUR </span>
            <span style={{ color: "#FF8200", textShadow: "0 0 40px rgba(255,130,0,0.3)" }}>MEMBERSHIP</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", textAlign: "center", marginTop: "16px" }}>
            Transparent pricing with no joining fee, no hidden charges.<br />Find the plan that fits your goals.
          </p>
        </motion.div>

        {/* ── Active member banner ── */}
        {activeMembership && <ActiveMemberBanner membership={activeMembership} />}

        {/* ── Upgrade offline notice ── */}
        {hasActiveClassPlan && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            style={{
              maxWidth: "900px", margin: "0 auto 48px",
              background: "rgba(255,130,0,0.04)",
              border: "1px solid rgba(255,130,0,0.2)", borderRadius: "12px",
              padding: "28px 32px", textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1.6rem", color: "#F5F0EB", marginBottom: "10px", letterSpacing: "0.04em" }}>
              WANT TO CHANGE OR UPGRADE?
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 300, color: "rgba(245,240,235,0.5)", lineHeight: 1.7, marginBottom: "20px", maxWidth: "520px", margin: "0 auto 20px" }}>
              Plan upgrades and changes are handled in person at the gym. Visit us and our team will sort it out for you right away.
            </p>
            <a
              href="/contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700,
                letterSpacing: "0.18em", color: "#FF8200", textDecoration: "none",
                background: "rgba(255,130,0,0.08)", border: "1px solid rgba(255,130,0,0.25)",
                padding: "12px 24px", borderRadius: "6px",
              }}
            >
              GET OUR ADDRESS →
            </a>
          </motion.div>
        )}

        {/* ── Special Plans ── */}
        {showDropIn && (
          <div id="pricing-plans" style={{ maxWidth: "480px", margin: "0 auto 48px" }}>
            <FadeIn delay={0} stretch>
              <SpecialCard
                badge="⚡ DAILY PASS"
                badgeStyle={{ background: "rgba(245,240,235,0.05)", border: "1px solid rgba(245,240,235,0.1)", color: "rgba(245,240,235,0.5)" }}
                cardStyle={{ background: "#0F0F0F", border: "1px solid rgba(255,130,0,0.1)" }}
                hoverShadow="0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,130,0,0.2)"
                title="DROP-IN PASS"
                subtitle="1 HOUR ACCESS"
                price={hasLifetime ? "₹200" : "₹250"}
                priceColor="#F5F0EB"
                priceLabel={hasLifetime ? "MEMBER PRICE · PER VISIT" : "PER VISIT · MEMBERS GET ₹200"}
                desc={hasLifetime ? "Full gym access for a single session at your exclusive member rate. No subscription required." : "Full gym access for a single session. No subscription required. Lifetime members enjoy ₹200 per visit."}
                cta={<OutlineBtn onClick={() => selectPlan("Drop-In Pass (Daily)", false)}>BOOK DAY PASS →</OutlineBtn>}
              />
            </FadeIn>
          </div>
        )}
        {!showDropIn && <div id="pricing-plans" />}

        {/* ── Essential ── */}
        {showClassPlans && (
          <FadeIn delay={0.1}>
            <SectionLabel title="ESSENTIAL (STRENGTH)" />
            <div style={{ maxWidth: "740px", margin: "0 auto 20px" }}>
              <HealthifyCard>
                <div className="rsp-pricing-wrap" style={{ padding: "36px" }}>
                  <PricingTable rows={ESSENTIAL_ROWS} />
                </div>
              </HealthifyCard>
            </div>
            <div style={{ maxWidth: "740px", margin: "0 auto 48px" }}>
              <PrimaryBtn onClick={() => setModalPlan("essential")}>CHOOSE ESSENTIAL →</PrimaryBtn>
            </div>
          </FadeIn>
        )}

        {/* ── Yoga/Zumba ── */}
        {showClassPlans && (
          <FadeIn delay={0.15}>
            <SectionLabel title="YOGA OR AEROBICS/ZUMBA" subtitle="Including Zumba" />
            <div style={{ maxWidth: "740px", margin: "0 auto 20px" }}>
              <HealthifyCard>
                <div className="rsp-pricing-wrap" style={{ padding: "36px" }}>
                  <YogaTable rows={YOGA_ROWS} />
                </div>
              </HealthifyCard>
            </div>
            <div style={{ maxWidth: "740px", margin: "0 auto 48px" }}>
              <PrimaryBtn onClick={() => setModalPlan("yoga")}>CHOOSE YOGA/ZUMBA →</PrimaryBtn>
            </div>
          </FadeIn>
        )}

        {/* ── Combo ── */}
        {showClassPlans && (
          <FadeIn delay={0.2}>
            <SectionLabel title="STRENGTH + ZUMBA / AEROBICS" subtitle="For Members Only · Combo Offer" subtitleOrange />
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <span style={{ display: "inline-block", fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "#FF8200", background: "rgba(255,130,0,0.1)", border: "1px solid rgba(255,130,0,0.25)", padding: "6px 16px", borderRadius: "6px" }}>
                FOR MEMBERS ONLY
              </span>
            </div>
            <div style={{ maxWidth: "900px", margin: "0 auto 20px" }}>
              <HealthifyCard>
                <div className="rsp-pricing-wrap" style={{ padding: "36px" }}>
                  <ComboTable rows={COMBO_ROWS} />
                </div>
              </HealthifyCard>
            </div>
            <div style={{ maxWidth: "900px", margin: "0 auto 48px" }}>
              <PrimaryBtn onClick={() => setModalPlan("combo")}>CHOOSE COMBO →</PrimaryBtn>
            </div>
          </FadeIn>
        )}

        {/* ── Trust badges ── */}
        <FadeIn delay={0.1}>
          <div style={{ borderTop: "1px solid rgba(255,130,0,0.1)", paddingTop: "32px", marginTop: "40px", display: "flex", justifyContent: "center", alignItems: "center", gap: "48px", flexWrap: "wrap" as const }}>
            {["No Joining Fee", "Women Only", "Secure Payments"].map((badge) => (
              <div key={badge} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#FF8200", fontSize: "14px" }}>✓</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.12em", color: "rgba(245,240,235,0.6)" }}>{badge}</span>
              </div>
            ))}
          </div>
        </FadeIn>

      </div>

      {/* ── Booking Section ── */}
      {!hasActiveClassPlan && (
        <BookingSection
          selectedPlan={selectedPlan}
          selectedIncludesMembership={selectedIncludesMembership}
          isMember={hasLifetime}
          planSelected={planSelected}
          onChangePlan={scrollToPricing}
        />
      )}
      <AnimatePresence>
        {modalPlan && (
          <DurationModal
            planKey={modalPlan}
            hasLifetime={hasLifetime}
            onConfirm={selectPlan}
            onClose={() => setModalPlan(null)}
          />
        )}
      </AnimatePresence>

      {/* Bottom padding */}
      <div style={{ height: "40px" }} />
    </div>
  );
}
