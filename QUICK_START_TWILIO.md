# Twilio WhatsApp OTP — 5-Minute Setup

Just the essentials. Nothing extra.

---

## Step 1 — Get Your Credentials (2 min)

1. Go to [https://console.twilio.com](https://console.twilio.com) and sign in (create a free account if you don't have one)
2. On the dashboard, find the **"Account Info"** box on the right side
3. Copy **Account SID** — it starts with `AC`
4. Click the **eye icon** next to Auth Token to reveal it, then copy it
5. In the left sidebar: **Messaging → Try it out → Send a WhatsApp message**
6. Note the sandbox number shown — looks like `+1 415 523 8886`

---

## Step 2 — Join the Sandbox (1 min)

On your phone:

1. Open **WhatsApp**
2. Start a new message to: `+1 415 523 8886`
3. Send the join code shown on the Twilio page — e.g. `join sandy-elephant`
4. Wait for the reply: *"You are now connected to the sandbox"*

Done. Your phone can now receive test OTPs.

---

## Step 3 — Fill in .env.local (30 sec)

Open `healthify/.env.local` and paste your values:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=+14155238886
```

Save the file.

---

## Step 4 — Restart and Test (1 min)

1. Stop the dev server: `Ctrl + C`
2. Start it again: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)
4. Click **Login** → enter your phone number → click **Send OTP**
5. Check WhatsApp — OTP arrives within seconds
6. Enter the 6 digits → you're logged in

---

## Testing Without Twilio

Skip Steps 1–3. Leave the Twilio fields empty in `.env.local`.

The OTP will be printed in your terminal instead:

```
[DEV OTP] +919876543210 → 482910
```

Just type those digits into the login modal.

---

**Something not working?** See [TESTING_OTP.md](./TESTING_OTP.md) for detailed troubleshooting.  
**Need the full Twilio setup walkthrough?** See [TWILIO_SETUP.md](./TWILIO_SETUP.md).
