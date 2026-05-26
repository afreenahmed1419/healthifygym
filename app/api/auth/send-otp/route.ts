import { NextRequest, NextResponse } from "next/server";
import { generateOTP, hashOTP, otpExpiry, formatIndianPhone, validatePhoneNumber } from "@/lib/auth";
import { getAdminClient } from "@/lib/supabase";
import type { SendOTPResponse } from "@/lib/types";

async function sendWhatsAppOTP(phone: string, otp: string): Promise<{ sent: boolean; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  // Always log to server console so devs can test without WhatsApp
  console.log(`[OTP] ${phone} → ${otp}`);

  if (!sid || !token || !from) {
    return { sent: false, error: "Twilio not configured — OTP logged to server console." };
  }

  try {
    const twilio = (await import("twilio")).default;
    const client = twilio(sid, token);
    await client.messages.create({
      from: `whatsapp:${from}`,
      to: `whatsapp:${phone}`,
      body: `Your Healthify OTP is: *${otp}*\n\nValid for 5 minutes. Do not share this with anyone.\n\n— Healthify Women's Fitness Club`,
    });
    return { sent: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[OTP] Twilio delivery failed for ${phone}:`, msg);
    return { sent: false, error: msg };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { whatsappNumber } = body as { whatsappNumber: string };

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

    // Send via WhatsApp (Twilio); OTP is always logged to server console
    const { sent, error: twilioError } = await sendWhatsAppOTP(phone, otp);

    return NextResponse.json<SendOTPResponse>({
      success: true,
      message: sent
        ? `OTP sent to ${phone} on WhatsApp.`
        : `OTP generated${twilioError ? " (WhatsApp unavailable — check server console)" : ""}.`,
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
