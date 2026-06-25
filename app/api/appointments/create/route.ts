import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { sanitizeString, sanitizePhone } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json() as { name?: string; phone?: string; message?: string; company?: string };

    // Honeypot — a hidden field humans never see; if it's filled, it's a bot. Pretend success.
    if (typeof raw.company === "string" && raw.company.trim() !== "") {
      return NextResponse.json({ success: true, appointment: { id: "ok" } }, { status: 201 });
    }

    const name = raw.name ? sanitizeString(raw.name) : undefined;
    const phone = raw.phone ? sanitizePhone(raw.phone) : undefined;
    const message = raw.message ? sanitizeString(raw.message) : undefined;

    const db = getAdminClient();

    const fullName = name || null;
    const whatsappNumber = phone || null;

    const { data: appointment, error } = await db.from("appointments").insert({
      user_id: null,
      full_name: fullName,
      whatsapp_number: whatsappNumber,
      message: message ?? null,
      whatsapp_link_sent: false,
      owner_response_status: "pending",
    }).select().single();

    if (error || !appointment) {
      return NextResponse.json({ success: false, message: "Failed to create appointment." }, { status: 500 });
    }

    const ownerPhone = (process.env.OWNER_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
    const text = `Hi! I'd like to visit Healthify gym. When are you available? - ${fullName ?? whatsappNumber}`;
    const whatsappLink = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(text)}`;

    return NextResponse.json({
      success: true,
      appointment: { id: appointment.id, userId: appointment.user_id, whatsappLink },
    }, { status: 201 });
  } catch (err) {
    console.error("[appointments/create]", err);
    return NextResponse.json({ success: false, message: "Failed to create appointment." }, { status: 500 });
  }
}
