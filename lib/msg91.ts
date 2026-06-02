// WhatsApp notifications via Fast2SMS

const BASE = "https://www.fast2sms.com/dev";

function normalise(phone: string) {
  return phone.replace(/^\+/, "").replace(/\D/g, "");
}

// Free-form message (for owner notifications — no template needed)
async function sendWhatsApp(numbers: string, message: string): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) { console.log("[Fast2SMS WA] Not configured — skipping."); return false; }
  try {
    const res = await fetch(`${BASE}/wa-group`, {
      method: "POST",
      headers: { authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ message, numbers }),
    });
    const data = await res.json() as { return?: boolean };
    return data.return === true;
  } catch (err) {
    console.error("[Fast2SMS WA free-form]", err);
    return false;
  }
}

// Template message (for approved templates)
async function sendTemplate(
  numbers: string,
  templateName: string,
  variables: Record<string, string>
): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) { console.log("[Fast2SMS Template] Not configured — skipping."); return false; }
  try {
    const res = await fetch(`${BASE}/wa-template`, {
      method: "POST",
      headers: { authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ numbers, template_name: templateName, variables }),
    });
    const data = await res.json() as { return?: boolean; message?: unknown };
    if (data.return !== true) console.error("[Fast2SMS Template] Failed:", JSON.stringify(data));
    return data.return === true;
  } catch (err) {
    console.error("[Fast2SMS Template]", err);
    return false;
  }
}

export async function sendOwnerBookingNotification(details: {
  userName: string | null;
  userPhone: string;
  serviceName: string;
  date: string;
  time: string;
  amountPaise: number;
  bookingId: string;
}): Promise<void> {
  const ownerPhone = process.env.OWNER_WHATSAPP_NUMBER;
  if (!ownerPhone) return;

  const shortId = details.bookingId.slice(0, 8).toUpperCase();
  const amountRupees = (details.amountPaise / 100).toFixed(0);
  const ist = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true });

  // Use approved Fast2SMS template: healthify_owner_booking
  await sendTemplate(normalise(ownerPhone), "healthify_owner_booking", {
    "1": details.userName ?? "New Member",
    "2": details.userPhone,
    "3": details.serviceName,
    "4": details.date,
    "5": details.time,
    "6": `₹${amountRupees}`,
    "7": `BK-${shortId}`,
  });
  void ist; // suppress unused warning
}

export async function sendUserBookingConfirmation(
  phone: string,
  details: { serviceName: string; date: string; time: string; bookingId: string }
): Promise<void> {
  const shortId = details.bookingId.slice(0, 8).toUpperCase();

  // Use approved Fast2SMS template: booking_confirmation_to_user
  await sendTemplate(normalise(phone), "booking_confirmation_to_user", {
    "1": details.serviceName,
    "2": details.date,
    "3": details.time,
    "4": `BK-${shortId}`,
  });
}
