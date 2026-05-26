import { getDB } from "../config/database";
import type { User, Booking, Appointment, Payment, FAQ } from "../types";

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUserById(userId: string): Promise<User | null> {
  const { data } = await getDB().from("users").select("*").eq("id", userId).single();
  return data ?? null;
}

export async function getUserByPhone(whatsappNumber: string): Promise<User | null> {
  const { data } = await getDB().from("users").select("*").eq("whatsapp_number", whatsappNumber).single();
  return data ?? null;
}

export async function createUser(whatsappNumber: string): Promise<User | null> {
  const { data } = await getDB()
    .from("users")
    .insert({
      whatsapp_number: whatsappNumber,
      otp_verified: true,
      verified_at: new Date().toISOString(),
    })
    .select()
    .single();
  return data ?? null;
}

export async function updateUser(userId: string, updates: Partial<Pick<User, "name" | "email" | "otp_verified" | "verified_at">>): Promise<User | null> {
  const { data } = await getDB()
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  return data ?? null;
}

// ─── OTP Tokens ───────────────────────────────────────────────────────────────

export async function createOTPToken(whatsappNumber: string, otpHash: string, expiresAt: string): Promise<void> {
  // Invalidate existing tokens
  await getDB()
    .from("otp_tokens")
    .update({ used: true })
    .eq("whatsapp_number", whatsappNumber)
    .eq("used", false);

  // Create new token
  await getDB().from("otp_tokens").insert({
    whatsapp_number: whatsappNumber,
    otp_hash: otpHash,
    expires_at: expiresAt,
  });
}

export async function getValidOTPToken(whatsappNumber: string, otpHash: string): Promise<any | null> {
  const { data } = await getDB()
    .from("otp_tokens")
    .select("*")
    .eq("whatsapp_number", whatsappNumber)
    .eq("otp_hash", otpHash)
    .eq("used", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return data ?? null;
}

export async function consumeOTPToken(tokenId: string): Promise<void> {
  await getDB().from("otp_tokens").update({ used: true }).eq("id", tokenId);
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function getBookingsByUser(
  userId: string,
  options: { limit?: number; offset?: number; status?: string } = {}
): Promise<{ bookings: Booking[]; total: number }> {
  const { limit = 10, offset = 0, status } = options;

  let query = getDB()
    .from("bookings")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("payment_status", status);

  const { data, count } = await query;
  return { bookings: data ?? [], total: count ?? 0 };
}

export async function createBooking(
  userId: string,
  input: {
    service_name: string;
    booking_date: string;
    booking_time: string;
    payment_amount: number;
    razorpay_payment_id?: string;
    notes?: string;
  }
): Promise<Booking | null> {
  const { data } = await getDB()
    .from("bookings")
    .insert({
      user_id: userId,
      service_name: input.service_name,
      booking_date: input.booking_date,
      booking_time: input.booking_time,
      payment_amount: input.payment_amount,
      razorpay_payment_id: input.razorpay_payment_id ?? null,
      payment_status: "pending",
      owner_notified: false,
      notes: input.notes ?? null,
    })
    .select()
    .single();
  return data ?? null;
}

export async function cancelBooking(bookingId: string, userId: string): Promise<boolean> {
  const { error } = await getDB()
    .from("bookings")
    .update({ payment_status: "failed" })
    .eq("id", bookingId)
    .eq("user_id", userId);
  return !error;
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export async function getAppointmentsByUser(userId: string): Promise<Appointment[]> {
  const { data } = await getDB()
    .from("appointments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createAppointment(
  userId: string,
  input: {
    full_name?: string | null;
    whatsapp_number?: string | null;
    message?: string | null;
    preferred_branch?: string | null;
  }
): Promise<Appointment | null> {
  const { data } = await getDB()
    .from("appointments")
    .insert({
      user_id: userId,
      full_name: input.full_name ?? null,
      whatsapp_number: input.whatsapp_number ?? null,
      message: input.message ?? null,
      preferred_branch: input.preferred_branch ?? null,
      whatsapp_link_sent: false,
      owner_response_status: "pending",
    })
    .select()
    .single();
  return data ?? null;
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function createPaymentRecord(
  userId: string,
  bookingId: string | null,
  razorpayPaymentId: string,
  amount: number,
  method: "upi" | "card" | "netbanking" | "wallet" = "upi",
  metadata?: Record<string, unknown>
): Promise<Payment | null> {
  const { data } = await getDB()
    .from("payments")
    .insert({
      user_id: userId,
      booking_id: bookingId,
      razorpay_payment_id: razorpayPaymentId,
      amount,
      status: "captured",
      method,
      owner_notified: false,
      metadata: metadata ?? null,
    })
    .select()
    .single();
  return data ?? null;
}

// Called in webhook: find booking by stored order ID, flip it to payment ID + mark completed
export async function confirmBookingPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string
): Promise<Booking | null> {
  const { data } = await getDB()
    .from("bookings")
    .update({
      payment_status: "completed",
      razorpay_payment_id: razorpayPaymentId,
    })
    .eq("razorpay_payment_id", razorpayOrderId)
    .select()
    .single();
  return data ?? null;
}

export async function markOwnerNotified(bookingId: string): Promise<void> {
  await getDB().from("bookings").update({ owner_notified: true }).eq("id", bookingId);
}

export async function getPaymentsByUser(userId: string): Promise<Payment[]> {
  const { data } = await getDB()
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export async function getActiveFAQs(): Promise<FAQ[]> {
  const { data } = await getDB()
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
  const { data } = await getDB()
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .eq("category", category)
    .order("sort_order");
  return data ?? [];
}
