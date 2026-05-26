"use client";

import { useState } from "react";
import apiClient from "../lib/api-client";
import { openRazorpayCheckout } from "../lib/razorpay";
import { getStoredToken } from "../lib/auth";
import type { BookingInput } from "../lib/validators";

export type BookingStatus = "idle" | "creating" | "payment" | "verifying" | "success" | "error";

export function useBooking() {
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  async function checkout(input: BookingInput): Promise<boolean> {
    setError(null);
    setStatus("creating");

    try {
      // Step 1 — create booking + Razorpay order on the backend
      const { data: createData } = await apiClient.post<{
        success: boolean;
        booking: { id: string };
        razorpayOrder: { id: string; amount: number; currency: string };
      }>("/api/bookings/create", {
        serviceName: input.serviceName,
        bookingDate: input.bookingDate,
        bookingTime: input.bookingTime,
        amount: input.amount,
        notes: input.notes,
      });

      const { booking, razorpayOrder } = createData;
      setBookingId(booking.id);
      setStatus("payment");

      // Step 2 — open Razorpay checkout modal
      await new Promise<void>((resolve, reject) => {
        openRazorpayCheckout({
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          description: input.serviceName,
          onSuccess: async (response) => {
            setStatus("verifying");
            try {
              // Step 3 — verify the payment signature
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${getStoredToken() ?? ""}`,
                },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                setStatus("success");
                resolve();
              } else {
                reject(new Error(verifyData.message ?? "Payment verification failed."));
              }
            } catch (err) {
              reject(err);
            }
          },
          onDismiss: () => {
            reject(new Error("Payment cancelled."));
          },
        }).catch(reject);
      });

      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setStatus("error");
      return false;
    }
  }

  function reset() {
    setStatus("idle");
    setError(null);
    setBookingId(null);
  }

  const loading = status === "creating" || status === "verifying";

  return { checkout, status, loading, error, bookingId, reset };
}
