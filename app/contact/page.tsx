"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api-client";
import { BRANCHES } from "@/lib/constants";

// ─── Hex grid background ──────────────────────────────────────────────────────

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
        <pattern id="contact-hex" width="83" height="144" patternUnits="userSpaceOnUse">
          <path
            d="M42,0 L83,24 L83,72 L42,96 L0,72 L0,24 Z M42,96 L42,144"
            fill="none"
            stroke="rgba(255,130,0,0.15)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#contact-hex)" />
    </svg>
  );
}

// ─── Particles canvas ─────────────────────────────────────────────────────────

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.5 + 0.15,
      opacity: Math.random() * 0.35 + 0.08,
      drift: (Math.random() - 0.5) * 0.4,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        g.addColorStop(0, `rgba(255,130,0,${p.opacity})`);
        g.addColorStop(1, "rgba(255,130,0,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ─── Input style helper ───────────────────────────────────────────────────────

function inputStyle(focused: boolean, hasError = false): React.CSSProperties {
  return {
    background: "#1A1A1A",
    border: `1px solid ${hasError ? "rgba(255,80,80,0.5)" : focused ? "#FF8200" : "rgba(255,130,0,0.15)"}`,
    color: "#F5F0EB",
    fontFamily: "var(--font-display)",
    fontSize: "17px",
    padding: "14px 18px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    display: "block",
  };
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.18em",
  color: "rgba(255,130,0,0.6)",
  marginBottom: "6px",
  display: "block",
};

// ─── Contact form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!whatsapp.trim()) e.whatsapp = "WhatsApp number is required";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const lines = [
      `Hi! I'm ${name.trim()}.`,
      whatsapp.trim() ? `My WhatsApp: ${whatsapp.trim()}` : "",
      email.trim() ? `Email: ${email.trim()}` : "",
      branch ? `Preferred Branch: ${branch}` : "",
      message.trim() ? `\nMessage: ${message.trim()}` : "",
    ].filter(Boolean).join("\n");

    const url = `https://wa.me/917063164720?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank");
    setSuccess(true);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: "center", padding: "60px 40px" }}
      >
        <div style={{ fontFamily: "var(--font-bebas)", fontSize: "4rem", color: "#FF8200", marginBottom: "16px" }}>✓</div>
        <div style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem", color: "#F5F0EB", marginBottom: "12px" }}>MESSAGE SENT!</div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 300, color: "rgba(245,240,235,0.5)" }}>
          We&apos;ll reach out to you on WhatsApp shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, #FF8200, transparent)" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-bebas)", fontSize: "2.2rem", color: "#F5F0EB", letterSpacing: "0.05em" }}>
          SEND A MESSAGE
        </div>
        <div style={{ display: "inline-block", background: "rgba(255,130,0,0.1)", border: "1px solid rgba(255,130,0,0.25)", color: "#FF8200", fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", padding: "5px 14px", }}>
          FREE ENQUIRY
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="rsp-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={labelStyle}>FULL NAME *</label>
            <input
              type="text"
              value={name}
              placeholder="Priya Sharma"
              onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              style={inputStyle(focused === "name", !!errors.name)}
            />
            {errors.name && <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "rgba(255,80,80,0.8)", marginTop: "4px", display: "block" }}>{errors.name}</span>}
          </div>
          <div>
            <label style={labelStyle}>WHATSAPP NUMBER *</label>
            <input
              type="tel"
              value={whatsapp}
              placeholder="+91 70631 64720"
              onChange={(e) => { setWhatsapp(e.target.value); setErrors(p => ({ ...p, whatsapp: "" })); }}
              onFocus={() => setFocused("whatsapp")}
              onBlur={() => setFocused(null)}
              style={inputStyle(focused === "whatsapp", !!errors.whatsapp)}
            />
            {errors.whatsapp && <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: "rgba(255,80,80,0.8)", marginTop: "4px", display: "block" }}>{errors.whatsapp}</span>}
          </div>
        </div>

        <div>
          <label style={labelStyle}>EMAIL (OPTIONAL)</label>
          <input
            type="email"
            value={email}
            placeholder="priya@email.com"
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            style={inputStyle(focused === "email")}
          />
        </div>

        <div>
          <label style={labelStyle}>PREFERRED BRANCH</label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            onFocus={() => setFocused("branch")}
            onBlur={() => setFocused(null)}
            style={{ ...inputStyle(focused === "branch"), appearance: "none" as const }}
          >
            <option value="" style={{ background: "#1A1A1A" }}>— Select a branch —</option>
            {BRANCHES.map((b) => (
              <option key={b.id} value={b.name} style={{ background: "#1A1A1A" }}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>MESSAGE</label>
          <textarea
            value={message}
            placeholder="Tell us what you're looking for…"
            rows={4}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setFocused("message")}
            onBlur={() => setFocused(null)}
            style={{ ...inputStyle(focused === "message"), resize: "none", lineHeight: 1.6 }}
          />
        </div>

        {submitError && (
          <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: "rgba(255,80,80,0.8)", textAlign: "center" }}>
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          onMouseEnter={(e) => { if (!loading) Object.assign((e.currentTarget as HTMLElement).style, { filter: "brightness(1.1)", transform: "translateY(-2px)", boxShadow: "0 8px 32px rgba(255,130,0,0.3)" }); }}
          onMouseLeave={(e) => { Object.assign((e.currentTarget as HTMLElement).style, { filter: "none", transform: "none", boxShadow: "none" }); }}
          style={{
            background: loading ? "rgba(255,130,0,0.6)" : "#FF8200",
            color: "#080808",
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            padding: "18px",
            width: "100%",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            marginTop: "4px",
          }}
        >
          {loading ? "SENDING…" : "SEND ENQUIRY →"}
        </button>
      </div>
    </form>
  );
}

// ─── Info card ────────────────────────────────────────────────────────────────

function InfoCard({ icon, label, lines }: { icon: React.ReactNode; label: string; lines: string[] }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        background: hov ? "#141414" : "#0F0F0F",
        borderTop: hov ? "1px solid rgba(255,130,0,0.3)" : "1px solid rgba(255,130,0,0.1)",
        borderRight: hov ? "1px solid rgba(255,130,0,0.3)" : "1px solid rgba(255,130,0,0.1)",
        borderBottom: hov ? "1px solid rgba(255,130,0,0.3)" : "1px solid rgba(255,130,0,0.1)",
        borderLeft: "3px solid #FF8200",
        borderRadius: "8px",
        padding: "20px 24px",
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
        transition: "all 0.3s ease",
        boxShadow: hov ? "0 0 20px rgba(255,130,0,0.06)" : "none",
      }}
    >
      <div style={{
        width: "40px",
        height: "40px",
        background: hov ? "rgba(255,130,0,0.15)" : "rgba(255,130,0,0.08)",
        border: "1px solid rgba(255,130,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "background 0.3s",
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,130,0,0.6)", marginBottom: "6px" }}>
          {label}
        </div>
        {lines.map((line, i) => (
          <div key={i} style={{ fontFamily: "var(--font-display)", fontSize: i === 0 ? "1.2rem" : "1.05rem", fontWeight: i === 0 ? 600 : 300, color: i === 0 ? "#F5F0EB" : "rgba(245,240,235,0.5)", lineHeight: 1.6 }}>
            {line}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

const IconPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8200" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.47 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconWhatsApp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF8200">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);
const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [activeMapIdx, setActiveMapIdx] = useState(0);
  const activeBranch = BRANCHES[activeMapIdx];

  return (
    <div style={{ background: "#080808", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes map-pin-pulse {
          0%   { width: 18px; height: 18px; opacity: 0.75; }
          100% { width: 100px; height: 100px; opacity: 0; }
        }
        .map-pin-ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 130, 0, 0.65);
          transform: translate(-50%, -50%);
          animation: map-pin-pulse 2.2s ease-out infinite;
          pointer-events: none;
        }
      `}</style>
      <ParticleCanvas />
      <HexBackground />

      {/* Top-center orb */}
      <div style={{ position: "absolute", top: "-200px", left: "50%", transform: "translateX(-50%)", width: "900px", height: "900px", background: "radial-gradient(circle, rgba(255,130,0,0.07) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="rsp-contact-header" style={{ textAlign: "center", padding: "200px 80px 120px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>GET IN TOUCH</span>
            <div style={{ width: "40px", height: "1px", background: "#FF8200", opacity: 0.4 }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(3.5rem, 7vw, 7rem)", lineHeight: 0.92, marginBottom: "20px" }}>
            <span style={{ color: "#F5F0EB" }}>CONTACT </span>
            <span style={{ color: "#FF8200", textShadow: "0 0 40px rgba(255,130,0,0.3)" }}>US</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", maxWidth: "500px", margin: "0 auto" }}>
            Questions, tours, or partnerships — we&apos;re listening. Walk in any time. Open every day.
          </p>
        </motion.div>

        {/* ── Main two-column ── */}
        <section className="rsp-section" style={{ padding: "60px 80px" }}>
          <div className="rsp-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", maxWidth: "1200px", margin: "0 auto" }}>

            {/* ── LEFT: Contact info ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1.8rem", color: "#F5F0EB", letterSpacing: "0.05em", marginBottom: "24px" }}>
                REACH US
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
                <InfoCard
                  icon={<IconClock />}
                  label="HOURS"
                  lines={["Every day", "5:00 AM — 8:00 PM"]}
                />
                <InfoCard
                  icon={<IconPhone />}
                  label="CALL / WHATSAPP"
                  lines={["+91 70631 64720"]}
                />
                <InfoCard
                  icon={<IconWhatsApp />}
                  label="WHATSAPP US NOW"
                  lines={["Tap to open a chat directly", "Fastest way to reach us"]}
                />
              </div>

              {/* ── Branches ── */}
              <div style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,130,0,0.6)", marginBottom: "14px" }}>
                OUR BRANCHES
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "40px" }}>
                {BRANCHES.map((branch, i) => (
                  <motion.div
                    key={branch.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                    style={{
                      background: "#0F0F0F",
                      border: "1px solid rgba(255,130,0,0.12)",
                      borderLeft: "3px solid rgba(255,130,0,0.6)",
                      borderRadius: "8px",
                      padding: "18px 20px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <IconPin />
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "4px" }}>
                          {branch.name}
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 300, color: "rgba(245,240,235,0.5)", lineHeight: 1.6 }}>
                          {branch.address}
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 300, color: "rgba(245,240,235,0.35)" }}>
                          {branch.city}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── Social links ── */}
              <div style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,130,0,0.6)", marginBottom: "14px" }}>
                FOLLOW US
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  { label: "Instagram", icon: <IconInstagram /> },
                  { label: "Facebook", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                ].map(({ label, icon }) => (
                  <motion.button
                    key={label}
                    whileHover={{ y: -3 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(255,130,0,0.06)",
                      border: "1px solid rgba(255,130,0,0.2)",
                      color: "rgba(245,240,235,0.6)",
                      fontFamily: "var(--font-display)",
                      fontSize: "15px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      padding: "10px 18px",
                      cursor: "pointer",
                      borderRadius: "6px",
                      transition: "all 0.2s",
                    }}
                  >
                    {icon}
                    {label.toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* ── RIGHT: Form ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="rsp-contact-form-card"
              style={{
                background: "#0F0F0F",
                border: "1px solid rgba(255,130,0,0.12)",
                borderRadius: "12px",
                padding: "48px",
                position: "relative",
              }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </section>

        {/* ── Map section ── */}
        <section className="rsp-section rsp-map-section" style={{ padding: "0 80px 80px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

            {/* Divider */}
            <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(255,130,0,0.2), transparent)", marginBottom: "48px" }} />

            {/* Header + tabs */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <div style={{ width: "32px", height: "1px", background: "#FF8200", opacity: 0.5 }} />
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>FIND US</span>
                </div>
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem", color: "#F5F0EB", letterSpacing: "0.05em" }}>
                  OUR LOCATIONS
                </div>
              </div>

              {/* Branch tab switcher */}
              <div className="rsp-branch-tabs" style={{ display: "flex", gap: "2px" }}>
                {BRANCHES.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveMapIdx(i)}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      padding: "10px 20px",
                      border: "1px solid rgba(255,130,0,0.2)",
                      background: activeMapIdx === i ? "#FF8200" : "rgba(255,130,0,0.06)",
                      color: activeMapIdx === i ? "#080808" : "rgba(245,240,235,0.6)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      borderRadius: i === 0 ? "6px 0 0 6px" : "0 6px 6px 0",
                    }}
                  >
                    {b.name.split("—")[1]?.trim() ?? b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active branch info bar */}
            <div className="rsp-map-bar" style={{ background: "#0F0F0F", border: "1px solid rgba(255,130,0,0.35)", borderBottom: "none", borderRadius: "8px 8px 0 0", padding: "16px 24px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", boxShadow: "0 0 24px rgba(255,130,0,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <IconPin />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 300, color: "rgba(245,240,235,0.6)" }}>
                  {activeBranch.address}, {activeBranch.city}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <IconClock />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 300, color: "rgba(245,240,235,0.6)" }}>
                  Every day · {activeBranch.hours.weekdays}
                </span>
              </div>
              <a
                href={`https://maps.google.com/maps?q=${encodeURIComponent(activeBranch.address + ", " + activeBranch.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "auto", fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", color: "#FF8200", textDecoration: "none", background: "rgba(255,130,0,0.08)", border: "1px solid rgba(255,130,0,0.2)", padding: "8px 16px", borderRadius: "4px" }}
              >
                OPEN IN MAPS →
              </a>
            </div>

            {/* Map iframe */}
            <motion.div
              key={activeMapIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{ position: "relative", border: "1px solid rgba(255,130,0,0.35)", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden", boxShadow: "0 0 32px rgba(255,130,0,0.18), 0 0 80px rgba(255,130,0,0.08)" }}
            >
              <iframe
                className="rsp-map-iframe"
                src={activeBranch.mapUrl}
                width="100%"
                height="420"
                style={{ display: "block", border: "none", filter: "invert(0.88) hue-rotate(180deg) saturate(1.1) brightness(0.9)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={activeBranch.name}
              />
              {/* Pulsing glow centered on the map pin */}
              <div style={{ position: "absolute", top: "52%", left: "50%", pointerEvents: "none", zIndex: 5 }}>
                {/* Bright core */}
                <div style={{
                  position: "absolute",
                  width: "13px",
                  height: "13px",
                  borderRadius: "50%",
                  background: "rgba(255,130,0,0.95)",
                  boxShadow: "0 0 8px 4px rgba(255,130,0,0.9), 0 0 20px 8px rgba(255,130,0,0.5), 0 0 40px 16px rgba(255,130,0,0.2)",
                  transform: "translate(-50%, -50%)",
                }} />
                {/* Pulse rings */}
                <div className="map-pin-ring" style={{ animationDelay: "0s" }} />
                <div className="map-pin-ring" style={{ animationDelay: "0.73s" }} />
                <div className="map-pin-ring" style={{ animationDelay: "1.46s" }} />
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
