import { supabase, getAdminClient } from "./supabase";
import type { Database } from "./database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"];
type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
type AppointmentInsert = Database["public"]["Tables"]["appointments"]["Insert"];
type FaqRow = Database["public"]["Tables"]["faqs"]["Row"];

// ─── Users ──────────────────────────────────────────────────────────────────

export async function getUserByPhone(phone: string): Promise<UserRow | null> {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("whatsapp_number", phone)
    .single();
  return data ?? null;
}

export async function getUserById(id: string): Promise<UserRow | null> {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  return data ?? null;
}

// ─── FAQs ────────────────────────────────────────────────────────────────────

export async function getActiveFAQs(category?: string): Promise<FaqRow[]> {
  let query = supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (category) query = query.eq("category", category);

  const { data } = await query;
  return data ?? [];
}

export async function searchFAQs(keyword: string): Promise<FaqRow[]> {
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .or(`question.ilike.%${keyword}%,answer.ilike.%${keyword}%`);
  return data ?? [];
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export async function getUserBookings(userId: string): Promise<BookingRow[]> {
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .order("booking_date", { ascending: false });
  return data ?? [];
}

export async function createBooking(
  booking: Database["public"]["Tables"]["bookings"]["Insert"]
): Promise<BookingRow | null> {
  const db = getAdminClient();
  const { data, error } = await db
    .from("bookings")
    .insert(booking)
    .select()
    .single();
  if (error) console.error("[createBooking]", error.message);
  return data ?? null;
}

// ─── Appointments (Contact form) ─────────────────────────────────────────────

export async function createAppointment(
  appt: AppointmentInsert
): Promise<boolean> {
  const { error } = await supabase.from("appointments").insert(appt);
  if (error) console.error("[createAppointment]", error.message);
  return !error;
}

// ─── Connection health check ──────────────────────────────────────────────────

export async function checkDBConnection(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const { error } = await supabase
      .from("faqs")
      .select("id")
      .limit(1);
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: "Supabase connection healthy." };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
