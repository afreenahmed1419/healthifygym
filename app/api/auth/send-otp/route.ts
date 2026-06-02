import { NextRequest, NextResponse } from "next/server";
import { generateOTP, hashOTP, otpExpiry, formatIndianPhone, validatePhoneNumber } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import type { SendOTPResponse } from "@/lib/types";

async function sendOTPviaSMS(phone: string, otp: string): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.FAST2SMS_API_KEY;

  // Always log so devs can test without an API key
  console.log(`[OTP] ${phone} → ${otp}`);

  if (!apiKey) {
    return { sent: false, error: "FAST2SMS_API_KEY not configured — OTP logged to server console." };
  }

  // Fast2SMS expects a 10-digit number (no +91 prefix)
  const number = phone.replace(/^\+91/, "");

  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: { authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ route: "otp", variables_values: otp, numbers: number, flash: 0 }),
    });
    const data = await res.json() as { return?: boolean; message?: string | string[] };
    if (data.return === true) return { sent: true };
    const errMsg = Array.isArray(data.message) ? data.message.join(", ") : String(data.message ?? "Unknown error");
    console.error(`[OTP] Fast2SMS error for ${phone}:`, errMsg);
    return { sent: false, error: errMsg };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[OTP] Fast2SMS request failed for ${phone}:`, msg);
    return { sent: false, error: msg };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { whatsappNumber } = body as { whatsappNumber: string };

    // Rate limit: 5 OTP requests per phone per 10 minutes
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const rlKey = `otp:${whatsappNumber ?? ip}`;
    const rl = rateLimit(rlKey, 5, 10 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json<SendOTPResponse>(
        { success: false, message: "Too many OTP requests. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    if (!whatsappNumber) {
      return NextResponse.json<SendOTPResponse>(
        { success: false, message: "WhatsApp number is required." },
        { status: 400 }
      );
    }

    if (!validatePhoneNumber(whatsappNumber)) {
      return NextResponse.json<SendOTPResponse>(
        { success: false, message: "Enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    const phone = formatIndianPhone(whatsappNumber);
    const otp = generateOTP();
    const hash = hashOTP(otp, phone);
    const expiresAt = otpExpiry();

    const db = getAdminClient();

    // Invalidate all existing unused OTPs for this number
    await db
      .from("otp_tokens")
      .update({ used: true })
      .eq("whatsapp_number", phone)
      .eq("used", false);

    // Store hashed OTP
    const { error: dbErr } = await db.from("otp_tokens").insert({
      whatsapp_number: phone,
      otp_hash: hash,
      expires_at: expiresAt,
    });

    if (dbErr) {
      console.error("[send-otp] DB error:", dbErr.message);
      return NextResponse.json<SendOTPResponse>(
        { success: false, message: "Failed to generate OTP. Please try again." },
        { status: 500 }
      );
    }

    // Send via Fast2SMS; OTP is always logged to server console
    const { sent, error: smsError } = await sendOTPviaSMS(phone, otp);

    return NextResponse.json<SendOTPResponse>({
      success: true,
      message: sent
        ? `OTP sent to ${phone} via SMS.`
        : `OTP generated${smsError ? " (SMS unavailable — check server console)" : ""}.`,
      expiresAt,
    });
  } catch (err) {
    console.error("[send-otp]", err);
    return NextResponse.json<SendOTPResponse>(
      { success: false, message: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
