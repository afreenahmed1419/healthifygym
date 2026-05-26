import CryptoJS from "crypto-js";
import { env } from "../config/env";

const OTP_SECRET = env.otpSecret || "healthify-otp-secret-2024";

// ─── Phone Validation ────────────────────────────────────────────────────────

export function validatePhoneNumber(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  // Accept exactly 10 digits, or +91 + 10 digits (12 total), or 91 + 10 digits
  if (digits.length === 10) return /^[6-9]\d{9}$/.test(digits);
  if (digits.length === 12 && digits.startsWith("91"))
    return /^[6-9]\d{9}$/.test(digits.slice(2));
  return false;
}

export function formatIndianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  return raw;
}

// ─── OTP ────────────────────────────────────────────────────────────────────

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOTP(otp: string, phone: string): string {
  return CryptoJS.HmacSHA256(`${otp}:${phone}`, OTP_SECRET).toString();
}

export function otpExpiry(): string {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 5); // 5 minutes expiry
  return expiry.toISOString();
}

export function isOTPExpired(expiresAt: string): boolean {
  return new Date() > new Date(expiresAt);
}