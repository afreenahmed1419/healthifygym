import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { createRazorpayOrder } from "@/lib/razorpay.server";
import { sanitizeString, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";
import { validatePhoneNumber, formatIndianPhone } from "@/lib/auth";

// Member prices in paise (₹ × 100)
const MEMBER_PRICES: Record<string, number> = {
  "Essential (Strength) — Monthly":        300000,
  "Essential (Strength) — Quarterly":      600000,
  "Essential (Strength) — Half Yearly":   1000000,
  "Essential (Strength) — Yearly":        1800000,
  "Essential (Strength) — PT Monthly":     550000,
  "Essential (Strength) — PT Quarterly":  1500000,
  "Essential (Strength) — PT Half Yearly":2700000,
  "Yoga / Aerobics / Zumba — Monthly":     300000,
  "Yoga / Aerobics / Zumba — Quarterly":   600000,
  "Yoga / Aerobics / Zumba — Half Yearly":1000000,
  "Yoga / Aerobics / Zumba — Yearly":     1800000,
  "Strength + Zumba / Aerobics (Combo) — Monthly":     500000,
  "Strength + Zumba / Aerobics (Combo) — Quarterly":  1000000,
  "Strength + Zumba / Aerobics (Combo) — Half Yearly":1750000,
  "Strength + Zumba / Aerobics (Combo) — Yearly":     3000000,
  "Lifetime Membership": 300000,
};

// Non-member prices for Essential and Yoga plans
const NON_MEMBER_PRICES: Record<string, number> = {
  "Essential (Strength) — Monthly":         350000,
  "Essential (Strength) — Quarterly":       900000,
  "Essential (Strength) — Half Yearly":    1500000,
  "Essential (Strength) — Yearly":         2500000,
  "Essential (Strength) — PT Monthly":      650000,
  "Essential (Strength) — PT Quarterly":   1950000,
  "Essential (Strength) — PT Half Yearly": 3900000,
  "Yoga / Aerobics / Zumba — Monthly":      350000,
  "Yoga / Aerobics / Zumba — Quarterly":    900000,
  "Yoga / Aerobics / Zumba — Half Yearly": 1500000,
  "Yoga / Aerobics / Zumba — Yearly":      2500000,
};

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json() as {
      serviceName: string;
      bookingDate: string;
      bookingTime: string;
      userName?: string;
      email?: string;
      phone?: string;
      whatsappNumber?: string;
      goal?: string;
      isMember?: boolean;
      includeMembership?: boolean;
    };

    const body = {
      serviceName: sanitizeString(raw.serviceName),
      bookingDate: sanitizeString(raw.bookingDate),
      bookingTime: sanitizeString(raw.bookingTime),
      userName: raw.userName ? sanitizeString(raw.userName) : undefined,
      email: raw.email ? sanitizeEmail(raw.email) : undefined,
      phone: raw.phone ? sanitizePhone(raw.phone) : undefined,
      whatsappNumber: raw.whatsappNumber ? sanitizePhone(raw.whatsappNumber) : undefined,
      goal: raw.goal ? sanitizeString(raw.goal) : undefined,
      isMember: !!raw.isMember,
      includeMembership: !!raw.includeMembership,
    };

    // Guest checkout — identify the customer by phone instead of a login session
    if (!body.phone || !validatePhoneNumber(body.phone)) {
      return NextResponse.json({ success: false, message: "A valid phone number is required." }, { status: 400 });
    }
    const phoneE164 = formatIndianPhone(body.phone);

    const db = getAdminClient();

    // Create or reuse the user record keyed by phone number
    const { data: existingUser } = await db
      .from("users")
      .select("id")
      .eq("whatsapp_number", phoneE164)
      .single();

    let userId: string;
    if (existingUser) {
      userId = existingUser.id;
      if (body.userName || body.email) {
        await db.from("users").update({
          ...(body.userName ? { name: body.userName } : {}),
          ...(body.email ? { email: body.email } : {}),
        }).eq("id", userId);
      }
    } else {
      const { data: createdUser, error: createErr } = await db
        .from("users")
        .insert({ whatsapp_number: phoneE164, name: body.userName ?? null, email: body.email ?? null })
        .select("id")
        .single();
      if (createErr || !createdUser) {
        return NextResponse.json({ success: false, message: "Could not start your booking. Please try again." }, { status: 500 });
      }
      userId = createdUser.id;
    }

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(body.bookingDate);
    if (isNaN(bookingDate.getTime()) || bookingDate < today) {
      return NextResponse.json({ success: false, message: "Booking date must be today or in the future." }, { status: 400 });
    }

    if (!/^\d{2}:\d{2}$/.test(body.bookingTime)) {
      return NextResponse.json({ success: false, message: "Booking time must be in HH:MM format." }, { status: 400 });
    }

    // Resolve price and final service name server-side
    let correctAmount: number;
    let finalServiceName = body.serviceName;

    if (body.serviceName === "Drop-In Pass (Daily)") {
      correctAmount = body.isMember ? 20000 : 25000;
    } else if (body.isMember) {
      const p = MEMBER_PRICES[body.serviceName];
      if (!p) return NextResponse.json({ success: false, message: "Invalid service selected." }, { status: 400 });
      correctAmount = p;
    } else if (body.includeMembership) {
      const p = MEMBER_PRICES[body.serviceName];
      if (!p || body.serviceName === "Lifetime Membership") {
        return NextResponse.json({ success: false, message: "Invalid service selected." }, { status: 400 });
      }
      correctAmount = p + 300000;
      finalServiceName = `${body.serviceName} + Lifetime Membership`;
    } else {
      const p = NON_MEMBER_PRICES[body.serviceName] ?? MEMBER_PRICES[body.serviceName];
      if (!p) return NextResponse.json({ success: false, message: "Invalid service selected." }, { status: 400 });
      correctAmount = p;
    }

    const razorpayOrder = await createRazorpayOrder(correctAmount, finalServiceName, userId);
    if (!razorpayOrder) {
      return NextResponse.json({ success: false, message: "Failed to create payment order. Please try again." }, { status: 500 });
    }

    const { data: booking, error } = await db.from("bookings").insert({
      user_id: userId,
      service_name: finalServiceName,
      booking_date: body.bookingDate,
      booking_time: body.bookingTime,
      payment_amount: correctAmount,
      razorpay_payment_id: razorpayOrder.id,
      payment_status: "pending",
      owner_notified: false,
      notes: JSON.stringify({ whatsapp: body.whatsappNumber ?? null, extra: body.goal ?? null }),
    }).select().single();

    if (error || !booking) {
      return NextResponse.json({ success: false, message: "Failed to save booking." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        userId: booking.user_id,
        serviceName: finalServiceName,
        bookingDate: booking.booking_date,
        bookingTime: booking.booking_time,
        amount: booking.payment_amount,
        paymentStatus: booking.payment_status,
        createdAt: booking.created_at,
      },
      razorpayOrder,
    }, { status: 201 });
  } catch (err) {
    console.error("[bookings/create]", err);
    return NextResponse.json({ success: false, message: "Failed to create booking." }, { status: 500 });
  }
}
