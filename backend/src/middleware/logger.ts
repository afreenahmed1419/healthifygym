import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  if (!env.isDev) {
    next();
    return;
  }

  const start = Date.now();
  const { method, originalUrl } = req;

  res.on("finish", () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 500 ? "\x1b[31m" : status >= 400 ? "\x1b[33m" : "\x1b[32m";
    console.log(`${color}${method} ${originalUrl} ${status}\x1b[0m — ${ms}ms`);
  });

  next();
}
