import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeString, sanitizePhone, sanitizeEmail } from "@/lib/sanitize";
import { validatePhoneNumber } from "@/lib/auth";

const FAST2SMS_BASE = "https://www.fast2sms.com/dev";
const FAST2SMS_PHONE_NUMBER_ID = "1116898334844898";

async function sendContactEnquiry(details: {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  branch?: string;
}) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const ownerPhone = process.env.OWNER_WHATSAPP_NUMBER;

  if (!apiKey || !ownerPhone) {
    console.warn("[Contact] Fast2SMS not configured — skipping notification");
    return;
  }

  const ownerDigits = ownerPhone.replace(/\D/g, "").slice(-10);

  const message =
    `📩 NEW CONTACT ENQUIRY\n\n` +
    `Name: ${details.name}\n` +
    `Phone: ${details.phone}\n` +
    `Email: ${details.email ?? "N/A"}\n` +
    `Branch: ${details.branch ?? "N/A"}\n` +
    `Message: ${details.message ?? "N/A"}\n\n` +
    `— Healthify Website`;

  await fetch(`${FAST2SMS_BASE}/wa-group`, {
    method: "POST",
    headers: { authorization: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ message, numbers: ownerDigits }),
  });
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 contact requests per IP per 10 minutes
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const rl = rateLimit(`contact:${ip}`, 3, 10 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait a few minutes." }, { status: 429 });
    }

    const raw = await req.json();

    // Honeypot — a hidden field humans never see; if it's filled, it's a bot.
    if (typeof raw.company === "string" && raw.company.trim() !== "") {
      return NextResponse.json({ success: true, message: "Message received. We'll reach out on WhatsApp shortly." });
    }

    // Sanitize all inputs
    const name = sanitizeString(raw.name);
    const whatsappNumber = sanitizePhone(raw.whatsappNumber);
    const email = raw.email ? sanitizeEmail(raw.email) : undefined;
    const message = raw.message ? sanitizeString(raw.message).slice(0, 500) : undefined;
    const preferredBranch = raw.preferredBranch ? sanitizeString(raw.preferredBranch) : undefined;

    // Validate required fields
    if (!name || !whatsappNumber) {
      return NextResponse.json({ error: "Name and WhatsApp number are required." }, { status: 400 });
    }

    if (!validatePhoneNumber(whatsappNumber)) {
      return NextResponse.json({ error: "Enter a valid 10-digit Indian mobile number." }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    await sendContactEnquiry({ name, phone: whatsappNumber, email, message, branch: preferredBranch });

    return NextResponse.json({ success: true, message: "Message received. We'll reach out on WhatsApp shortly." });
  } catch (err) {
    console.error("[Contact] Error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
