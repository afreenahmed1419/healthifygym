// WhatsApp notifications via Fast2SMS

const FAST2SMS_PHONE_NUMBER_ID = "1116898334844898";

function normalise(phone: string) {
  // Fast2SMS expects 10-digit number without country code
  const digits = phone.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
}

// Send approved WhatsApp template via Fast2SMS GET API
async function sendTemplate(
  toPhone: string,
  messageId: string,
  variables: string[]
): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.log("[Fast2SMS Template] FAST2SMS_API_KEY not configured — skipping.");
    return false;
  }

  const params = new URLSearchParams({
    authorization: apiKey,
    message_id: messageId,
    phone_number_id: FAST2SMS_PHONE_NUMBER_ID,
    numbers: normalise(toPhone),
    variables_values: variables.join("|"),
  });

  try {
    const res = await fetch(`https://www.fast2sms.com/dev/whatsapp?${params.toString()}`, {
      method: "GET",
    });
    const data = await res.json() as { return?: boolean; message?: string[] };
    if (!data.return) console.error("[Fast2SMS Template] Failed:", JSON.stringify(data));
    return data.return === true;
  } catch (err) {
    console.error("[Fast2SMS Template] Error:", err);
    return false;
  }
}

// Owner booking notification — uses approved template healthify_owner_booking (message_id: 22167)
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

  await sendTemplate(ownerPhone, "22167", [
    details.userName ?? "New Member",   // {{1}} Name
    details.userPhone,                   // {{2}} Phone
    details.serviceName,                 // {{3}} Service
    details.date,                        // {{4}} Date
    details.time,                        // {{5}} Time
    `₹${amountRupees}`,                 // {{6}} Amount
    `BK-${shortId}`,                    // {{7}} Booking ID
  ]);
}

// User booking confirmation — uses approved template booking_confirmation_to_user (message_id: 22192)
export async function sendUserBookingConfirmation(
  phone: string,
  details: { serviceName: string; date: string; time: string; bookingId: string }
): Promise<void> {
  const shortId = details.bookingId.slice(0, 8).toUpperCase();

  await sendTemplate(phone, "22192", [
    details.serviceName,   // {{1}} Service
    details.date,          // {{2}} Date
    details.time,          // {{3}} Time
    `BK-${shortId}`,      // {{4}} Booking ID
  ]);
}
