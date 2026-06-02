import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { verifyRazorpaySignature, verifyRazorpayWebhook } from "@/lib/razorpay.server";
import { getAdminClient } from "@/lib/supabase";
import { sendOwnerBookingNotification, sendUserBookingConfirmation } from "@/lib/msg91";

export async function POST(req: NextRequest) {
  const webhookSig = req.headers.get("x-razorpay-signature");

  if (webhookSig) {
    // ── Razorpay webhook (verified by signature — no user context needed) ──
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
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json() as {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  };

  if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    return NextResponse.json({ success: false, message: "Payment verification failed. Invalid signature." }, { status: 400 });
  }

  // Verify the booking belongs to this authenticated user before confirming
  const db = getAdminClient();
  const { data: bookingCheck } = await db
    .from("bookings")
    .select("id, user_id")
    .eq("razorpay_payment_id", razorpayOrderId)
    .single();

  if (!bookingCheck) {
    return NextResponse.json({ success: false, message: "Booking not found." }, { status: 404 });
  }

  if (bookingCheck.user_id !== user.userId) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
  }

  const booking = await confirmPayment(razorpayOrderId, razorpayPaymentId, null, "upi", user.userId);
  if (!booking) {
    return NextResponse.json({ success: false, message: "Failed to confirm booking." }, { status: 500 });
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
    let userWhatsapp = userData.whatsapp_number;
    try {
      const notes = JSON.parse(booking.notes ?? "{}") as { whatsapp?: string };
      if (notes.whatsapp) userWhatsapp = notes.whatsapp;
    } catch { /* use default */ }

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
      sendUserBookingConfirmation(userWhatsapp, {
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
