import { Router } from "express";
import { body } from "express-validator";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validation";
import { createAppointmentHandler, listAppointments } from "../controllers/appointmentController";

const router = Router();

router.use(authenticateToken);

// GET /api/appointments
router.get("/", listAppointments);

// POST /api/appointments/create
router.post(
  "/create",
  [
    body("message").optional().isString().trim().isLength({ max: 1000 }),
  ],
  validate,
  createAppointmentHandler
);

export default router;
