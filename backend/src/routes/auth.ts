import { Router } from "express";
import { body } from "express-validator";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validation";
import { getProfile, updateProfile, sendOTP, verifyOTP } from "../controllers/authController";

const router = Router();

// POST /api/auth/send-otp — send OTP to WhatsApp
router.post("/send-otp", [
  body("whatsappNumber").isString().trim().notEmpty(),
], validate, sendOTP);

// POST /api/auth/verify-otp — verify OTP and login
router.post("/verify-otp", [
  body("whatsappNumber").isString().trim().notEmpty(),
  body("otp").isString().trim().isLength({ min: 6, max: 6 }),
], validate, verifyOTP);

// GET /api/auth/me — get current user profile
router.get("/me", authenticateToken, getProfile);

// PATCH /api/auth/me — update name / email
router.patch(
  "/me",
  authenticateToken,
  [
    body("name").optional().isString().trim().isLength({ min: 2, max: 100 }),
    body("email").optional().isEmail().normalizeEmail(),
  ],
  validate,
  updateProfile
);

export default router;
