// WhatsApp notifications via Fast2SMS (replaces MSG91)

const BASE = "https://www.fast2sms.com/dev";

function normalise(phone: string) {
  return phone.replace(/^\+/, "").replace(/\D/g, "");
}

async function sendWhatsApp(numbers: string, message: string): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.log("[Fast2SMS WA] Not configured — skipping notification.");
    return false;
  }
  try {
    const res = await fetch(`${BASE}/wa-group`, {
      method: "POST",
      headers: { authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ message, numbers }),
    });
    const data = await res.json() as { return?: boolean };
    return data.return === true;
  } catch (err) {
    console.error("[Fast2SMS WA]", err);
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

  const message =
    `🎉 NEW BOOKING CONFIRMED\n\n` +
    `Name: ${details.userName ?? "New Member"}\n` +
    `Phone: ${details.userPhone}\n` +
    `Service: ${details.serviceName}\n` +
    `Date: ${details.date}\n` +
    `Time: ${details.time}\n` +
    `Amount: ₹${amountRupees} ✅\n` +
    `Booking ID: BK-${shortId}\n` +
    `At: ${ist}\n\n` +
    `— Healthify Women's Fitness Club`;

  await sendWhatsApp(normalise(ownerPhone), message);
}

export async function sendUserBookingConfirmation(
  phone: string,
  details: { serviceName: string; date: string; time: string; bookingId: string }
): Promise<void> {
  const shortId = details.bookingId.slice(0, 8).toUpperCase();

  const message =
    `✅ Booking Confirmed — Healthify\n\n` +
    `Service: ${details.serviceName}\n` +
    `Date: ${details.date}\n` +
    `Time: ${details.time}\n` +
    `Booking ID: BK-${shortId}\n\n` +
    `See you there! 💪\n— Healthify Women's Fitness Club`;

  await sendWhatsApp(normalise(phone), message);
}
