import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validation";
import { sendContactEnquiry } from "../services/Msg91Service";
import { env } from "../config/env";

const router = Router();

router.post(
  "/",
  [
    body("name").isString().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("whatsappNumber").isString().trim().notEmpty().withMessage("WhatsApp number is required"),
    body("email").optional({ checkFalsy: true }).isEmail().withMessage("Invalid email address"),
    body("message").optional().isString().trim().isLength({ max: 1000 }),
    body("preferredBranch").optional().isString().trim(),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, whatsappNumber, email, message, preferredBranch } = req.body as {
        name: string;
        whatsappNumber: string;
        email?: string;
        message?: string;
        preferredBranch?: string;
      };

      const ownerPhone = env.ownerWhatsapp;
      if (ownerPhone) {
        await sendContactEnquiry(ownerPhone, {
          name,
          phone: whatsappNumber,
          email,
          message,
          branch: preferredBranch,
        });
      }

      res.json({ success: true, message: "Message received. We'll reach out on WhatsApp shortly." });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
