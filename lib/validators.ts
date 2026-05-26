import { z } from "zod";

export const bookingSchema = z.object({
  serviceName: z.string().min(1, "Please select a service."),
  bookingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format.")
    .refine((d) => d >= new Date().toISOString().slice(0, 10), {
      message: "Booking date must be today or in the future.",
    }),
  bookingTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)."),
  amount: z
    .number()
    .int("Amount must be a whole number.")
    .min(1, "Amount must be at least ₹1.")
    .max(100_000_00, "Amount exceeds maximum allowed."),
  notes: z.string().max(500, "Notes must be under 500 characters.").optional(),
});

export const appointmentSchema = z.object({
  message: z.string().max(1000, "Message must be under 1000 characters.").optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
