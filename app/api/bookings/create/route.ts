import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { verifyJWT } from "@/lib/jwt.server";
import { createRazorpayOrder } from "@/lib/razorpay.server";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const user = verifyJWT(auth.replace("Bearer ", "").trim());
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

    const body = await req.json() as {
      serviceName: string;
      bookingDate: string;
      bookingTime: string;
      amount: number;
      whatsappNumber?: string;
      notes?: string;
    };

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(body.bookingDate);
    if (isNaN(bookingDate.getTime()) || bookingDate < today) {
      return NextResponse.json({ success: false, message: "Booking date must be today or in the future." }, { status: 400 });
    }

    if (!/^\d{2}:\d{2}$/.test(body.bookingTime)) {
      return NextResponse.json({ success: false, message: "Booking time must be in HH:MM format." }, { status: 400 });
    }

    if (!body.amount || body.amount <= 0 || body.amount > 1000000) {
      return NextResponse.json({ success: false, message: "Amount must be between ₹1 and ₹10,000." }, { status: 400 });
    }

    const razorpayOrder = await createRazorpayOrder(body.amount, body.serviceName, user.userId);
    if (!razorpayOrder) {
      return NextResponse.json({ success: false, message: "Failed to create payment order. Please try again." }, { status: 500 });
    }

    const db = getAdminClient();
    const { data: booking, error } = await db.from("bookings").insert({
      user_id: user.userId,
      service_name: body.serviceName,
      booking_date: body.bookingDate,
      booking_time: body.bookingTime,
      payment_amount: body.amount,
      razorpay_payment_id: razorpayOrder.id,
      payment_status: "pending",
      owner_notified: false,
      notes: JSON.stringify({ whatsapp: body.whatsappNumber ?? null, extra: body.notes ?? null }),
    }).select().single();

    if (error || !booking) {
      return NextResponse.json({ success: false, message: "Failed to save booking." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        userId: booking.user_id,
        serviceName: booking.service_name,
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
