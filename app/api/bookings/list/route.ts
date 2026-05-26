import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:5000";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("Authorization") ?? "";
  const search = req.nextUrl.searchParams.toString();
  const url = `${BACKEND}/api/bookings/list${search ? `?${search}` : ""}`;

  const res = await fetch(url, {
    headers: { Authorization: auth },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
