import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "healthify-jwt-secret-change-in-prod";

export interface JWTPayload {
  userId: string;
  whatsappNumber: string;
  iat?: number;
  exp?: number;
}

export function generateJWT(userId: string, whatsappNumber: string, expiresIn = "30d"): string {
  return jwt.sign({ userId, whatsappNumber }, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
