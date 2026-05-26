"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { NAV_LINKS, BRAND } from "@/lib/constants";
import OTPModal from "./OTPModal";

// ─── Logo ───────────────────────────────────────────────────────────────────

function HealthifyLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`shrink-0 ${className}`}>
      <Image src="/logo.png" alt="Healthify" width={220} height={64} className="h-16 w-auto object-contain" />
    </Link>
  );
}

// ─── Mobile Drawer ───────────────────────────────────────────────────────────

function MobileDrawer({
  open,
  onClose,
  pathname,
  user,
  onLoginClick,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  user: ReturnType<typeof useAuth>["user"];
  onLoginClick: () => void;
  onLogout: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col lg:hidden overflow-hidden"
          style={{ background: "#080808" }}
        >
          <style>{`
            .mnav-link {
              display: flex; align-items: center; justify-content: space-between;
              border-bottom: 1px solid #111; padding: 13px 10px; border-radius: 6px;
              transition: background 0.18s, padding-left 0.18s;
              text-decoration: none;
            }
            .mnav-link:hover, .mnav-link:active {
              background: rgba(255,130,0,0.05);
              padding-left: 18px;
            }
            .mnav-close {
              display: flex; align-items: center; justify-content: center;
              width: 34px; height: 34px; border-radius: 50%; background: #141414;
              border: none; cursor: pointer; transition: background 0.18s;
            }
            .mnav-close:hover { background: #222; }
            .mnav-phone {
              display: block; transition: color 0.18s;
              font-size: 10px; letter-spacing: 0.2em; color: #444;
            }
            .mnav-phone:hover { color: #FF8200; }
            .mnav-btn {
              width: 100%; border-radius: 6px; padding: 11px;
              font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
              text-transform: uppercase; color: #555;
              background: transparent; border: 1px solid #222; cursor: pointer;
              transition: border-color 0.18s, color 0.18s, background 0.18s;
            }
            .mnav-btn:hover { border-color: #444; color: #ccc; background: #111; }
            .mnav-cta {
              display: flex; align-items: center; justify-content: center; width: 100%;
              padding: 14px; border-radius: 6px; font-size: 12px; font-weight: 700;
              letter-spacing: 0.2em; text-transform: uppercase; color: #080808;
              text-decoration: none;
              background: linear-gradient(135deg, #FF8200, #d97500);
              transition: filter 0.18s, transform 0.18s;
            }
            .mnav-cta:hover { filter: brightness(1.1); }
            .mnav-cta:active { transform: scale(0.97); }
          `}</style>

          {/* Decorative orange glow */}
          <div style={{
            position: "absolute", top: "-80px", right: "-60px",
            width: "260px", height: "260px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,130,0,0.11) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "80px", left: "-80px",
            width: "200px", height: "200px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,130,0,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Header */}
          <div className="flex items-center justify-between shrink-0 px-6"
            style={{ height: "60px", borderBottom: "1px solid #141414" }}>
            <HealthifyLogo />
            <button onClick={onClose} className="mnav-close">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex flex-col justify-center px-4">
            {NAV_LINKS.map((link, i) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="mnav-link"
                >
                  <div className="flex items-center gap-3">
                    <span style={{
                      fontFamily: "var(--font-display)", fontSize: "9px",
                      fontWeight: 700, letterSpacing: "0.18em",
                      color: active ? "rgba(255,130,0,0.55)" : "rgba(255,255,255,0.13)",
                    }}>
                      0{i + 1}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: "1.65rem",
                      letterSpacing: "0.06em",
                      color: active ? "#FF8200" : "#bbb",
                      transition: "color 0.18s",
                    }}>
                      {link.label}
                    </span>
                  </div>
                  <div style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: active ? "#FF8200" : "transparent",
                    flexShrink: 0,
                  }} />
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="shrink-0 px-5 pb-7 space-y-2.5"
            style={{ borderTop: "1px solid #141414", paddingTop: "18px" }}>
            <a href={`tel:${BRAND.phone}`} className="mnav-phone"
              style={{ fontFamily: "var(--font-display)" }}>
              {BRAND.phone}
            </a>

            {user ? (
              <>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "9px", letterSpacing: "0.15em", color: "#3a3a3a" }}>
                  Logged in as <span style={{ color: "#FF8200" }}>{user.whatsappNumber}</span>
                </div>
                <button onClick={() => { onLogout(); onClose(); }}
                  className="mnav-btn" style={{ fontFamily: "var(--font-display)" }}>
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => { onLoginClick(); onClose(); }}
                className="mnav-btn" style={{ fontFamily: "var(--font-display)" }}>
                Login / Sign Up
              </button>
            )}

            <Link href="/memberships" onClick={onClose}
              className="mnav-cta" style={{ fontFamily: "var(--font-display)" }}>
              Book a Class →
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Nav Link with hover effect ──────────────────────────────────────────────

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative px-5 py-2 uppercase"
      style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: "600",
        fontSize: "16px",
        letterSpacing: "0.2em",
        color: active ? "#FF8200" : hov ? "#ffffff" : "#888888",
        transition: "color 0.2s",
      }}
    >
      {children}
      {/* active underline */}
      {active && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-5 right-5 h-[1.5px] rounded-full"
          style={{ background: "#FF8200" }}
        />
      )}
      {/* hover underline — slides in from left */}
      {!active && (
        <motion.div
          className="absolute bottom-0 left-5 right-5 h-[1.5px] rounded-full origin-left"
          style={{ background: "#FF8200", opacity: 0.6 }}
          animate={{ scaleX: hov ? 1 : 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        />
      )}
    </Link>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    const timer = setTimeout(() => setOtpOpen(true), 600);
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: "rgba(8, 8, 8, 0.45)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 130, 0, 0.1)",
          boxShadow: scrolled ? "0 2px 32px rgba(0,0,0,0.6)" : "none",
        }}
      >
        <div className="w-full" style={{ padding: "0 48px" }}>
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Left: Logo wordmark */}
            <HealthifyLogo />

            {/* Center: Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <NavLink key={link.href} href={link.href} active={active}>
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right: Phone + Auth + CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-4">
                  <span
                    className="text-[#aaa] text-[11px] tracking-widest"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {user.whatsappNumber}
                  </span>
                  <button
                    onClick={logout}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#ffffff",
                      background: "#080808",
                      border: "1px solid #FF8200",
                      padding: "0 24px",
                      height: "42px",
                      cursor: "pointer",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <a
                    href={`tel:${BRAND.phone}`}
                    className="text-[#aaa] text-[11px] tracking-widest hover:text-[#FF8200] transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {BRAND.phone}
                  </a>
                  <button
                    onClick={() => setOtpOpen(true)}
                    className="text-[#aaa] hover:text-white text-[11px] tracking-widest uppercase transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Login
                  </button>
                </div>
              )}

              {/* CTA — separated with a divider */}
              <div className="h-6 w-px bg-[#222]" />
              <Link href="/memberships">
                <button
                  onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLElement).style, { transform: "translateY(-2px)", boxShadow: "0 6px 24px rgba(255,130,0,0.35)", filter: "brightness(1.08)" })}
                  onMouseLeave={(e) => Object.assign((e.currentTarget as HTMLElement).style, { transform: "none", boxShadow: "none", filter: "none" })}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#080808",
                    background: "#FF8200",
                    border: "none",
                    padding: "0 20px",
                    height: "42px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    whiteSpace: "nowrap",
                    transition: "transform 0.2s, box-shadow 0.2s, filter 0.2s",
                  }}>
                  BOOK A CLASS
                </button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex flex-col gap-[5px] p-2 group"
              aria-label="Open menu"
            >
              <span className="w-6 h-px bg-white rounded-full transition-all" />
              <span className="w-4 h-px bg-[#FF8200] rounded-full transition-all group-hover:w-6" />
              <span className="w-6 h-px bg-white rounded-full transition-all" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
        user={user}
        onLoginClick={() => setOtpOpen(true)}
        onLogout={logout}
      />

      <OTPModal isOpen={otpOpen} onClose={() => setOtpOpen(false)} />
    </>
  );
}
