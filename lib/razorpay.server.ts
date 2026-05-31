import crypto from "crypto";

export async function createRazorpayOrder(amountPaise: number, purpose: string, userId: string) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error("[Razorpay] Keys not configured.");
    return null;
  }
  try {
    const Razorpay = (await import("razorpay")).default;
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `h_${userId.slice(0, 8)}_${Date.now()}`,
      notes: { purpose, userId },
    });
    return { id: order.id, amount: amountPaise, currency: "INR" };
  } catch (err) {
    console.error("[Razorpay] Order creation failed:", err);
    return null;
  }
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return expected === signature;
}

export function verifyRazorpayWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return expected === signature;
}
