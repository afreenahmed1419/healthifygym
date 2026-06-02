import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./jwt.server";

export type AuthUser = { userId: string; whatsappNumber: string };

export function requireAuth(req: NextRequest): { user: AuthUser } | { error: NextResponse } {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  if (!token) {
    return {
      error: NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 }),
    };
  }

  const user = verifyJWT(token);
  if (!user) {
    return {
      error: NextResponse.json({ success: false, message: "Invalid or expired session. Please log in again." }, { status: 401 }),
    };
  }

  return { user };
}
