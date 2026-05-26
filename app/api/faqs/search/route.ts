import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:5000";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.toString();
  const url = `${BACKEND}/api/faqs/search${search ? `?${search}` : ""}`;

  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
