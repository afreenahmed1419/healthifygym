import "./config/env"; // Load & validate env vars first
import express from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./routes/auth";
import bookingRoutes from "./routes/bookings";
import paymentRoutes from "./routes/payments";
import appointmentRoutes from "./routes/appointments";
import faqRoutes from "./routes/faqs";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";
import whatsappRoutes from "./routes/whatsapp";
import contactRoutes from "./routes/contact";

const app = express();

// ─── Request logger ───────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: env.frontendUrl,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ─── Body parsers ─────────────────────────────────────────────────────────────
// Webhook route needs raw body for signature verification
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "healthify-backend",
    env: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/contact", contactRoutes);

// ─── 404 + Error handlers ────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(env.port, () => {
  console.log(`✓ Healthify backend  →  http://localhost:${env.port}`);
  console.log(`  Environment: ${env.nodeEnv}`);
  console.log(`  CORS origin: ${env.frontendUrl}`);
});

export default app;
