import { Request, Response } from "express";
import { getBookingsByUser, createBooking } from "../services/SupabaseService";
import { createOrder } from "../services/RazorpayService";
import type { CreateBookingBody } from "../types";

export async function listBookings(req: Request, res: Response): Promise<void> {
  try {
    const limit = Math.min(parseInt(req.query["limit"] as string) || 10, 50);
    const offset = parseInt(req.query["offset"] as string) || 0;
    const status = req.query["status"] as string | undefined;

    const { bookings, total } = await getBookingsByUser(req.user!.userId, { limit, offset, status });

    res.json({ success: true, bookings, total });
  } catch (err) {
    console.error("[listBookings]", err);
    res.status(500).json({ success: false, message: "Failed to fetch bookings." });
  }
}

export async function createBookingHandler(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as CreateBookingBody;
    const userId = req.user!.userId;

    // Validate date is today or future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(body.bookingDate);
    if (isNaN(bookingDate.getTime()) || bookingDate < today) {
      res.status(400).json({ success: false, message: "Booking date must be today or in the future." });
      return;
    }

    // Validate time format HH:MM
    if (!/^\d{2}:\d{2}$/.test(body.bookingTime)) {
      res.status(400).json({ success: false, message: "Booking time must be in HH:MM format." });
      return;
    }

    // Validate amount (in paise: > 0, <= ₹10,000)
    if (!body.amount || body.amount <= 0 || body.amount > 1000000) {
      res.status(400).json({ success: false, message: "Amount must be between ₹1 and ₹10,000." });
      return;
    }

    // Create Razorpay order
    const razorpayOrder = await createOrder(body.amount, body.serviceName, userId);
    if (!razorpayOrder) {
      res.status(500).json({ success: false, message: "Failed to create payment order. Please try again." });
      return;
    }

    // Insert booking in Supabase
    const booking = await createBooking(userId, {
      service_name: body.serviceName,
      booking_date: body.bookingDate,
      booking_time: body.bookingTime,
      payment_amount: body.amount,
      razorpay_payment_id: razorpayOrder.id,
      notes: body.notes,
    });

    if (!booking) {
      res.status(500).json({ success: false, message: "Failed to save booking. Please try again." });
      return;
    }

    res.status(201).json({
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
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (err) {
    console.error("[createBooking]", err);
    res.status(500).json({ success: false, message: "Failed to create booking." });
  }
}

export async function cancelBookingHandler(req: Request, res: Response): Promise<void> {
  res.status(400).json({ success: false, message: "Cancellations must be requested via WhatsApp or in-person." });
}
