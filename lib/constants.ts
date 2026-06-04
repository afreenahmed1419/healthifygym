import type { NavLink, MembershipPlan, Service, Branch, ClassOption } from "./types";

// ─── Brand ──────────────────────────────────────────────────────────────────

export const BRAND = {
  name: "Healthify",
  tagline: "Exclusive Ladies Fitness Club",
  slogan: "Strength Is Her Power",
  phone: "+91 94742 87111",
  email: "hello@healthify.com",
  address: "Opposite Petrol Pump, Delanipur",
  instagram: "https://instagram.com/healthify",
  facebook: "https://facebook.com/healthify",
  youtube: "https://youtube.com/healthify",
  whatsapp: "https://wa.me/919474287111",
} as const;

// ─── Theme ──────────────────────────────────────────────────────────────────

export const COLORS = {
  primary: "#FF6B35",
  primaryDark: "#e55a24",
  primaryLight: "#ff8a5c",
  secondary: "#1A1A1A",
  dark: "#0d0d0d",
  white: "#ffffff",
  muted: "#888888",
} as const;

// ─── Navigation ─────────────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Membership", href: "/memberships" },
  { label: "Contact", href: "/contact" },
];

// ─── Hero Stats ─────────────────────────────────────────────────────────────

export const HERO_STATS = [
  { value: "20+", label: "Expert Trainers", icon: "users" },
  { value: "50+", label: "Fitness Programs", icon: "dumbbell" },
  { value: "2500+", label: "Happy Members", icon: "heart" },
  { value: "100%", label: "Women Focused", icon: "shield" },
] as const;

// ─── Services ───────────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    id: "strength-training",
    icon: "Dumbbell",
    title: "Strength Training",
    description: "Build lean muscle and improve overall strength with structured progressive programs.",
  },
  {
    id: "weight-loss",
    icon: "Flame",
    title: "Weight Loss Programs",
    description: "Effective programs for sustainable fat loss through science-backed methods.",
  },
  {
    id: "group-classes",
    icon: "Users",
    title: "Group Classes",
    description: "Fun, energizing and result-driven sessions in a motivating group environment.",
  },
  {
    id: "functional-training",
    icon: "Activity",
    title: "Functional Training",
    description: "Improve mobility, balance and everyday strength with functional movement patterns.",
  },
  {
    id: "personal-coaching",
    icon: "Star",
    title: "Personal Coaching",
    description: "1:1 training tailored to your goals with dedicated expert guidance.",
  },
  {
    id: "women-wellness",
    icon: "Heart",
    title: "Women Wellness",
    description: "Holistic programs for mind, body and soul designed specifically for women.",
  },
  {
    id: "nutrition-guidance",
    icon: "Apple",
    title: "Nutrition Guidance",
    description: "Personalised nutrition plans and diet coaching for better results.",
  },
  {
    id: "injury-prevention",
    icon: "Shield",
    title: "Injury Prevention",
    description: "Train smart and stay injury-free with mobility and recovery programs.",
  },
];

// ─── Membership Plans ────────────────────────────────────────────────────────

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Perfect for beginners",
    price: { monthly: 1499, quarterly: 3999, yearly: 13999 },
    features: [
      "Access to gym",
      "Basic equipment",
      "1 Group class / week",
      "Locker facility",
    ],
    ctaLabel: "Choose Plan",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Most popular choice",
    price: { monthly: 2499, quarterly: 6999, yearly: 23999 },
    features: [
      "Access to gym",
      "All group classes",
      "Personal training (2×/month)",
      "Nutrition guidance",
      "Locker facility",
    ],
    isPopular: true,
    ctaLabel: "Choose Plan",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "For ultimate results",
    price: { monthly: 3999, quarterly: 10999, yearly: 37999 },
    features: [
      "Access to gym",
      "All group classes",
      "Personal training (4×/month)",
      "Custom diet plan",
      "Body assessment",
      "Priority support",
      "Locker facility",
    ],
    ctaLabel: "Choose Plan",
  },
];

// ─── Class Options ───────────────────────────────────────────────────────────

export const CLASS_OPTIONS: ClassOption[] = [
  { id: "strength", name: "Strength Training", price: 299, duration: "60 min" },
  { id: "weight-loss", name: "Weight Loss Program", price: 299, duration: "45 min" },
  { id: "hiit", name: "HIIT Burn", price: 299, duration: "30 min" },
  { id: "yoga", name: "Yoga & Stretch", price: 299, duration: "60 min" },
  { id: "zumba", name: "Zumba Fitness", price: 299, duration: "45 min" },
  { id: "functional", name: "Functional Training", price: 299, duration: "60 min" },
];

// ─── Program Categories ──────────────────────────────────────────────────────

export const PROGRAM_CATEGORIES = [
  "Strength",
  "Weight Loss",
  "Wellness",
  "Mind & Body",
  "Athletic",
] as const;

// ─── Branches ───────────────────────────────────────────────────────────────

export const BRANCHES: Branch[] = [
  {
    id: "branch-delanipur",
    name: "Healthify — Delanipur",
    address: "Opposite Petrol Pump, Delanipur",
    city: "Sri Vijaya Puram, Andaman & Nicobar Islands 744102",
    hours: {
      weekdays: "5:00 AM – 8:00 PM",
      sunday: "5:00 AM – 8:00 PM",
    },
    phone: "+91 94742 87111",
    mapUrl: "https://maps.google.com/maps?q=11.6700076,92.7277078&output=embed&z=17",
  },
  {
    id: "branch-bambooflat",
    name: "Healthify — Bambooflat",
    address: "Opposite GSSS Bambooflat School, Valluvar Nagar",
    city: "Sri Vijaya Puram, Andaman & Nicobar Islands",
    hours: {
      weekdays: "6:00 AM – 7:00 PM",
      sunday: "6:00 AM – 7:00 PM",
    },
    phone: "+91 94742 87111",
    mapUrl: "https://maps.google.com/maps?q=11.7119244,92.715801&output=embed&z=17",
  },
];

// ─── API Routes ──────────────────────────────────────────────────────────────

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

export const API_ROUTES = {
  sendOTP: `${API_BASE_URL}/api/auth/send-otp`,
  verifyOTP: `${API_BASE_URL}/api/auth/verify-otp`,
  contact: `${API_BASE_URL}/api/contact`,
  booking: `${API_BASE_URL}/api/booking`,
} as const;

// ─── Real Membership Pricing (from client) ───────────────────────────────────

export const LIFETIME_PLAN = {
  price: 3000,
  label: "One Time Payment",
  description: "Pay once, train forever. Full gym access for life.",
} as const;

export const DAILY_PASS = {
  price: 250,
  duration: "1 Hour",
  description: "Drop-in anytime. No commitment needed.",
} as const;

export interface PricingRow {
  type: string;
  forMembers: number;
  forNonMembers: number;
}

export interface ComboRow {
  type: string;
  price: number;
  benefit: string;
}

export const ESSENTIAL_PRICING: PricingRow[] = [
  { type: "Monthly",      forMembers: 3000,  forNonMembers: 3500  },
  { type: "Quarterly",    forMembers: 6000,  forNonMembers: 9000  },
  { type: "Half Yearly",  forMembers: 10000, forNonMembers: 15000 },
  { type: "Yearly",       forMembers: 18000, forNonMembers: 25000 },
  { type: "PT / Monthly", forMembers: 5500,  forNonMembers: 6500  },
];

export const YOGA_PRICING: PricingRow[] = [
  { type: "Monthly",     forMembers: 3000,  forNonMembers: 3500  },
  { type: "Quarterly",   forMembers: 6000,  forNonMembers: 9000  },
  { type: "Half Yearly", forMembers: 10000, forNonMembers: 15000 },
  { type: "Yearly",      forMembers: 18000, forNonMembers: 25000 },
];

export const COMBO_PRICING: ComboRow[] = [
  { type: "Monthly",     price: 5000,  benefit: "₹1,000 discount"                   },
  { type: "Quarterly",   price: 10000, benefit: "₹2,000 discount"                   },
  { type: "Half Yearly", price: 17500, benefit: "₹2,500 discount + 1 Week PT"       },
  { type: "Yearly",      price: 30000, benefit: "₹6,000 discount + 15 Days PT"      },
];

// ─── OTP Config ──────────────────────────────────────────────────────────────

export const OTP_CONFIG = {
  length: 6,
  expiryMinutes: 5,
  resendCooldown: 30,
} as const;
