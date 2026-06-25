"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AwardsSectionMobile() {
  return (
    <section style={{ position: "relative", padding: "60px 20px", background: "#080808" }}>

      {/* ── Section header ── */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.28em", color: "#FF8200", marginBottom: "10px" }}>RECOGNITION</div>
        <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.8rem, 10vw, 4rem)", color: "#F5F0EB", lineHeight: 0.95 }}>
          Awards & <span style={{ color: "#FF8200" }}>Recognition</span>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 300, color: "rgba(245,240,235,0.38)", marginTop: "10px", letterSpacing: "0.02em" }}>
          Recognizing excellence in women&apos;s wellness, entrepreneurship, and community impact.
        </p>
      </div>

      {/* ── Part 1: Photo + Women Changemakers Summit ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.7 }}
        style={{ position: "relative", overflow: "hidden", border: "1px solid rgba(255,150,0,0.22)", borderRadius: "16px", marginBottom: "16px", background: "linear-gradient(135deg, #130c04 0%, #0e0904 50%, #080808 100%)" }}>

        {/* Glow top border */}
        <div style={{ position: "absolute", top: -1, left: "20%", right: "20%", height: "2px", background: "linear-gradient(to right, transparent, rgba(255,130,0,0.8), transparent)", filter: "blur(2px)", zIndex: 1 }} />
        <div style={{ position: "absolute", top: -1, left: "20%", right: "20%", height: "1px", background: "linear-gradient(to right, transparent, #FF8200, transparent)", zIndex: 1 }} />

        {/* WCS content */}
        <div style={{ padding: "24px 20px 28px" }}>

          {/* Photo + nameplate — centred */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{ width: "130px" }}>
              <div style={{ border: "2px solid rgba(255,150,0,0.4)", borderRadius: "8px 8px 0 0", overflow: "hidden", position: "relative", height: "160px" }}>
                <Image src="/images/aurshia.png" alt="Aurshia Tahir, founder of Healthify women’s fitness club in Sri Vijaya Puram"
                  fill sizes="130px" style={{ objectFit: "cover", objectPosition: "top center" }} />
              </div>
              <div style={{ background: "#FF8200", padding: "7px 10px", textAlign: "center", borderRadius: "0 0 8px 8px" }}>
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1rem", color: "#080808", letterSpacing: "0.04em", lineHeight: 1 }}>Aurshia Tahir</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.58rem", color: "rgba(0,0,0,0.7)", marginTop: "2px", lineHeight: 1.3 }}>Founder Healthify<br />Women&apos;s Fitness Club</div>
              </div>
            </div>
          </div>

          {/* SheInspire branding */}
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "2px" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontStyle: "italic", fontWeight: 800, color: "#F5F0EB" }}>She</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontStyle: "italic", fontWeight: 800, color: "#FF8200" }}>Inspire</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 600, color: "rgba(245,240,235,0.35)", letterSpacing: "0.18em", marginLeft: "8px" }}>MAGAZINE</span>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 600, letterSpacing: "0.28em", color: "rgba(245,240,235,0.35)", marginBottom: "14px" }}>PRESENTS</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(245,240,235,0.5)", marginBottom: "14px" }}>MEET THE VOICE OF CHANGE</div>

            {/* Summit title */}
            <div style={{ lineHeight: 0.9, marginBottom: "16px" }}>
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.4rem, 11vw, 3rem)", color: "#F5F0EB", letterSpacing: "0.04em" }}>WOMEN</div>
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.4rem, 11vw, 3rem)", color: "#FF8200", letterSpacing: "0.04em" }}>CHANGEMAKERS</div>
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(1.6rem, 7.5vw, 2rem)", color: "#F5F0EB", letterSpacing: "0.04em" }}>SUMMIT 2026</div>
            </div>

            <div style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 600, letterSpacing: "0.16em", color: "rgba(245,240,235,0.3)", marginBottom: "14px" }}>
              BOLD VOICES &nbsp;·&nbsp; REAL IMPACT &nbsp;·&nbsp; GLOBAL CHANGE
            </div>

            {/* Date box */}
            <div style={{ border: "1px solid rgba(245,240,235,0.15)", borderRadius: "6px", padding: "10px 14px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: "#F5F0EB" }}>
                MAY 23, 2026 &nbsp;|&nbsp; RAMADA BY WYNDHAM, BANGALORE
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Part 2: Founder's Quote ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.7, delay: 0.08 }}
        style={{ position: "relative", overflow: "hidden", border: "1px solid rgba(255,150,0,0.18)", borderRadius: "16px", marginBottom: "16px", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>

        <div style={{ position: "absolute", top: -1, left: "15%", right: "15%", height: "2px", background: "linear-gradient(to right, transparent, rgba(255,130,0,0.7), transparent)", filter: "blur(2px)" }} />
        <div style={{ position: "absolute", top: -1, left: "15%", right: "15%", height: "1px", background: "linear-gradient(to right, transparent, #FF8200, transparent)" }} />

        <div style={{ padding: "28px 20px 24px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "2.4rem", color: "rgba(255,130,0,0.22)", lineHeight: 1, marginBottom: "10px" }}>&ldquo;</div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontStyle: "italic", fontWeight: 300, color: "rgba(245,240,235,0.62)", lineHeight: 1.85, margin: 0 }}>
            At Healthify, our biggest achievement is the trust, transformations, and positive feedback we receive from the women who are part of our fitness community. Every fitness milestone achieved by our members is a recognition of the work we do.
          </p>
          <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "18px", height: "1px", background: "rgba(255,130,0,0.45)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,130,0,0.65)" }}>AURSHIA TAHIR &nbsp;·&nbsp; FOUNDER, HEALTHIFY</span>
          </div>
        </div>
      </motion.div>

      {/* ── Part 3: SIWAA Award ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }} transition={{ duration: 0.7, delay: 0.16 }}
        style={{ position: "relative", overflow: "hidden", border: "1px solid rgba(255,130,0,0.25)", borderRadius: "16px", background: "linear-gradient(135deg, #130c04 0%, #0e0904 50%, #080808 100%)" }}>

        <div style={{ position: "absolute", top: -1, left: "20%", right: "20%", height: "2px", background: "linear-gradient(to right, transparent, rgba(255,130,0,0.7), transparent)", filter: "blur(2px)" }} />
        <div style={{ position: "absolute", top: -1, left: "20%", right: "20%", height: "1px", background: "linear-gradient(to right, transparent, #FF8200, transparent)" }} />

        <div style={{ padding: "28px 20px 32px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,130,0,0.65)", marginBottom: "16px" }}>TWELL MAGAZINE · 2026</div>

          <div style={{ fontFamily: "var(--font-bebas)", fontSize: "2.2rem", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 0.92 }}>S. INDIA WOMEN</div>
          <div style={{ fontFamily: "var(--font-bebas)", fontSize: "2.2rem", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 0.92 }}>ACHIEVERS</div>
          <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1.6rem", color: "#FF8200", letterSpacing: "0.06em", marginBottom: "24px" }}>AWARDS (SIWAA)</div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,130,0,0.15)", paddingTop: "20px" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.16em", color: "rgba(245,240,235,0.35)", marginBottom: "8px" }}>CATEGORY</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 500, color: "#F5F0EB" }}>Changemaker</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 500, color: "#F5F0EB" }}>Women&apos;s Wellness</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.16em", color: "rgba(245,240,235,0.35)", marginBottom: "8px" }}>RESULT</div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.22em", color: "#FF8200", border: "1px solid rgba(255,130,0,0.5)", padding: "10px 22px", display: "inline-block" }}>WINNER</span>
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  );
}
