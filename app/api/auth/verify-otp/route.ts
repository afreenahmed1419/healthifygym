import { NextRequest, NextResponse } from "next/server";
import { hashOTP, formatIndianPhone, validatePhoneNumber, isOTPExpired } from "@/lib/auth";
import { generateJWT } from "@/lib/jwt.server";
import { getAdminClient } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import type { VerifyOTPResponse } from "@/lib/types";

async function notifyOwnerOnSignup(userPhone: string): Promise<void> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const ownerNumber = process.env.OWNER_WHATSAPP_NUMBER;

  if (!apiKey || !ownerNumber) {
    console.log(`[Owner Notify] New signup: ${userPhone}`);
    return;
  }

  // Build owner's number in format Fast2SMS expects: 91XXXXXXXXXX (no +)
  const ownerDigits = ownerNumber.replace(/^\+/, "").replace(/\D/g, "");
  const ist = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true });

  const message =
    `🎉 NEW MEMBER SIGNUP\n\n` +
    `Phone: ${userPhone}\n` +
    `Time: ${ist}\n\n` +
    `— Healthify Women's Fitness Club`;

  try {
    const res = await fetch("https://www.fast2sms.com/dev/wa-group", {
      method: "POST",
      headers: { authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ message, numbers: ownerDigits }),
    });
    const data = await res.json() as { return?: boolean; message?: unknown };
    if (data.return) {
      console.log("[Owner Notify] WhatsApp sent to owner");
    } else {
      console.error("[Owner Notify] WhatsApp failed:", JSON.stringify(data));
    }
  } catch (err) {
    console.error("[Owner Notify] Failed:", err);
  }
}

type UserRow = Database["public"]["Tables"]["users"]["Row"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { whatsappNumber, otp } = body as { whatsappNumber: string; otp: string };

    if (!whatsappNumber || !otp) {
      return NextResponse.json<VerifyOTPResponse>(
        { success: false, message: "Phone number and OTP are required." },
        { status: 400 }
      );
    }

    if (!validatePhoneNumber(whatsappNumber)) {
      return NextResponse.json<VerifyOTPResponse>(
        { success: false, message: "Invalid phone number format." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json<VerifyOTPResponse>(
        { success: false, message: "OTP must be a 6-digit number." },
        { status: 400 }
      );
    }

    const phone = formatIndianPhone(whatsappNumber);
    const inputHash = hashOTP(otp, phone);
    const db = getAdminClient();

    // Fetch most recent unused OTP
    const { data: tokenRow, error: fetchErr } = await db
      .from("otp_tokens")
      .select("*")
      .eq("whatsapp_number", phone)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchErr || !tokenRow) {
      return NextResponse.json<VerifyOTPResponse>(
        { success: false, message: "No active OTP found. Please request a new one." },
        { status: 401 }
      );
    }

    if (isOTPExpired(tokenRow.expires_at)) {
      return NextResponse.json<VerifyOTPResponse>(
        { success: false, message: "OTP has expired. Please request a new one." },
        { status: 401 }
      );
    }

    if (tokenRow.otp_hash !== inputHash) {
      return NextResponse.json<VerifyOTPResponse>(
        { success: false, message: "Invalid OTP. Please check and try again." },
        { status: 401 }
      );
    }

    // Consume the token
    await db.from("otp_tokens").update({ used: true }).eq("id", tokenRow.id);

    // Fetch or create user
    const { data: existingUser } = await db
      .from("users")
      .select("*")
      .eq("whatsapp_number", phone)
      .single();

    let finalUser: UserRow;

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
        console.error("[verify-otp] User creation failed:", createErr?.message);
        return NextResponse.json<VerifyOTPResponse>(
          { success: false, message: "Account creation failed. Please try again." },
          { status: 500 }
        );
      }

      finalUser = newUser;
      // Fire-and-forget: notify owner on WhatsApp about new signup
      notifyOwnerOnSignup(phone).catch(() => {});
    } else {
      if (!existingUser.otp_verified) {
        await db
          .from("users")
          .update({ otp_verified: true, verified_at: new Date().toISOString() })
          .eq("id", existingUser.id);
      }
      finalUser = existingUser;
    }

    // Issue JWT (30-day expiry)
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
