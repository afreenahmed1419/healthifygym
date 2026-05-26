import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:5000";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("Authorization") ?? "";
  const body = await req.text();

  const res = await fetch(`${BACKEND}/api/whatsapp/incoming`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: auth },
    body,
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
