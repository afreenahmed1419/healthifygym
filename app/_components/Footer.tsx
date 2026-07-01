"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Membership", href: "/memberships" },
  { label: "Contact", href: "/contact" },
];

const SERVICE_LINKS = [
  { label: "Strength Training", href: "/services#strength-training" },
  { label: "Zumba & Aerobics", href: "/services#zumba-aerobics" },
  { label: "Nutritional Guidance", href: "/services#nutritional-guidance" },
  { label: "Personal Training", href: "/services#personal-training" },
  { label: "Women Wellness", href: "/services#women-wellness" },
  { label: "Yoga", href: "/services#yoga-strength" },
];


function FooterLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "0.82rem",
        fontWeight: 400,
        color: hovered ? "#FF8200" : "rgba(245,240,235,0.5)",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        paddingLeft: hovered ? "4px" : "0",
        transition: "color 0.2s, padding-left 0.2s",
      }}
    >
      <span style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>→</span>
      {label}
    </Link>
  );
}

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
      <span style={{
        fontFamily: "var(--font-display)",
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.3em",
        color: "#FF8200",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,130,0,0.2)" }} />
    </div>
  );
}

function SocialButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "36px",
        height: "36px",
        border: hovered ? "1px solid #FF8200" : "1px solid rgba(255,130,0,0.2)",
        background: hovered ? "rgba(255,130,0,0.08)" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered ? "#FF8200" : "rgba(245,240,235,0.5)",
        borderRadius: "8px",
        transition: "all 0.2s",
        cursor: "pointer",
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const openChat = () => {
    const btn = document.querySelector<HTMLElement>("[data-chat-toggle], .chat-button, button[aria-label*='chat' i], button[aria-label*='Chat' i]");
    if (btn) btn.click();
  };

  const [chatHovered, setChatHovered] = useState(false);

  return (
    <footer style={{ background: "#080808", borderTop: "1px solid rgba(255,130,0,0.15)", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes footerPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>

      {/* Orange orb bottom-left */}
      <div style={{ position: "absolute", bottom: "-200px", left: "-100px", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(255,130,0,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Grid lines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,130,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,130,0,0.02) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

      {/* Top section */}
      <div className="rsp-footer-grid" style={{ padding: "80px 80px 0 80px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "60px", position: "relative", zIndex: 1 }}>

        {/* Column 1 — Brand */}
        <div>
          <div style={{ marginBottom: "16px" }}>
            <Image src="/logo.png" alt="Healthify" width={200} height={60} style={{ width: "200px", height: "auto", objectFit: "contain" }} />
          </div>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 300, color: "rgba(245,240,235,0.45)", lineHeight: 1.8, marginTop: "20px", maxWidth: "280px" }}>
            Empowering women of all ages to build strength, confidence and a healthier, unstoppable tomorrow.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
            {/* Instagram */}
            <SocialButton href="https://www.instagram.com/healthifyportblair/">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </SocialButton>
            {/* Facebook */}
            <SocialButton href="https://www.facebook.com/profile.php?id=100090896265271">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </SocialButton>
            {/* WhatsApp */}
            <SocialButton href="https://wa.me/919474287111">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
            </SocialButton>
          </div>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <ColumnHeading>Quick Links</ColumnHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {QUICK_LINKS.map((link) => (
              <FooterLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>
        </div>

        {/* Column 3 — Our Services */}
        <div>
          <ColumnHeading>Our Services</ColumnHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {SERVICE_LINKS.map((link) => (
              <FooterLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>
        </div>

        {/* Column 4 — Support */}
        <div>
          <ColumnHeading>Support</ColumnHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* AI Assistant */}
            <button
              onClick={openChat}
              onMouseEnter={() => setChatHovered(true)}
              onMouseLeave={() => setChatHovered(false)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#22c55e",
                flexShrink: 0,
                animation: "footerPulse 2s ease-in-out infinite",
              }} />
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: chatHovered ? "#ffb366" : "#FF8200",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}>
                CHAT WITH AVIRA
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="rsp-footer-divider" style={{ margin: "60px 80px 0 80px", height: "1px", background: "linear-gradient(to right, transparent, rgba(255,130,0,0.2), transparent)" }} />

      {/* Bottom bar */}
      <div className="rsp-footer-bottom" style={{ padding: "24px 80px 32px 80px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", position: "relative", zIndex: 1 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, color: "rgba(245,240,235,0.5)", letterSpacing: "0.08em" }}>
          Made with <span style={{ color: "#FF8200" }}>♥</span> for strong women
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" as const, justifyContent: "center" }}>
          {[
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms & Conditions", href: "/terms" },
            { label: "Refund Policy", href: "/refund" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontFamily: "var(--font-display)", fontSize: "0.68rem", fontWeight: 400, color: "rgba(245,240,235,0.25)", letterSpacing: "0.06em", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,130,0,0.7)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(245,240,235,0.25)"; }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "0.72rem", fontWeight: 400, color: "rgba(245,240,235,0.25)", letterSpacing: "0.05em" }}>
          © 2025 Healthify Women&apos;s Fitness Club. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
