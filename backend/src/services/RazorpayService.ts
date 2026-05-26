import crypto from "crypto";
import { getRazorpay } from "../config/razorpay";
import { env } from "../config/env";

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export async function createOrder(
  amountInPaise: number,
  purpose: string,
  userId: string
): Promise<RazorpayOrder | null> {
  const razorpay = getRazorpay();
  if (!razorpay) {
    console.error("[Razorpay] Client not initialized — keys missing.");
    return null;
  }

  try {
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `healthify_${userId.slice(0, 8)}_${Date.now()}`,
      notes: { purpose, userId },
    });

    return {
      id: order.id,
      amount: amountInPaise,
      currency: "INR",
      receipt: order.receipt ?? "",
      status: order.status,
    };
  } catch (err) {
    console.error("[Razorpay] Order creation failed:", err);
    return null;
  }
}

export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = env.razorpayKeySecret;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expected === signature;
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = env.razorpayWebhookSecret;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return expected === signature;
}
