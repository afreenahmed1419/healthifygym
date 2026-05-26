import dotenv from "dotenv";
dotenv.config();

function mustHave(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required environment variable: ${name}`);
  return val;
}

function maybe(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  port: parseInt(maybe("PORT", "5000"), 10),
  nodeEnv: maybe("NODE_ENV", "development"),
  isDev: maybe("NODE_ENV", "development") === "development",

  frontendUrl: maybe("FRONTEND_URL", "http://localhost:3000"),

  supabaseUrl: mustHave("SUPABASE_URL"),
  supabaseServiceKey: mustHave("SUPABASE_SERVICE_ROLE_KEY"),

  jwtSecret: mustHave("JWT_SECRET"),
  otpSecret: mustHave("OTP_SECRET"),

  msg91AuthKey: maybe("MSG91_AUTH_KEY"),
  msg91SenderNumber: maybe("MSG91_SENDER_NUMBER", "15559838251"),
  msg91OtpTemplate: maybe("MSG91_OTP_TEMPLATE", "healthify_otp"),
  msg91BookingTemplate: maybe("MSG91_BOOKING_TEMPLATE", "healthify_booking_confirmed"),
  msg91OwnerNotifTemplate: maybe("MSG91_OWNER_NOTIF_TEMPLATE", "healthify_owner_booking"),
  msg91AppointmentTemplate: maybe("MSG91_APPOINTMENT_TEMPLATE", "healthify_appointment_confirmed"),
  msg91ContactTemplate: maybe("MSG91_CONTACT_TEMPLATE", "healthify_contact_enquiry"),
  ownerWhatsapp: maybe("OWNER_WHATSAPP_NUMBER"),

  razorpayKeyId: maybe("RAZORPAY_KEY_ID"),
  razorpayKeySecret: maybe("RAZORPAY_KEY_SECRET"),
  razorpayWebhookSecret: maybe("RAZORPAY_WEBHOOK_SECRET"),
} as const;
