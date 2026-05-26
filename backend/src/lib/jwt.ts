import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JWTPayload {
  userId: string;
  whatsappNumber: string;
  iat: number;
  exp: number;
}

export function generateJWT(userId: string, whatsappNumber: string, expiresIn = "30d"): string {
  return jwt.sign({ userId, whatsappNumber }, env.jwtSecret, { expiresIn } as jwt.SignOptions);
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, env.jwtSecret) as JWTPayload;
  } catch {
    return null;
  }
}