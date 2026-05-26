import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} →`, err.message);

  if (res.headersSent) return;

  res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again.",
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
}
