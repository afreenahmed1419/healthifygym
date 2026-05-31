import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt.server";
import { createRazorpayOrder } from "@/lib/razorpay.server";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const user = verifyJWT(auth.replace("Bearer ", "").trim());
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

    const { amount, purpose } = await req.json() as { amount: number; purpose: string };

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
