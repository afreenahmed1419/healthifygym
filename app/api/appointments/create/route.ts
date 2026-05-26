import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:5000";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("Authorization") ?? "";
  const body = await req.text();

  const res = await fetch(`${BACKEND}/api/appointments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: auth },
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
