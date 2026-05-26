import CryptoJS from "crypto-js";
import { OTP_CONFIG } from "./constants";
import type { User } from "./types";

const OTP_SECRET = process.env.OTP_SECRET || "healthify-otp-secret-2024";
const TOKEN_KEY = "healthify_token";
const USER_KEY = "healthify_user";

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

export function maskPhone(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.length < 5) return phone;
  const last5 = clean.slice(-5);
  return `+91 XXXXX ${last5}`;
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
  expiry.setMinutes(expiry.getMinutes() + OTP_CONFIG.expiryMinutes);
  return expiry.toISOString();
}

export function isOTPExpired(expiresAt: string): boolean {
  return new Date() > new Date(expiresAt);
}

// ─── Session (localStorage) ──────────────────────────────────────────────────

export function saveSession(user: User, token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function isTokenExpired(token: string): boolean {
  try {
    // Decode JWT payload (base64url) without verifying signature — safe for browser
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { exp?: number };
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as User;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || isTokenExpired(token)) {
      clearSession();
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
