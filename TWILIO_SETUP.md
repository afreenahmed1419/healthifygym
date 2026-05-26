# Twilio WhatsApp OTP — Complete Setup Guide

This guide walks you through creating a Twilio account and connecting it to Healthify so members receive OTP codes on WhatsApp. No technical background needed — follow each step exactly.

---

## PART 1 — Create a Twilio Account

### Step 1: Go to Twilio's website

Open your browser and go to: **https://www.twilio.com**

Click the big **"Sign up"** or **"Start for free"** button (top-right corner of the page).

---

### Step 2: Fill in the sign-up form

You will see a form asking for:

| Field | What to enter |
|---|---|
| First Name | Your first name |
| Last Name | Your last name |
| Email | Your email address |
| Password | Create a strong password (8+ characters) |

Tick the checkbox to agree to Twilio's terms, then click **"Start your free trial"**.

---

### Step 3: Verify your email

Twilio sends a verification email to the address you entered.

1. Open your email inbox
2. Find the email from Twilio (subject: "Please confirm your email address")
3. Click the **"Confirm Email"** button inside it

You'll be taken back to Twilio and asked a few setup questions.

---

### Step 4: Answer the onboarding questions

Twilio asks what you plan to build. Answer like this:

| Question | Suggested answer |
|---|---|
| What are you building? | **Verification** |
| Which product do you plan to use first? | **Messaging** |
| What is your preferred coding language? | **Node.js** |

Click **"Get Started with Twilio"**.

---

### Step 5: Verify your personal phone number

Twilio asks you to verify a real phone number to activate your free trial.

1. Enter your mobile number with country code (e.g. `+91 98765 43210`)
2. Twilio will call you or send an SMS with a code
3. Enter that code on the screen

> This is Twilio's security check — it is NOT the WhatsApp OTP feature yet.

---

## PART 2 — Find Your Account SID and Auth Token

### Step 6: Go to the Console Dashboard

After verifying, you land on the **Twilio Console**.

The URL looks like: `https://console.twilio.com/`

You will see a box called **"Account Info"** — usually on the right side or bottom of the screen.

---

### Step 7: Copy Account SID

In the Account Info box you will see a line like:

```
Account SID
ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Click the **copy icon** next to that value (looks like two overlapping squares)
- Paste it somewhere safe (e.g., Notepad)

This is your `TWILIO_ACCOUNT_SID`.

---

### Step 8: Copy Auth Token

Just below the Account SID:

```
Auth Token
••••••••••••••••••••••••••••••••
```

The token is hidden by default.

1. Click the **eye icon** ( 👁 ) to reveal the token
2. Click the **copy icon** to copy it
3. Paste it somewhere safe

This is your `TWILIO_AUTH_TOKEN`.

> **IMPORTANT**: Never share your Auth Token with anyone. Treat it like a password. Never put it in your code directly.

---

## PART 3 — Set Up WhatsApp Sandbox

The WhatsApp Sandbox is a free testing environment from Twilio. You do NOT need a real WhatsApp Business account to test — the sandbox is enough during development.

### Step 9: Find the WhatsApp Sandbox page

In the left sidebar of the Twilio Console, click:

**Messaging** → **Try it out** → **Send a WhatsApp message**

> If you don't see a sidebar, look for the menu icon (≡) at the top-left.

---

### Step 10: Note the sandbox phone number

On this page you will see something like:

```
Twilio Sandbox for WhatsApp
+1 415 523 8886
```

This is the Twilio sandbox number that will send your OTPs. Note it down.

In your `.env.local` file this goes into: `TWILIO_WHATSAPP_FROM=+14155238886`

---

### Step 11: Activate the sandbox on your phone

Every person who wants to receive test OTPs must "join" the sandbox once. This is a one-time step per phone number.

1. Open **WhatsApp** on your phone
2. Start a new chat to: `+1 415 523 8886`
3. On the Twilio page, you will see a join code like: `join sandy-elephant`
4. Send that exact phrase to `+1 415 523 8886` on WhatsApp
5. You will receive a reply: **"You are now connected to the sandbox"**

Your phone is now ready to receive test OTPs.

---

### Step 12: (Optional) Add more testers

If the client or other team members also need to receive test OTPs, they each need to:

1. Message `+1 415 523 8886` on WhatsApp
2. Send the same join code: `join sandy-elephant`
3. Wait for the confirmation reply

Each person only needs to do this once.

---

## PART 4 — Add Credentials to Your Project

### Step 13: Open the .env.local file

In your project folder (`healthify/`), open the file named `.env.local`.

> If you can't see this file, make sure your file explorer shows hidden files. Files starting with `.` are hidden by default on Mac/Linux. On Windows they are visible.

---

### Step 14: Fill in your credentials

Replace the placeholder values with what you copied:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_WHATSAPP_FROM=+14155238886
```

**Do not add spaces around the `=` sign.**

Save the file.

---

### Step 15: Restart the dev server

After editing `.env.local`, you must restart the dev server for the changes to take effect.

1. Go to your terminal
2. Press `Ctrl + C` to stop the server
3. Run `npm run dev` again

---

## PART 5 — Credentials Summary

Here is everything in one place:

| Variable | Where to find it | Example format |
|---|---|---|
| `TWILIO_ACCOUNT_SID` | Console → Account Info | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Console → Account Info (eye icon to reveal) | `abcdef1234567890abcdef1234567890` |
| `TWILIO_WHATSAPP_FROM` | Messaging → Try it out → WhatsApp | `+14155238886` |

---

## PART 6 — Going Live (Production)

The sandbox works for testing. To go live with a real WhatsApp Business number:

1. In Twilio Console → **Messaging** → **Senders** → **WhatsApp senders**
2. Click **"Add a WhatsApp Sender"**
3. Follow Meta's WhatsApp Business verification process
   - Requires a Facebook Business account
   - Submit your business name, category, and description
   - Meta reviews and approves (typically 1–5 business days)
4. Once approved, replace `TWILIO_WHATSAPP_FROM` with your real WhatsApp business number

For the 5-minute quick version, see [QUICK_START_TWILIO.md](./QUICK_START_TWILIO.md).
