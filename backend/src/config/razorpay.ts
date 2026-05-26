import Razorpay from "razorpay";
import { env } from "./env";

let _client: Razorpay | null = null;

export function getRazorpay(): Razorpay | null {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) return null;
  if (_client) return _client;
  _client = new Razorpay({
    key_id: env.razorpayKeyId,
    key_secret: env.razorpayKeySecret,
  });
  return _client;
}
