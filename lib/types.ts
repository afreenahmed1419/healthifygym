// ─── User & Auth ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  whatsappNumber: string;
  name: string | null;
  email: string | null;
  otpVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User, token?: string) => void;
  logout: () => void;
  clearError: () => void;
}

// ─── OTP ────────────────────────────────────────────────────────────────────

export interface SendOTPRequest {
  whatsappNumber: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  expiresAt?: string;
}

export interface VerifyOTPRequest {
  whatsappNumber: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export type OTPStep = "phone" | "verify" | "success";

// ─── Navigation ─────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
}

// ─── Membership ─────────────────────────────────────────────────────────────

export type BillingCycle = "monthly" | "quarterly" | "yearly";

export interface MembershipPlan {
  id: string;
  name: string;
  tagline: string;
  price: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  features: string[];
  isPopular?: boolean;
  ctaLabel: string;
}

// ─── Services ───────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// ─── Trainers ───────────────────────────────────────────────────────────────

export interface Trainer {
  id: string;
  name: string;
  role: string;
  image: string;
  socials: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    whatsapp?: string;
  };
}

// ─── Transformations ────────────────────────────────────────────────────────

export interface Transformation {
  id: string;
  beforeImage: string;
  afterImage: string;
  name: string;
  duration: string;
  result: string;
  metric: string;
}

// ─── Programs ───────────────────────────────────────────────────────────────

export interface Program {
  id: string;
  category: string;
  title: string;
  description: string;
  features: string[];
  image: string;
}

// ─── Booking ────────────────────────────────────────────────────────────────

export type BookingStep = "class" | "datetime" | "details" | "payment" | "confirmation";

export interface ClassOption {
  id: string;
  name: string;
  price: number;
  duration: string;
}

// ─── Contact ────────────────────────────────────────────────────────────────

export interface ContactFormData {
  fullName: string;
  whatsappNumber: string;
  email: string;
  preferredBranch: string;
  message: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  hours: {
    weekdays: string;
    sunday: string;
  };
  phone: string;
  mapUrl: string;
}

// ─── API ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
