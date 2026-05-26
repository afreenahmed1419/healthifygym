import { Request, Response } from "express";
import { createOrder, verifySignature, verifyWebhookSignature } from "../services/RazorpayService";
import {
  createPaymentRecord,
  confirmBookingPayment,
  markOwnerNotified,
  getPaymentsByUser,
  getUserById,
} from "../services/SupabaseService";
import { notifyBookingConfirmed } from "../services/NotificationService";
import type { CreatePaymentOrderBody, VerifyPaymentBody } from "../types";
import { env } from "../config/env";

export async function createPaymentOrder(req: Request, res: Response): Promise<void> {
  try {
    const { amount, purpose } = req.body as CreatePaymentOrderBody;

    const order = await createOrder(amount, purpose, req.user!.userId);
    if (!order) {
      res.status(503).json({ success: false, message: "Payment service unavailable. Please try again." });
      return;
    }

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: env.razorpayKeyId,
      },
    });
  } catch (err) {
    console.error("[createPaymentOrder]", err);
    res.status(500).json({ success: false, message: "Failed to create payment order." });
  }
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body as VerifyPaymentBody;

    const valid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!valid) {
      res.status(400).json({ success: false, message: "Payment verification failed. Invalid signature." });
      return;
    }

    const booking = await confirmBookingPayment(razorpayOrderId, razorpayPaymentId);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found for this payment." });
      return;
    }

    await createPaymentRecord(req.user!.userId, booking.id, razorpayPaymentId, booking.payment_amount);

    const user = await getUserById(req.user!.userId);
    if (user) {
      notifyBookingConfirmed(booking, user)
        .then(() => markOwnerNotified(booking.id))
        .catch(console.error);
    }

    res.json({ success: true, message: "Payment verified and booking confirmed." });
  } catch (err) {
    console.error("[verifyPayment]", err);
    res.status(500).json({ success: false, message: "Failed to verify payment." });
  }
}

export async function listPayments(req: Request, res: Response): Promise<void> {
  try {
    const payments = await getPaymentsByUser(req.user!.userId);
    res.json({ success: true, data: payments });
  } catch (err) {
    console.error("[listPayments]", err);
    res.status(500).json({ success: false, message: "Failed to fetch payments." });
  }
}

export async function razorpayWebhook(req: Request, res: Response): Promise<void> {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;
    const rawBody = req.body instanceof Buffer ? req.body.toString() : JSON.stringify(req.body);

    if (!verifyWebhookSignature(rawBody, signature)) {
      res.status(400).json({ success: false, message: "Invalid webhook signature." });
      return;
    }

    const event = req.body as {
      event: string;
      payload: {
        payment: {
          entity: {
            id: string;
            order_id: string;
            amount: number;
            method: string;
          };
        };
      };
    };

    if (event.event === "payment.captured") {
      const { id: paymentId, order_id: orderId, amount, method } = event.payload.payment.entity;

      const booking = await confirmBookingPayment(orderId, paymentId);
      if (booking) {
        const validMethods = ["upi", "card", "netbanking", "wallet"] as const;
        const paymentMethod = validMethods.includes(method as typeof validMethods[number])
          ? (method as typeof validMethods[number])
          : "upi";

        await createPaymentRecord(booking.user_id, booking.id, paymentId, amount, paymentMethod);

        const user = await getUserById(booking.user_id);
        if (user) {
          notifyBookingConfirmed(booking, user)
            .then(() => markOwnerNotified(booking.id))
            .catch(console.error);
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("[razorpayWebhook]", err);
    res.status(500).json({ success: false });
  }
}
