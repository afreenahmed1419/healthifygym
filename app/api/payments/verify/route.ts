import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:5000";

export async function POST(req: NextRequest) {
  const body = await req.text();

  const res = await fetch(`${BACKEND}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
