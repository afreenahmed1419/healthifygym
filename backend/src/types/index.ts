// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  whatsapp_number: string;
  name: string | null;
  email: string | null;
  otp_verified: boolean;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  service_name: string;
  booking_date: string;
  booking_time: string;
  payment_amount: number;
  razorpay_payment_id: string | null;
  payment_status: "pending" | "completed" | "failed";
  owner_notified: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  user_id: string | null;
  full_name: string | null;
  whatsapp_number: string | null;
  email: string | null;
  preferred_branch: string | null;
  message: string | null;
  whatsapp_link_sent: boolean;
  owner_response_status: "pending" | "confirmed" | "declined";
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string | null;
  user_id: string;
  razorpay_payment_id: string;
  amount: number;
  status: "captured" | "failed" | "authorized" | "refunded";
  method: "upi" | "card" | "netbanking" | "wallet";
  owner_notified: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// ─── JWT ──────────────────────────────────────────────────────────────────────

export interface JWTPayload {
  userId: string;
  whatsappNumber: string;
  iat: number;
  exp: number;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

// ─── Request body types ───────────────────────────────────────────────────────

export interface CreateBookingBody {
  serviceName: string;
  serviceType?: string;
  bookingDate: string;
  bookingTime: string;
  durationMinutes?: number;
  amount: number; // in paise
  notes?: string;
}

export interface CreateAppointmentBody {
  message?: string;
}

export interface CreatePaymentOrderBody {
  amount: number;
  purpose: string;
  metadata?: Record<string, unknown>;
}

export interface VerifyPaymentBody {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

// ─── Express augmentation ────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
