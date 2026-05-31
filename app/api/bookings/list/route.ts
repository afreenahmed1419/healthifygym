import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { verifyJWT } from "@/lib/jwt.server";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const user = verifyJWT(auth.replace("Bearer ", "").trim());
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

    const params = req.nextUrl.searchParams;
    const limit = Math.min(parseInt(params.get("limit") ?? "10"), 50);
    const offset = parseInt(params.get("offset") ?? "0");
    const status = params.get("status");

    const db = getAdminClient();
    let query = db.from("bookings")
      .select("*", { count: "exact" })
      .eq("user_id", user.userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("payment_status", status as "pending" | "completed" | "failed");

    const { data, count, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, bookings: data ?? [], total: count ?? 0 });
  } catch (err) {
    console.error("[bookings/list]", err);
    return NextResponse.json({ success: false, message: "Failed to fetch bookings." }, { status: 500 });
  }
}
