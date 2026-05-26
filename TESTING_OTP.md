# Testing the WhatsApp OTP System

How to test the login OTP flow from start to finish — with or without a real Twilio account.

---

## Option A — Test Without Twilio (No Setup Needed)

The code automatically logs the OTP in the terminal when Twilio credentials are not set. This is the fastest way to test locally.

### Setup

Your `.env.local` only needs Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OTP_SECRET=any-random-string
JWT_SECRET=another-random-string
# Leave Twilio fields empty
```

### Steps

1. Start the dev server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Click **"Login"** in the navbar (top-right)
4. Enter any valid Indian mobile number — e.g. `9876543210`
5. Click **"Send OTP"**
6. Look at the **terminal window** where the server is running. You will see:
   ```
   [DEV OTP] +919876543210 → 482910
   ```
7. Type those 6 digits into the OTP boxes on screen
8. Success screen appears — you are logged in

---

## Option B — Test With Real Twilio (WhatsApp)

### Prerequisites

- Twilio account set up (see [TWILIO_SETUP.md](./TWILIO_SETUP.md))
- Your phone has joined the sandbox (sent the `join` message)
- `.env.local` has all three Twilio values filled in

### Steps

1. Start the dev server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Click **"Login"** in the navbar
4. Enter your WhatsApp number (the one that joined the sandbox)
5. Click **"Send OTP"**
6. Open **WhatsApp** on your phone — a message arrives from `+14155238886`:
   ```
   Your Healthify OTP is: *482910*

   Valid for 5 minutes. Do not share this with anyone.

   — Healthify Women's Fitness Club
   ```
7. Type the 6 digits into the OTP boxes
8. Success screen appears — you are logged in

---

## What Should Happen at Each Step

| Step | What you should see |
|---|---|
| Enter phone number | Input accepts `9876543210` or `+91 9876543210` |
| Click "Send OTP" | Button shows loading, then OTP screen slides in |
| OTP screen appears | 6 empty boxes, 5:00 countdown starts ticking |
| Type each digit | Cursor automatically jumps to the next box |
| Last digit entered | Form auto-submits — no button click needed |
| OTP is correct | Green success animation, modal closes |
| OTP is wrong | Red shake animation, error message shown |
| OTP is expired | "OTP has expired. Please request a new one." |
| Click "Resend" (after 30s) | New OTP generated and sent, countdown resets |
| Logged in | Navbar shows your name or phone number instead of "Login" |

---

## Checking the Database

To confirm everything is being stored correctly:

1. Open your **Supabase Dashboard** at [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **"Table Editor"** in the left sidebar
4. Check the **`otp_tokens`** table — fresh OTPs appear here with `used: false`
5. After a successful login, check the **`users`** table — a new row appears

---

## Common Errors and How to Fix Them

---

### "OTP doesn't send" — no message on WhatsApp, nothing in terminal

**Most likely cause**: Supabase connection is failing. The OTP can't be saved to the database so the API returns an error before reaching Twilio.

**Fix**:
1. Check `.env.local` has the correct `SUPABASE_SERVICE_ROLE_KEY` (not the anon key — use the **service role** key)
2. Restart the dev server after editing `.env.local`: press `Ctrl+C` then run `npm run dev`
3. Check Supabase Dashboard → Logs to see if there is a connection error

---

### "Enter a valid 10-digit Indian mobile number"

**Cause**: The phone number format is not recognised.

**Fix**: Enter the number in one of these formats:
- `9876543210` — just 10 digits (recommended)
- `+919876543210` — with country code
- `919876543210` — without the + sign

The number must start with 6, 7, 8, or 9 (valid Indian mobile numbers).

Numbers starting with 1, 2, 3, 4, or 5 will be rejected.

---

### "No active OTP found. Please request a new one."

**Cause**: The OTP was already used, or you're trying to verify a number that is different from the one the OTP was sent to.

**Fix**: Go back to the phone input and request a fresh OTP.

---

### "OTP has expired. Please request a new one."

**Cause**: More than 5 minutes passed since the OTP was sent.

**Fix**: Click **"Resend OTP"** to generate a new one.

---

### OTP received but verification still fails

**Cause**: You might be entering an old OTP from a previous attempt. When a new OTP is sent, the old one is automatically cancelled.

**Fix**: Always use the **most recent OTP** — the one from the latest message on WhatsApp, or the latest line in the terminal.

---

### WhatsApp message never arrives (Twilio is set up)

**Cause**: Your phone number has not joined the Twilio sandbox.

**Fix**:
1. Open WhatsApp
2. Send a message to `+1 415 523 8886`
3. Type the join code from your Twilio page (e.g. `join sandy-elephant`)
4. Wait for the reply: "You are now connected to the sandbox"
5. Now try sending the OTP again

---

### "TWILIO_WHATSAPP_FROM" error in terminal

**Cause**: The `TWILIO_WHATSAPP_FROM` value has the wrong format.

**Fix**: It must be just the phone number, no spaces:
```env
TWILIO_WHATSAPP_FROM=+14155238886
```

The code automatically adds `whatsapp:` before it. Do not include that prefix yourself.

---

### Twilio error: "Template" or "pre-approved message" required

**Cause**: The recipient's phone has not joined the sandbox.

**Fix**: They need to send the `join` message to `+1 415 523 8886` on WhatsApp before they can receive sandbox messages.

---

### Login button in navbar does nothing

**Cause**: JavaScript error preventing the modal from opening.

**Fix**:
1. Press `F12` to open browser Developer Tools
2. Click the **Console** tab
3. Look for any red error messages
4. Share those errors for further diagnosis

---

### Modal opens but "Send OTP" button does nothing

**Cause**: API route is not responding.

**Fix**:
1. Press `F12` → **Network** tab
2. Click "Send OTP" in the modal
3. Look for a request to `/api/auth/send-otp`
4. Click on it → check the **Response** tab for the error message

---

## Verifying Twilio Is Working

After sending a test OTP with Twilio credentials:

1. Go to **Twilio Console** → **Monitor** → **Logs** → **Messaging**
2. You will see one entry per message sent
3. Status **"delivered"** = success, the message reached the phone
4. Status **"failed"** = click on it, Twilio shows a specific error code and description

---

## API Routes Reference

| Route | Method | Body | What it does |
|---|---|---|---|
| `/api/auth/send-otp` | POST | `{ "whatsappNumber": "9876543210" }` | Validates phone, hashes OTP, saves to DB, sends via Twilio |
| `/api/auth/verify-otp` | POST | `{ "whatsappNumber": "9876543210", "otp": "123456" }` | Verifies hash, marks OTP used, upserts user, returns JWT |

**Test the API directly (optional):**

```bash
# Send OTP (replace number with yours)
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"whatsappNumber": "9876543210"}'

# Expected response:
# {"success":true,"message":"OTP sent to +919876543210 on WhatsApp.","expiresAt":"..."}

# Verify OTP (replace 123456 with OTP from terminal/WhatsApp)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"whatsappNumber": "9876543210", "otp": "123456"}'

# Expected response:
# {"success":true,"message":"OTP verified successfully.","token":"...","user":{...}}
```
