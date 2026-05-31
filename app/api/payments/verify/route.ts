import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt.server";
import { verifyRazorpaySignature, verifyRazorpayWebhook } from "@/lib/razorpay.server";
import { getAdminClient } from "@/lib/supabase";
import { sendOwnerBookingNotification, sendUserBookingConfirmation } from "@/lib/msg91";

export async function POST(req: NextRequest) {
  const webhookSig = req.headers.get("x-razorpay-signature");

  if (webhookSig) {
    // ── Razorpay webhook ──────────────────────────────────────────────
    const rawBody = await req.text();
    if (!verifyRazorpayWebhook(rawBody, webhookSig)) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    const event = JSON.parse(rawBody) as {
      event: string;
      payload: { payment: { entity: { id: string; order_id: string; amount: number; method: string } } };
    };
    if (event.event === "payment.captured") {
      const { id: paymentId, order_id: orderId, amount, method } = event.payload.payment.entity;
      await confirmPayment(orderId, paymentId, amount, method, null);
    }
    return NextResponse.json({ success: true });
  }

  // ── Client-side verification ──────────────────────────────────────
  const auth = req.headers.get("Authorization") ?? "";
  const user = verifyJWT(auth.replace("Bearer ", "").trim());
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json() as {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  };

  if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    return NextResponse.json({ success: false, message: "Payment verification failed. Invalid signature." }, { status: 400 });
  }

  const booking = await confirmPayment(razorpayOrderId, razorpayPaymentId, null, "upi", user.userId);
  if (!booking) {
    return NextResponse.json({ success: false, message: "Booking not found for this payment." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Payment verified and booking confirmed." });
}

async function confirmPayment(
  orderId: string,
  paymentId: string,
  amount: number | null,
  method: string,
  userId: string | null
) {
  const db = getAdminClient();

  const { data: booking } = await db
    .from("bookings")
    .update({ payment_status: "completed", razorpay_payment_id: paymentId })
    .eq("razorpay_payment_id", orderId)
    .select()
    .single();

  if (!booking) return null;

  const finalUserId = userId ?? booking.user_id;
  const validMethods = ["upi", "card", "netbanking", "wallet"];

  await db.from("payments").insert({
    user_id: finalUserId,
    booking_id: booking.id,
    razorpay_payment_id: paymentId,
    amount: amount ?? booking.payment_amount,
    status: "captured",
    method: (validMethods.includes(method) ? method : "upi") as "upi" | "card" | "netbanking" | "wallet",
    owner_notified: false,
  });

  const { data: userData } = await db.from("users").select("*").eq("id", finalUserId).single();
  if (userData) {
    Promise.allSettled([
      sendOwnerBookingNotification({
        userName: userData.name,
        userPhone: userData.whatsapp_number,
        serviceName: booking.service_name,
        date: booking.booking_date,
        time: booking.booking_time,
        amountPaise: booking.payment_amount,
        bookingId: booking.id,
      }),
      sendUserBookingConfirmation(userData.whatsapp_number, {
        serviceName: booking.service_name,
        date: booking.booking_date,
        time: booking.booking_time,
        bookingId: booking.id,
      }),
    ]).then(() =>
      db.from("bookings").update({ owner_notified: true }).eq("id", booking.id)
    ).catch(console.error);
  }

  return booking;
}
