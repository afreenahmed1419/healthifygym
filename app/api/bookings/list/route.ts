import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  try {
    const authResult = requireAuth(req);
    if ("error" in authResult) return authResult.error;
    const { user } = authResult;

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
