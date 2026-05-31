import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { verifyJWT } from "@/lib/jwt.server";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const user = verifyJWT(auth.replace("Bearer ", "").trim());
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

    const { message } = await req.json() as { message?: string };

    const db = getAdminClient();

    const { data: userData } = await db.from("users").select("*").eq("id", user.userId).single();
    if (!userData) return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });

    const { data: appointment, error } = await db.from("appointments").insert({
      user_id: user.userId,
      full_name: userData.name ?? null,
      whatsapp_number: userData.whatsapp_number,
      message: message ?? null,
      whatsapp_link_sent: false,
      owner_response_status: "pending",
    }).select().single();

    if (error || !appointment) {
      return NextResponse.json({ success: false, message: "Failed to create appointment." }, { status: 500 });
    }

    const ownerPhone = (process.env.OWNER_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
    const text = `Hi! I'd like to visit Healthify gym. When are you available? - ${userData.name ?? userData.whatsapp_number}`;
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
