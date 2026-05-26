import { sendBookingConfirmation, sendOwnerNotification, sendAppointmentConfirmation } from "./Msg91Service";
import { getUserById } from "./SupabaseService";
import type { Booking, User } from "../types";

export function formatBookingConfirmation(booking: Booking, user: User): string {
  const shortId = booking.id.slice(0, 8).toUpperCase();
  const amountRupees = (booking.payment_amount / 100).toFixed(0);
  return (
    `✅ *Booking Confirmed — Healthify*\n\n` +
    `Class: *${booking.service_name}*\n` +
    `Date: *${booking.booking_date}*\n` +
    `Time: *${booking.booking_time}*\n` +
    `Amount Paid: ₹${amountRupees}\n` +
    `Booking ID: BK-${shortId}\n\n` +
    `See you there, ${user.name ?? ""}! 💪\n— Healthify Women's Fitness Club`
  );
}

export function formatAppointmentRequest(appointment: { type: string; preferred_date: string; preferred_time: string }, user: User): string {
  return (
    `📅 *Appointment Request — Healthify*\n\n` +
    `Name: ${user.name ?? user.whatsapp_number}\n` +
    `Phone: ${user.whatsapp_number}\n` +
    `Type: ${appointment.type}\n` +
    `Date: ${appointment.preferred_date}\n` +
    `Time: ${appointment.preferred_time}\n\n` +
    `Please confirm the slot.`
  );
}

export async function notifyBookingConfirmed(booking: Booking, user: User): Promise<void> {
  await Promise.allSettled([
    // User confirmation
    sendBookingConfirmation(user.whatsapp_number, {
      serviceName: booking.service_name,
      date: booking.booking_date,
      time: booking.booking_time,
      bookingId: booking.id,
    }),
    // Owner notification
    sendOwnerNotification({
      userName: user.name,
      userPhone: user.whatsapp_number,
      serviceName: booking.service_name,
      date: booking.booking_date,
      time: booking.booking_time,
      amountPaise: booking.payment_amount,
      bookingId: booking.id,
    }),
  ]);
}

export async function notifyAppointmentBooked(userId: string, details: {
  type: string;
  date: string;
  time: string;
}): Promise<void> {
  const user = await getUserById(userId);
  if (!user) return;
  await sendAppointmentConfirmation(user.whatsapp_number, details);
}
