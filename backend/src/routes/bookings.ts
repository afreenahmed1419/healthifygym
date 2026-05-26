import { Router } from "express";
import { body } from "express-validator";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validation";
import { listBookings, createBookingHandler } from "../controllers/bookingController";

const router = Router();

router.use(authenticateToken);

// GET /api/bookings/list
router.get("/list", listBookings);

// POST /api/bookings/create
router.post(
  "/create",
  [
    body("serviceName").isString().trim().notEmpty().isLength({ max: 200 }).withMessage("Service name is required (max 200 chars)."),
    body("bookingDate").isISO8601().withMessage("Booking date must be a valid date (YYYY-MM-DD)."),
    body("bookingTime").matches(/^\d{2}:\d{2}$/).withMessage("Booking time must be in HH:MM format."),
    body("amount").isInt({ min: 1, max: 1000000 }).withMessage("Amount must be between 1 and 1,000,000 paise."),
    body("serviceType").optional().isString().trim(),
    body("durationMinutes").optional().isInt({ min: 1 }),
    body("notes").optional().isString().trim().isLength({ max: 500 }),
  ],
  validate,
  createBookingHandler
);

export default router;
