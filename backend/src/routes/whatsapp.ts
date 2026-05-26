import { Router } from "express";
import { incomingWhatsAppHandler } from "../controllers/whatsappController";

const router = Router();

// POST /api/whatsapp/incoming  — Twilio webhook for inbound WhatsApp messages
router.post("/incoming", incomingWhatsAppHandler);

export default router;
