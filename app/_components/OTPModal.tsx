"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent, ClipboardEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { validatePhoneNumber, maskPhone } from "@/lib/auth";
import { OTP_CONFIG } from "@/lib/constants";
import type { OTPStep, SendOTPResponse, VerifyOTPResponse } from "@/lib/types";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

// ─── Animation variants ──────────────────────────────────────────────────────

const slideIn = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -32 },
};

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

const cardVariants = {
  hidden:  { opacity: 0, scale: 0.94, y: 28 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 26 } },
  exit:    { opacity: 0, scale: 0.94, y: 28 },
};

// ─── OTP digit input ─────────────────────────────────────────────────────────

interface OTPInputProps {
  value: string[];
  onChange: (digits: string[]) => void;
  disabled?: boolean;
  error?: boolean;
}

function OTPInput({ value, onChange, disabled, error }: OTPInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const focus = (i: number) => refs.current[i]?.focus();

  const handleChange = (i: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const next = [...value];
    next[i] = char;
    onChange(next);
    if (char && i < 5) focus(i + 1);
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[i]) {
        const next = [...value]; next[i] = ""; onChange(next);
      } else if (i > 0) { focus(i - 1); }
    } else if (e.key === "ArrowLeft"  && i > 0) { focus(i - 1); }
      else if (e.key === "ArrowRight" && i < 5) { focus(i + 1); }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    pasted.split("").forEach((d, i) => { next[i] = d; });
    onChange(next);
    focus(Math.min(pasted.length, 5));
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      {Array(6).fill(0).map((_, i) => (
        <motion.input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value.slice(-1))}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          whileFocus={{ scale: 1.08 }}
          style={{
            width: 48,
            height: 56,
            textAlign: "center",
            fontSize: "1.25rem",
            fontWeight: 700,
            fontFamily: "var(--font-bebas)",
            letterSpacing: "0.05em",
            borderRadius: 10,
            border: error
              ? "1.5px solid rgba(239,68,68,0.7)"
              : value[i]
              ? "1.5px solid rgba(255,130,0,0.7)"
              : "1.5px solid rgba(255,130,0,0.18)",
            background: error
              ? "rgba(239,68,68,0.06)"
              : value[i]
              ? "rgba(255,130,0,0.08)"
              : "rgba(255,255,255,0.03)",
            color: error ? "#ef4444" : value[i] ? "#FF8200" : "#F5F0EB",
            outline: "none",
            transition: "border-color 0.18s, background 0.18s",
            cursor: disabled ? "not-allowed" : "text",
            opacity: disabled ? 0.5 : 1,
          }}
        />
      ))}
    </div>
  );
}

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(seconds: number, active: boolean) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (!active) return;
    setRemaining(seconds);
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, seconds]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return { remaining, formatted: `${mm}:${ss}` };
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg style={{ animation: "spin 0.8s linear infinite" }} width="15" height="15" viewBox="0 0 16 16" fill="none">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="8" cy="8" r="6" stroke="rgba(8,8,8,0.3)" strokeWidth="2" />
      <path d="M8 2a6 6 0 016 6" stroke="#080808" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function OTPModal({ isOpen, onClose, onSuccess }: OTPModalProps) {
  const { login } = useAuth();

  const [step, setStep]               = useState<OTPStep>("phone");
  const [phone, setPhone]             = useState("");
  const [phoneError, setPhoneError]   = useState("");
  const [digits, setDigits]           = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [expiresAt, setExpiresAt]     = useState<string | null>(null);

  const otpActive = step === "verify";
  const { remaining, formatted: countdown } = useCountdown(OTP_CONFIG.expiryMinutes * 60, otpActive);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("phone"); setPhone(""); setPhoneError("");
        setDigits(Array(6).fill("")); setOtpError(""); setLoading(false);
      }, 300);
    }
  }, [isOpen]);

  const sendOTP = useCallback(async (isResend = false) => {
    if (!validatePhoneNumber(phone)) { setPhoneError("Enter a valid 10-digit Indian mobile number."); return; }
    setPhoneError(""); setLoading(true);
    try {
      const { data } = await axios.post<SendOTPResponse>(`${BACKEND_API_URL}/api/auth/send-otp`, { whatsappNumber: phone });
      if (data.success) {
        setExpiresAt(data.expiresAt ?? null);
        setDigits(Array(6).fill("")); setOtpError("");
        if (!isResend) setStep("verify");
        setResendCooldown(OTP_CONFIG.resendCooldown);
      } else { setPhoneError(data.message || "Failed to send OTP."); }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : "Failed to send OTP. Please try again.";
      setPhoneError(msg);
    } finally { setLoading(false); }
  }, [phone]);

  const verifyOTP = useCallback(async () => {
    const otp = digits.join("");
    if (otp.length < 6) { setOtpError("Enter all 6 digits."); return; }
    setOtpError(""); setLoading(true);
    try {
      const { data } = await axios.post<VerifyOTPResponse>(`${BACKEND_API_URL}/api/auth/verify-otp`, { whatsappNumber: phone, otp });
      if (data.success && data.user) {
        login(data.user, data.token);
        setStep("success");
        setTimeout(() => { onSuccess?.(); onClose(); }, 2000);
      } else { setOtpError(data.message || "Verification failed."); }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : "Verification failed. Please try again.";
      setOtpError(msg);
    } finally { setLoading(false); }
  }, [digits, phone, login, onSuccess, onClose]);

  useEffect(() => {
    if (step === "verify" && digits.every(Boolean) && !loading) verifyOTP();
  }, [digits, step, loading, verifyOTP]);

  // Shared button style helper
  const ctaActive = (condition: boolean) => ({
    width: "100%",
    padding: "15px 24px",
    borderRadius: 10,
    fontFamily: "var(--font-display)",
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: condition ? "pointer" : "not-allowed",
    border: "none",
    transition: "box-shadow 0.2s, opacity 0.2s",
    background: condition ? "linear-gradient(135deg, #FF8200, #e07520)" : "rgba(255,130,0,0.1)",
    color: condition ? "#080808" : "rgba(255,130,0,0.3)",
    boxShadow: condition ? "0 6px 28px rgba(255,130,0,0.35)" : "none",
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
          />

          {/* Card wrapper */}
          <motion.div
            key="card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ position: "fixed", inset: 0, zIndex: 101, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, pointerEvents: "none" }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 460,
                background: "#0C0C0C",
                border: "1px solid rgba(255,130,0,0.18)",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 0 80px rgba(255,130,0,0.1), 0 40px 80px rgba(0,0,0,0.7)",
                pointerEvents: "auto",
              }}
            >
              {/* Top glow line */}
              <div style={{ height: 2, background: "linear-gradient(to right, transparent, #FF8200 40%, #FF8200 60%, transparent)" }} />

              <div style={{ padding: "40px 44px 44px" }}>
                <AnimatePresence mode="wait">

                  {/* ── Phone step ── */}
                  {step === "phone" && (
                    <motion.div key="phone" {...slideIn} transition={{ duration: 0.2 }}>

                      {/* Logo + eyebrow */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
                        <div style={{ marginBottom: 14, width: 48, height: 48, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,130,0,0.2)" }}>
                          <Image src="/logo.jpg" alt="Healthify" width={48} height={48} style={{ width: 48, height: 48, objectFit: "contain" }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 24, height: 1, background: "rgba(255,130,0,0.35)" }} />
                          <span style={{ fontFamily: "var(--font-display)", fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.3em", color: "rgba(255,130,0,0.6)" }}>WOMEN&apos;S FITNESS CLUB</span>
                          <div style={{ width: 24, height: 1, background: "rgba(255,130,0,0.35)" }} />
                        </div>
                      </div>

                      {/* Heading */}
                      <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "2.6rem", lineHeight: 0.92, color: "#F5F0EB", margin: "0 0 10px" }}>
                        WELCOME TO{" "}
                        <span style={{ color: "#FF8200" }}>HEALTHIFY</span>
                      </h2>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 300, color: "rgba(245,240,235,0.38)", marginBottom: 32, lineHeight: 1.5 }}>
                        Enter your WhatsApp number to continue
                      </p>

                      {/* Phone input */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(245,240,235,0.35)", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
                          WhatsApp Number
                        </label>
                        <div
                          style={{
                            display: "flex",
                            border: phoneError ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(255,130,0,0.18)",
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.025)",
                            overflow: "hidden",
                            transition: "border-color 0.2s",
                          }}
                        >
                          {/* Country prefix */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderRight: "1px solid rgba(255,130,0,0.12)", background: "rgba(255,130,0,0.04)", flexShrink: 0 }}>
                            <span style={{ fontSize: "1rem", lineHeight: 1 }}>🇮🇳</span>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 700, color: "#F5F0EB", letterSpacing: "0.04em" }}>+91</span>
                          </div>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setPhoneError(""); }}
                            onKeyDown={(e) => { if (e.key === "Enter") sendOTP(); }}
                            placeholder="Enter your number"
                            autoFocus
                            style={{
                              flex: 1,
                              background: "transparent",
                              border: "none",
                              outline: "none",
                              color: "#F5F0EB",
                              fontFamily: "var(--font-body)",
                              fontSize: "0.9rem",
                              fontWeight: 300,
                              padding: "14px 16px",
                            }}
                          />
                        </div>
                        {phoneError && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                            style={{ color: "rgba(239,68,68,0.85)", fontSize: "0.72rem", marginTop: 8, fontFamily: "var(--font-body)" }}>
                            {phoneError}
                          </motion.p>
                        )}
                      </div>

                      {/* Send OTP button */}
                      <button
                        onClick={() => sendOTP()}
                        disabled={loading || phone.length < 10}
                        style={ctaActive(!loading && phone.length >= 10)}
                      >
                        {loading ? <><Spinner /> Sending OTP…</> : "SEND OTP →"}
                      </button>

                      {/* Footer */}
                      <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,130,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "rgba(245,240,235,0.25)", letterSpacing: "0.02em" }}>
                          We&apos;ll send a 6-digit OTP on WhatsApp
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                          {["Secure", "Fast", "WhatsApp Verified"].map((label) => (
                            <span key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-display)", fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(245,240,235,0.25)" }}>
                              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,130,0,0.5)", display: "inline-block", flexShrink: 0 }} />
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Verify step ── */}
                  {step === "verify" && (
                    <motion.div key="verify" {...slideIn} transition={{ duration: 0.2 }}>

                      {/* Back + logo row */}
                      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
                        <button
                          onClick={() => setStep("phone")}
                          style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(245,240,235,0.38)", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#F5F0EB")}
                          onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,235,0.38)")}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          BACK
                        </button>
                        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,130,0,0.18)" }}>
                            <Image src="/logo.jpg" alt="Healthify" width={40} height={40} style={{ width: 40, height: 40, objectFit: "contain" }} />
                          </div>
                        </div>
                        <div style={{ width: 48 }} />
                      </div>

                      {/* Heading */}
                      <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "2.6rem", lineHeight: 0.92, color: "#F5F0EB", margin: "0 0 8px" }}>
                        VERIFY <span style={{ color: "#FF8200" }}>OTP</span>
                      </h2>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 300, color: "rgba(245,240,235,0.38)", margin: "0 0 4px" }}>
                        Code sent to
                      </p>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", color: "#FF8200", marginBottom: 28 }}>
                        +91 {maskPhone(phone)}
                      </p>

                      {/* Countdown */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", background: "rgba(255,130,0,0.04)", border: "1px solid rgba(255,130,0,0.08)", borderRadius: 8, marginBottom: 24 }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.16em", color: "rgba(245,240,235,0.3)", textTransform: "uppercase" }}>
                          Code expires in
                        </span>
                        <span style={{ fontFamily: "var(--font-bebas)", fontSize: "1.15rem", letterSpacing: "0.08em", color: remaining <= 60 ? "#ef4444" : "#FF8200" }}>
                          {countdown}
                        </span>
                      </div>

                      {/* OTP boxes */}
                      <OTPInput value={digits} onChange={setDigits} disabled={loading || remaining === 0} error={!!otpError} />

                      {otpError && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          style={{ color: "rgba(239,68,68,0.85)", fontSize: "0.72rem", marginTop: 10, textAlign: "center", fontFamily: "var(--font-body)" }}>
                          {otpError}
                        </motion.p>
                      )}

                      {/* Verify button */}
                      <button
                        onClick={verifyOTP}
                        disabled={loading || digits.join("").length < 6 || remaining === 0}
                        style={{ ...ctaActive(!loading && digits.join("").length === 6 && remaining > 0), marginTop: 20 }}
                      >
                        {loading ? <><Spinner /> Verifying…</> : "VERIFY & PROCEED →"}
                      </button>

                      {/* Resend */}
                      <div style={{ marginTop: 18, textAlign: "center" }}>
                        {resendCooldown > 0 ? (
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "rgba(245,240,235,0.28)" }}>
                            Resend in{" "}
                            <span style={{ color: "#FF8200", fontWeight: 600 }}>00:{String(resendCooldown).padStart(2, "0")}</span>
                          </p>
                        ) : (
                          <button
                            onClick={() => sendOTP(true)}
                            disabled={loading}
                            style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: "#FF8200", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
                          >
                            RESEND OTP
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Success step ── */}
                  {step === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ padding: "16px 0 8px", textAlign: "center" }}
                    >
                      {/* Checkmark circle */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.1 }}
                        style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,130,0,0.08)", border: "1.5px solid rgba(255,130,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}
                      >
                        <motion.svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                          <motion.path
                            d="M8 18l7 7 13-13"
                            stroke="#FF8200"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          />
                        </motion.svg>
                      </motion.div>

                      <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "2.4rem", lineHeight: 0.92, color: "#F5F0EB", marginBottom: 10 }}>
                        WELCOME TO{" "}
                        <span style={{ color: "#FF8200" }}>HEALTHIFY!</span>
                      </h2>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 300, color: "rgba(245,240,235,0.38)", lineHeight: 1.6 }}>
                        You&apos;re now part of the strongest community.
                      </p>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
