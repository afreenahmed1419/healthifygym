"use client";

import { useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { bookingSchema } from "@/lib/validators";
import type { BookingInput } from "@/lib/validators";

const SERVICES: { name: string; price: number; label: string }[] = [
  { name: "Daily Pass", price: 25000, label: "Daily Pass — ₹250" },
  { name: "Yoga", price: 50000, label: "Yoga — ₹500" },
  { name: "Zumba", price: 50000, label: "Zumba — ₹500" },
  { name: "Pilates", price: 60000, label: "Pilates — ₹600" },
  { name: "Strength Training", price: 70000, label: "Strength Training — ₹700" },
];

const TIME_SLOTS = ["06:00", "07:00", "08:00", "09:00", "10:00", "16:00", "17:00", "18:00", "19:00"];

const STATUS_LABELS: Record<string, string> = {
  creating: "Creating your booking…",
  payment: "Opening payment…",
  verifying: "Confirming payment…",
};

interface BookingFormProps {
  onSuccess?: (bookingId: string) => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const { checkout, status, loading, error, bookingId } = useBooking();

  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<Partial<BookingInput>>({ bookingDate: today });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function set(key: keyof BookingInput, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const selectedService = SERVICES.find((s) => s.name === form.serviceName);
    const payload = { ...form, amount: selectedService?.price ?? 0 };

    const parsed = bookingSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    const ok = await checkout(parsed.data);
    if (ok && bookingId) onSuccess?.(bookingId);
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
        <p className="text-gray-400">Your booking is confirmed. Check WhatsApp for details.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Service */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Select Service</label>
        <select
          value={form.serviceName ?? ""}
          onChange={(e) => set("serviceName", e.target.value)}
          disabled={loading}
          className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-3 focus:border-[#FF8C42] outline-none disabled:opacity-50"
        >
          <option value="">— Choose a class —</option>
          {SERVICES.map((s) => (
            <option key={s.name} value={s.name}>{s.label}</option>
          ))}
        </select>
        {fieldErrors.serviceName && <p className="text-red-400 text-xs mt-1">{fieldErrors.serviceName}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Booking Date</label>
        <input
          type="date"
          min={today}
          value={form.bookingDate ?? ""}
          onChange={(e) => set("bookingDate", e.target.value)}
          disabled={loading}
          className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-3 focus:border-[#FF8C42] outline-none disabled:opacity-50"
        />
        {fieldErrors.bookingDate && <p className="text-red-400 text-xs mt-1">{fieldErrors.bookingDate}</p>}
      </div>

      {/* Time */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Time Slot</label>
        <select
          value={form.bookingTime ?? ""}
          onChange={(e) => set("bookingTime", e.target.value)}
          disabled={loading}
          className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-3 focus:border-[#FF8C42] outline-none disabled:opacity-50"
        >
          <option value="">— Choose a time —</option>
          {TIME_SLOTS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {fieldErrors.bookingTime && <p className="text-red-400 text-xs mt-1">{fieldErrors.bookingTime}</p>}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Notes (optional)</label>
        <textarea
          value={form.notes ?? ""}
          onChange={(e) => set("notes", e.target.value)}
          disabled={loading}
          rows={3}
          placeholder="Any special requirements?"
          className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-3 focus:border-[#FF8C42] outline-none resize-none disabled:opacity-50"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FF8C42] text-white font-semibold py-3 rounded-lg hover:bg-[#e07520] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {STATUS_LABELS[status] ?? "Processing…"}
          </>
        ) : (
          "Book & Pay"
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Secured by Razorpay · UPI, Cards, NetBanking accepted
      </p>
    </form>
  );
}
