# Healthify — Exclusive Ladies Fitness Club

Production website for a real fitness client based in India. Dark-themed, orange-accented, fully animated with Framer Motion. WhatsApp OTP authentication, INR pricing, and a complete membership management structure.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 (`@theme` directive) |
| Animations | Framer Motion 12, GSAP 3 |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | WhatsApp OTP via Twilio, JWT (30-day tokens) |
| Forms | react-hook-form + zod |
| OTP Security | CryptoJS HMAC-SHA256 (plain OTPs never stored) |
| Fonts | Barlow Condensed (headings), Geist Sans (body) |

## Pages Completed

| Route | Description |
|---|---|
| `/` | Home — Hero, Why Healthify, Services preview, Membership teaser, CTA |
| `/services` | All 8 services with filter tabs and animated cards |
| `/memberships` | Full pricing — Essential, Yoga, Combo, Lifetime, Daily Pass |

## API Routes

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/send-otp` | Validate phone, hash OTP, send via Twilio WhatsApp |
| `POST /api/auth/verify-otp` | Verify hash, upsert user, issue 30-day JWT |

## Project Structure

```
healthify/
├── app/
│   ├── _components/        # Shared UI: Navbar, Footer, HeroSection, OTPModal, PageHero
│   ├── api/auth/           # send-otp + verify-otp routes
│   ├── services/           # Services listing page
│   ├── memberships/        # Pricing page
│   ├── globals.css         # Tailwind v4 @theme + global utilities
│   ├── layout.tsx          # Root layout with AuthProvider
│   └── page.tsx            # Home page
├── context/
│   └── AuthContext.tsx     # Client-side auth state (localStorage + JWT expiry)
├── lib/
│   ├── auth.ts             # Phone validation, OTP utilities, session helpers
│   ├── jwt.server.ts       # Server-only JWT sign/verify (Node.js crypto)
│   ├── supabase.ts         # Lazy browser + admin Supabase clients
│   ├── db.ts               # DB query helpers
│   ├── constants.ts        # All site data: pricing, services, branches
│   ├── types.ts            # TypeScript interfaces
│   ├── database.types.ts   # Auto-generated Supabase types
│   └── utils.ts            # cn() utility
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql
```

## Setup

See [SETUP.md](./SETUP.md) for full installation, environment variables, and local development instructions.

## Design

- Background: `#0d0d0d` (near-black)
- Accent: `#FF6B35` (orange)
- Cards: `#111111` with `#2a2a2a` borders
- Typography: Barlow Condensed Black/ExtraBold for headings, Geist Sans for body
- All entrance animations use `ease: [0.22, 1, 0.36, 1]` (custom deceleration curve)
