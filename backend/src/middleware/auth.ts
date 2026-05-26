import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { JWTPayload } from "../types";

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return;
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret) as JWTPayload;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      req.user = jwt.verify(token, env.jwtSecret) as JWTPayload;
    } catch {
      // Invalid token — continue unauthenticated
    }
  }
  next();
}
