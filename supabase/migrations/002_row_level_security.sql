-- ─── Enable RLS on all tables ────────────────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- ─── Service role bypasses all RLS (used by our API routes) ──────────────────
-- The service role key already bypasses RLS by default in Supabase.
-- All API routes use getAdminClient() which uses the service role key.
-- The policies below protect against direct client-side access.

-- ─── users: no direct client access ─────────────────────────────────────────
CREATE POLICY "No direct client access to users"
  ON users FOR ALL
  USING (false);

-- ─── otp_tokens: no direct client access ─────────────────────────────────────
CREATE POLICY "No direct client access to otp_tokens"
  ON otp_tokens FOR ALL
  USING (false);

-- ─── bookings: no direct client access ───────────────────────────────────────
CREATE POLICY "No direct client access to bookings"
  ON bookings FOR ALL
  USING (false);

-- ─── appointments: no direct client access ───────────────────────────────────
CREATE POLICY "No direct client access to appointments"
  ON appointments FOR ALL
  USING (false);

-- ─── payments: no direct client access ───────────────────────────────────────
CREATE POLICY "No direct client access to payments"
  ON payments FOR ALL
  USING (false);

-- ─── faqs: public read only ───────────────────────────────────────────────────
CREATE POLICY "Anyone can read active FAQs"
  ON faqs FOR SELECT
  USING (is_active = true);

CREATE POLICY "No direct client writes to faqs"
  ON faqs FOR INSERT
  USING (false);

CREATE POLICY "No direct client updates to faqs"
  ON faqs FOR UPDATE
  USING (false);
