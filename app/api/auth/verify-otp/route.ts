import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { generateJWT } from "@/lib/jwt.server";
import { getAdminClient } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import type { VerifyOTPResponse } from "@/lib/types";

async function notifyOwnerOnSignup(userPhone: string): Promise<void> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const ownerNumber = process.env.OWNER_WHATSAPP_NUMBER;
  if (!apiKey || !ownerNumber) { console.log(`[Owner Notify] New signup: ${userPhone}`); return; }

  const ownerDigits = ownerNumber.replace(/^\+/, "").replace(/\D/g, "");
  const ist = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true });
  const message = `🎉 NEW MEMBER SIGNUP\n\nPhone: ${userPhone}\nTime: ${ist}\n\n— Healthify Women's Fitness Club`;

  try {
    await fetch("https://www.fast2sms.com/dev/wa-group", {
      method: "POST",
      headers: { authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ message, numbers: ownerDigits }),
    });
  } catch (err) { console.error("[Owner Notify] Failed:", err); }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 verify attempts per IP per 10 minutes
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const rl = rateLimit(`verify:${ip}`, 10, 10 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json<VerifyOTPResponse>(
        { success: false, message: "Too many attempts. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const { firebaseToken } = await req.json() as { firebaseToken: string };

    if (!firebaseToken) {
      return NextResponse.json<VerifyOTPResponse>(
        { success: false, message: "Firebase token is required." },
        { status: 400 }
      );
    }

    // Verify Firebase ID token
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(firebaseToken);
    const phone = decoded.phone_number;

    if (!phone) {
      return NextResponse.json<VerifyOTPResponse>(
        { success: false, message: "Phone number not found in token." },
        { status: 400 }
      );
    }

    const db = getAdminClient();

    // Fetch or create user
    const { data: existingUser } = await db
      .from("users")
      .select("*")
      .eq("whatsapp_number", phone)
      .single();

    let finalUser;
    let isNewUser = false;

    if (!existingUser) {
      const { data: newUser, error: createErr } = await db
        .from("users")
        .insert({
          whatsapp_number: phone,
          otp_verified: true,
          verified_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createErr || !newUser) {
        return NextResponse.json<VerifyOTPResponse>(
          { success: false, message: "Account creation failed. Please try again." },
          { status: 500 }
        );
      }
      finalUser = newUser;
      isNewUser = true;
    } else {
      if (!existingUser.otp_verified) {
        await db.from("users").update({ otp_verified: true, verified_at: new Date().toISOString() }).eq("id", existingUser.id);
      }
      finalUser = existingUser;
    }

    if (isNewUser) notifyOwnerOnSignup(phone).catch(() => {});

    const jwtToken = generateJWT(finalUser.id, finalUser.whatsapp_number);

    return NextResponse.json<VerifyOTPResponse>({
      success: true,
      message: "OTP verified successfully.",
      token: jwtToken,
      user: {
        id: finalUser.id,
        whatsappNumber: finalUser.whatsapp_number,
        name: finalUser.name,
        email: finalUser.email,
        otpVerified: true,
        createdAt: finalUser.created_at,
        updatedAt: finalUser.updated_at,
      },
    });
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json<VerifyOTPResponse>(
      { success: false, message: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
