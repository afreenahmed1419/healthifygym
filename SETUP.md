# Setup Guide — Healthify

## Prerequisites

- Node.js 18+
- A Supabase project (free tier is fine)
- A Twilio account with WhatsApp Sandbox enabled (for OTP)

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OTP hashing — any random 32+ char string
OTP_SECRET=change-this-to-a-random-secret-string

# JWT signing — any random 32+ char string
JWT_SECRET=change-this-to-another-random-secret-string

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

**Where to find these values:**
- Supabase keys: Project Settings → API
- Twilio credentials: Twilio Console → Account Info
- `TWILIO_WHATSAPP_FROM`: Twilio Console → Messaging → Try it out → Send a WhatsApp message

> In development, if Twilio keys are missing the OTP is logged to the terminal instead of being sent.

---

## 3. Database Setup

Run the migration against your Supabase project:

```bash
# Option A — Supabase CLI
npx supabase db push

# Option B — Supabase Dashboard
# Copy the contents of supabase/migrations/001_initial_schema.sql
# and paste into the SQL Editor in your Supabase Dashboard, then Run.
```

The migration creates:
- `users` — member profiles
- `otp_tokens` — hashed OTPs with expiry
- `faqs` — FAQ content (pre-seeded with 8 entries)
- `bookings` — class bookings
- `appointments` — personal training appointments
- `payments` — payment records

All tables have Row Level Security (RLS) enabled.

---

## 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 5. Testing WhatsApp OTP

1. Join the Twilio WhatsApp Sandbox by sending the sandbox keyword to `+1 415 523 8886` from your WhatsApp.
2. Enter your WhatsApp number in the login modal on the site.
3. The OTP will be sent to your WhatsApp (or logged in terminal if Twilio keys are absent).

Indian numbers: enter as `9876543210` (10 digits) or `+919876543210`.

---

## 6. Build for Production

```bash
npm run build
npm start
```

---

## 7. Deploy to Vercel

1. Push to a GitHub/GitLab repository.
2. Import the repo in Vercel.
3. Add all `.env.local` variables under Project Settings → Environment Variables.
4. Deploy.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `Error: supabaseUrl is required` | Make sure `.env.local` exists and the dev server was restarted after creating it |
| OTP not received | Check Twilio console logs; confirm your number has joined the sandbox |
| JWT errors on login | Ensure `JWT_SECRET` in `.env.local` matches what was used to sign existing tokens (change clears all sessions) |
| TypeScript errors | Run `npx tsc --noEmit` — should report 0 errors |
| Tailwind styles not applying | This project uses Tailwind v4 `@theme` — do not use `tailwind.config.ts` |
