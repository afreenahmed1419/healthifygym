import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getAdminClient } from "@/lib/supabase";

function computeExpiry(serviceName: string, bookingDate: string): Date | null {
  if (serviceName === "Lifetime Membership") return null;
  const d = new Date(bookingDate);
  if (serviceName.includes("Yearly"))      { d.setFullYear(d.getFullYear() + 1); return d; }
  if (serviceName.includes("Half Yearly")) { d.setMonth(d.getMonth() + 6);       return d; }
  if (serviceName.includes("Quarterly"))   { d.setMonth(d.getMonth() + 3);       return d; }
  if (serviceName.includes("Monthly"))     { d.setMonth(d.getMonth() + 1);       return d; }
  if (serviceName === "Drop-In Pass (Daily)") { d.setDate(d.getDate() + 1);      return d; }
  return d;
}

export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  const db = getAdminClient();
  const { data: bookings } = await db
    .from("bookings")
    .select("id, service_name, booking_date, created_at")
    .eq("user_id", user.userId)
    .eq("payment_status", "completed")
    .neq("service_name", "Drop-In Pass (Daily)")
    .order("created_at", { ascending: false });

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ activeMembership: null, hasLifetime: false });
  }

  const now = new Date();
  const lifetime = bookings.find((b: { service_name: string }) => b.service_name === "Lifetime Membership") ?? null;

  // Most recent non-expired, non-lifetime plan
  const activePlan = bookings.find((b: { service_name: string; booking_date: string }) => {
    if (b.service_name === "Lifetime Membership") return false;
    const exp = computeExpiry(b.service_name, b.booking_date);
    return exp !== null && exp > now;
  }) ?? null;

  // Prefer active subscription over lifetime-only
  const result = activePlan ?? lifetime;
  if (!result) {
    return NextResponse.json({ activeMembership: null, hasLifetime: !!lifetime });
  }

  const expiresAt = result.service_name === "Lifetime Membership"
    ? null
    : computeExpiry(result.service_name, result.booking_date)?.toISOString() ?? null;

  return NextResponse.json({
    activeMembership: {
      id: result.id,
      serviceName: result.service_name,
      startDate: result.booking_date,
      expiresAt,
      isLifetime: result.service_name === "Lifetime Membership",
    },
    hasLifetime: !!lifetime,
  });
}
