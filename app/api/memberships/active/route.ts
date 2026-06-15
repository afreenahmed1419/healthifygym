import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { validatePhoneNumber, formatIndianPhone } from "@/lib/auth";

function stripMembershipSuffix(name: string): string {
  return name.replace(" + Lifetime Membership", "");
}

function computeExpiry(serviceName: string, bookingDate: string): Date | null {
  const name = stripMembershipSuffix(serviceName);
  if (name === "Lifetime Membership") return null;
  const d = new Date(bookingDate);
  if (name.includes("Yearly"))      { d.setFullYear(d.getFullYear() + 1); return d; }
  if (name.includes("Half Yearly")) { d.setMonth(d.getMonth() + 6);       return d; }
  if (name.includes("Quarterly"))   { d.setMonth(d.getMonth() + 3);       return d; }
  if (name.includes("Monthly"))     { d.setMonth(d.getMonth() + 1);       return d; }
  if (name === "Drop-In Pass (Daily)") { d.setDate(d.getDate() + 1);      return d; }
  return d;
}

export async function GET(req: NextRequest) {
  // Public, phone-keyed lookup — no login. The phone acts only as a lookup key.
  const phoneParam = req.nextUrl.searchParams.get("phone") ?? "";
  if (!validatePhoneNumber(phoneParam)) {
    return NextResponse.json({ activeMembership: null, hasLifetime: false });
  }
  const phone = formatIndianPhone(phoneParam);

  const db = getAdminClient();
  const { data: userRow } = await db
    .from("users")
    .select("id")
    .eq("whatsapp_number", phone)
    .single();

  if (!userRow) {
    return NextResponse.json({ activeMembership: null, hasLifetime: false });
  }

  const { data: bookings } = await db
    .from("bookings")
    .select("id, service_name, booking_date, created_at")
    .eq("user_id", userRow.id)
    .eq("payment_status", "completed")
    .neq("service_name", "Drop-In Pass (Daily)")
    .order("created_at", { ascending: false });

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ activeMembership: null, hasLifetime: false });
  }

  const now = new Date();
  // Lifetime detected from standalone booking OR bundled purchase
  const hasLifetime = bookings.some((b: { service_name: string }) =>
    b.service_name === "Lifetime Membership" || b.service_name.includes("+ Lifetime Membership")
  );
  const lifetime = bookings.find((b: { service_name: string }) =>
    b.service_name === "Lifetime Membership" || b.service_name.includes("+ Lifetime Membership")
  ) ?? null;

  // Most recent non-expired, non-lifetime plan
  const activePlan = bookings.find((b: { service_name: string; booking_date: string }) => {
    const base = stripMembershipSuffix(b.service_name);
    if (base === "Lifetime Membership") return false;
    const exp = computeExpiry(b.service_name, b.booking_date);
    return exp !== null && exp > now;
  }) ?? null;

  const result = activePlan ?? lifetime;
  if (!result) {
    return NextResponse.json({ activeMembership: null, hasLifetime });
  }

  const baseName = stripMembershipSuffix(result.service_name);
  const isLifetimeOnly = baseName === "Lifetime Membership";
  const expiresAt = isLifetimeOnly
    ? null
    : computeExpiry(result.service_name, result.booking_date)?.toISOString() ?? null;

  return NextResponse.json({
    activeMembership: {
      id: result.id,
      serviceName: result.service_name,
      startDate: result.booking_date,
      expiresAt,
      isLifetime: isLifetimeOnly,
    },
    hasLifetime,
  });
}
