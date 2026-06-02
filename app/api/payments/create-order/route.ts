import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { createRazorpayOrder } from "@/lib/razorpay.server";
import { sanitizeString } from "@/lib/sanitize";

// Same price list as bookings/create — single source of truth
const MEMBERSHIP_PRICES: Record<string, number> = {
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
  "Lifetime Membership":  300000,
  "Drop-In Pass (Daily)":  25000,
};

export async function POST(req: NextRequest) {
  try {
    const authResult = requireAuth(req);
    if ("error" in authResult) return authResult.error;
    const { user } = authResult;

    const raw = await req.json() as { purpose: string };
    const purpose = sanitizeString(raw.purpose);

    // Look up correct price server-side — never trust client amount
    const amount = MEMBERSHIP_PRICES[purpose];
    if (!amount) {
      return NextResponse.json({ success: false, message: "Invalid service selected." }, { status: 400 });
    }

    const order = await createRazorpayOrder(amount, purpose, user.userId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Payment service unavailable. Please try again." }, { status: 503 });
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    }, { status: 201 });
  } catch (err) {
    console.error("[payments/create-order]", err);
    return NextResponse.json({ success: false, message: "Failed to create payment order." }, { status: 500 });
  }
}
