import { Request, Response } from "express";
import { createAppointment, getAppointmentsByUser, getUserById } from "../services/SupabaseService";
import { env } from "../config/env";
import type { CreateAppointmentBody } from "../types";

export async function createAppointmentHandler(req: Request, res: Response): Promise<void> {
  try {
    const { message } = req.body as CreateAppointmentBody;
    const userId = req.user!.userId;

    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    const appointment = await createAppointment(userId, {
      full_name: user.name,
      whatsapp_number: user.whatsapp_number,
      message: message ?? null,
    });

    if (!appointment) {
      res.status(500).json({ success: false, message: "Failed to create appointment." });
      return;
    }

    // Generate WhatsApp deep link to owner
    const ownerPhone = env.ownerWhatsapp.replace(/\D/g, "");
    const text = `Hi! I'd like to visit Healthify gym. When are you available? - ${user.name ?? user.whatsapp_number}`;
    const whatsappLink = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(text)}`;

    res.status(201).json({
      success: true,
      appointment: {
        id: appointment.id,
        userId: appointment.user_id,
        whatsappLink,
      },
    });
  } catch (err) {
    console.error("[createAppointment]", err);
    res.status(500).json({ success: false, message: "Failed to create appointment." });
  }
}

export async function listAppointments(req: Request, res: Response): Promise<void> {
  try {
    const appointments = await getAppointmentsByUser(req.user!.userId);
    res.json({ success: true, data: appointments });
  } catch (err) {
    console.error("[listAppointments]", err);
    res.status(500).json({ success: false, message: "Failed to fetch appointments." });
  }
}
