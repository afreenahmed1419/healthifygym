import { Router } from "express";
import { body } from "express-validator";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validation";
import {
  createPaymentOrder,
  verifyPayment,
  listPayments,
  razorpayWebhook,
} from "../controllers/paymentController";

const router = Router();

// POST /api/payments/webhook — Razorpay server-to-server webhook (raw body, no auth)
router.post("/webhook", razorpayWebhook);

// All routes below require authentication
router.use(authenticateToken);

// POST /api/payments/verify — verify Razorpay payment after checkout
router.post(
  "/verify",
  [
    body("razorpayOrderId").isString().notEmpty(),
    body("razorpayPaymentId").isString().notEmpty(),
    body("razorpaySignature").isString().notEmpty(),
  ],
  validate,
  verifyPayment
);

// GET /api/payments — list user's payments
router.get("/", listPayments);

// POST /api/payments/order — create Razorpay order
router.post(
  "/order",
  [
    body("amount").isInt({ min: 1 }).withMessage("Amount must be a positive integer (in paise)."),
    body("purpose").isString().trim().notEmpty().withMessage("Payment purpose is required."),
    body("metadata").optional().isObject(),
  ],
  validate,
  createPaymentOrder
);

export default router;
