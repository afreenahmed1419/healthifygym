import jwt from "jsonwebtoken";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set.");
  return secret;
}

export interface JWTPayload {
  userId: string;
  whatsappNumber: string;
  iat?: number;
  exp?: number;
}

export function generateJWT(userId: string, whatsappNumber: string, expiresIn = "72h"): string {
  return jwt.sign({ userId, whatsappNumber }, getSecret(), { expiresIn } as jwt.SignOptions);
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getSecret()) as JWTPayload;
  } catch {
    return null;
  }
}
