-- ============================================================
-- Healthify — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ────────────────────────────────────────────────────────────
-- TABLE: users
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number   VARCHAR(15) NOT NULL UNIQUE,
  name              VARCHAR(100),
  email             VARCHAR(100),
  otp_verified      BOOLEAN     NOT NULL DEFAULT false,
  verified_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_whatsapp ON public.users (whatsapp_number);

COMMENT ON TABLE  public.users IS 'Healthify members authenticated via WhatsApp OTP';
COMMENT ON COLUMN public.users.whatsapp_number IS 'E.164 format, e.g. +919876543210';


-- ────────────────────────────────────────────────────────────
-- TABLE: otp_tokens
-- Stores hashed OTPs for verification (never store plain OTPs)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.otp_tokens (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number VARCHAR(15) NOT NULL,
  otp_hash        TEXT        NOT NULL,
  expires_at      TIMESTAMPTZ NOT NULL,
  used            BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_otp_phone     ON public.otp_tokens (whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_otp_expires   ON public.otp_tokens (expires_at);

COMMENT ON TABLE public.otp_tokens IS 'Hashed OTPs for WhatsApp authentication. Plain OTP is never stored.';


-- ────────────────────────────────────────────────────────────
-- TABLE: faqs
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.faqs (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  question   TEXT        NOT NULL,
  answer     TEXT        NOT NULL,
  keywords   TEXT[]      NOT NULL DEFAULT '{}',
  category   VARCHAR(50) NOT NULL DEFAULT 'general',
  is_active  BOOLEAN     NOT NULL DEFAULT true,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_faqs_category  ON public.faqs (category);
CREATE INDEX IF NOT EXISTS idx_faqs_active    ON public.faqs (is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_keywords  ON public.faqs USING GIN (keywords);

COMMENT ON TABLE public.faqs IS 'FAQ entries used by the AI chatbot and FAQ section';


-- ────────────────────────────────────────────────────────────
-- TABLE: bookings
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_name         VARCHAR(200) NOT NULL,
  booking_date         DATE        NOT NULL,
  booking_time         TIME        NOT NULL,
  payment_amount       INTEGER     NOT NULL DEFAULT 0,   -- in paise (₹299 = 29900)
  razorpay_payment_id  VARCHAR(100),
  payment_status       VARCHAR(20) NOT NULL DEFAULT 'pending'
                         CHECK (payment_status IN ('pending', 'completed', 'failed')),
  owner_notified       BOOLEAN     NOT NULL DEFAULT false,
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id        ON public.bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date           ON public.bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings (payment_status);

COMMENT ON TABLE  public.bookings IS 'Class bookings made by members';
COMMENT ON COLUMN public.bookings.payment_amount IS 'Amount in paise. ₹299 stored as 29900.';


-- ────────────────────────────────────────────────────────────
-- TABLE: appointments
-- Free-form contact / trial session requests
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.appointments (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        REFERENCES public.users(id) ON DELETE SET NULL,
  full_name             VARCHAR(100),
  whatsapp_number       VARCHAR(15),
  email                 VARCHAR(100),
  preferred_branch      VARCHAR(100),
  message               TEXT,
  whatsapp_link_sent    BOOLEAN     NOT NULL DEFAULT false,
  owner_response_status VARCHAR(20) NOT NULL DEFAULT 'pending'
                          CHECK (owner_response_status IN ('pending', 'confirmed', 'declined')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments (user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status  ON public.appointments (owner_response_status);

COMMENT ON TABLE public.appointments IS 'Trial / consultation requests from the Contact Us form';


-- ────────────────────────────────────────────────────────────
-- TABLE: payments
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id           UUID        REFERENCES public.bookings(id) ON DELETE SET NULL,
  user_id              UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  razorpay_payment_id  VARCHAR(100) NOT NULL UNIQUE,
  amount               INTEGER     NOT NULL,   -- in paise
  status               VARCHAR(20) NOT NULL DEFAULT 'authorized'
                         CHECK (status IN ('captured', 'failed', 'authorized', 'refunded')),
  method               VARCHAR(50) NOT NULL DEFAULT 'upi'
                         CHECK (method IN ('upi', 'card', 'netbanking', 'wallet')),
  owner_notified       BOOLEAN     NOT NULL DEFAULT false,
  metadata             JSONB,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id    ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay   ON public.payments (razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status     ON public.payments (status);

COMMENT ON TABLE  public.payments IS 'Payment records from Razorpay';
COMMENT ON COLUMN public.payments.amount IS 'Amount in paise. ₹299 stored as 29900.';


-- ────────────────────────────────────────────────────────────
-- AUTO-UPDATE updated_at via trigger
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_tokens   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments     ENABLE ROW LEVEL SECURITY;

-- FAQs are public-read
CREATE POLICY "faqs_public_read"
  ON public.faqs FOR SELECT
  USING (is_active = true);

-- Users can only read/update their own row
CREATE POLICY "users_self_read"
  ON public.users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "users_self_update"
  ON public.users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Bookings: users see only their own
CREATE POLICY "bookings_self_read"
  ON public.bookings FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "bookings_self_insert"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- Payments: users see only their own
CREATE POLICY "payments_self_read"
  ON public.payments FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Appointments: allow anonymous insert (contact form)
CREATE POLICY "appointments_public_insert"
  ON public.appointments FOR INSERT
  WITH CHECK (true);

-- OTP tokens: service role only (no client access)
-- (No permissive policies — all access via service role key)


-- ────────────────────────────────────────────────────────────
-- SEED: Sample FAQs
-- ────────────────────────────────────────────────────────────
INSERT INTO public.faqs (question, answer, keywords, category, sort_order) VALUES
  (
    'What are your gym timings?',
    'We are open Monday to Saturday from 6:00 AM to 9:00 PM. On Sundays we are open from 8:00 AM to 1:00 PM.',
    ARRAY['timings', 'hours', 'open', 'time', 'schedule'],
    'general',
    1
  ),
  (
    'What membership plans do you offer?',
    'We offer three plans: Basic (₹1499/month) with gym access and basic equipment, Pro (₹2499/month) with all group classes and 2 personal training sessions, and Premium (₹3999/month) with unlimited personal training, custom diet plan, and priority support.',
    ARRAY['membership', 'plans', 'pricing', 'fees', 'cost', 'price'],
    'membership',
    2
  ),
  (
    'Is there a joining fee?',
    'No! There is absolutely no joining fee. You only pay the membership amount. We also offer flexible quarterly and yearly packages with better savings.',
    ARRAY['joining fee', 'registration', 'enrollment', 'charges'],
    'membership',
    3
  ),
  (
    'Do you offer personal training?',
    'Yes! Our Pro plan includes 2 personal training sessions per month, and our Premium plan includes 4 sessions per month. You can also book standalone personal training sessions for ₹799/session.',
    ARRAY['personal training', 'trainer', 'one on one', 'pt session'],
    'services',
    4
  ),
  (
    'Is the gym only for women?',
    'Yes, Healthify is an exclusive ladies fitness club. We provide a safe, supportive and empowering environment for women of all ages and fitness levels, from 14 to 65 years.',
    ARRAY['women only', 'ladies', 'female', 'gender', 'exclusive'],
    'general',
    5
  ),
  (
    'What classes do you offer?',
    'We offer Strength Training, Weight Loss Programs, HIIT Burn, Yoga & Stretch, Zumba Fitness, Functional Training, and more. Group classes are included in Pro and Premium memberships.',
    ARRAY['classes', 'zumba', 'yoga', 'hiit', 'group', 'programs'],
    'services',
    6
  ),
  (
    'How do I book a trial session?',
    'You can book a free trial session directly from our website. Click on "Book a Class", select a class, choose your preferred date and time, and complete the booking. Our team will confirm via WhatsApp.',
    ARRAY['trial', 'free', 'first class', 'try', 'demo', 'book'],
    'booking',
    7
  ),
  (
    'Can I cancel my membership?',
    'Yes, you can cancel anytime without any penalty. We offer flexible packages with no lock-in period. Contact us on WhatsApp or visit the gym to process the cancellation.',
    ARRAY['cancel', 'refund', 'stop', 'exit', 'leave'],
    'membership',
    8
  )
ON CONFLICT DO NOTHING;
