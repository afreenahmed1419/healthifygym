import { NextResponse } from "next/server";

// This endpoint is no longer used — WhatsApp notifications are handled
// directly via Fast2SMS in lib/msg91.ts and verify-otp/route.ts
export async function POST() {
  return NextResponse.json({ success: false, message: "Endpoint deprecated." }, { status: 410 });
}
