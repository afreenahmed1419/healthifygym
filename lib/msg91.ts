import axios from "axios";

const API_URL = "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/";

function normalise(phone: string) {
  return phone.replace(/^\+/, "");
}

async function post(payload: object): Promise<boolean> {
  const authKey = process.env.MSG91_AUTH_KEY;
  if (!authKey) {
    console.log("[MSG91] Not configured — skipping notification.");
    return false;
  }
  try {
    await axios.post(API_URL, payload, {
      headers: { authkey: authKey, "content-type": "application/json" },
    });
    return true;
  } catch (err: unknown) {
    const e = err as { response?: { data?: unknown } };
    console.error("[MSG91]", e?.response?.data ?? err);
    return false;
  }
}

function template(to: string, name: string, components: object[]) {
  return {
    integrated_number: process.env.MSG91_SENDER_NUMBER ?? "15559838251",
    content_type: "template",
    payload: {
      to: normalise(to),
      type: "template",
      template: {
        name,
        language: { code: "en", policy: "deterministic" },
        components,
      },
    },
  };
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
  await post(
    template(ownerPhone, process.env.MSG91_OWNER_NOTIF_TEMPLATE ?? "healthify_owner_booking", [
      {
        type: "body",
        parameters: [
          { type: "text", text: details.userName ?? "New Member" },
          { type: "text", text: details.userPhone },
          { type: "text", text: details.serviceName },
          { type: "text", text: details.date },
          { type: "text", text: details.time },
          { type: "text", text: `₹${amountRupees}` },
          { type: "text", text: `BK-${shortId}` },
        ],
      },
    ])
  );
}

export async function sendUserBookingConfirmation(
  phone: string,
  details: { serviceName: string; date: string; time: string; bookingId: string }
): Promise<void> {
  const shortId = details.bookingId.slice(0, 8).toUpperCase();
  await post(
    template(phone, process.env.MSG91_BOOKING_TEMPLATE ?? "healthify_booking_confirmed", [
      {
        type: "body",
        parameters: [
          { type: "text", text: details.serviceName },
          { type: "text", text: details.date },
          { type: "text", text: details.time },
          { type: "text", text: `BK-${shortId}` },
        ],
      },
    ])
  );
}
