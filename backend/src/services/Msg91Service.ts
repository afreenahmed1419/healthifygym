import axios from "axios";
import { env } from "../config/env";

const API_URL = "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/";

function normalizePhone(phone: string): string {
  return phone.replace(/^\+/, "");
}

async function post(payload: object): Promise<boolean> {
  if (!env.msg91AuthKey) {
    if (env.isDev) {
      console.log("[DEV MSG91]", JSON.stringify(payload, null, 2));
      return true;
    }
    console.error("[MSG91] MSG91_AUTH_KEY not set.");
    return false;
  }
  try {
    await axios.post(API_URL, payload, {
      headers: { authkey: env.msg91AuthKey, "content-type": "application/json" },
    });
    return true;
  } catch (err: any) {
    console.error("[MSG91] API error:", err?.response?.data ?? err);
    return false;
  }
}

function templatePayload(to: string, templateName: string, components: object[]) {
  return {
    integrated_number: env.msg91SenderNumber,
    content_type: "template",
    payload: {
      to: normalizePhone(to),
      type: "template",
      template: {
        name: templateName,
        language: { code: "en", policy: "deterministic" },
        components,
      },
    },
  };
}

export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  return post(
    templatePayload(phone, env.msg91OtpTemplate, [
      { type: "body", parameters: [{ type: "text", text: otp }] },
      { type: "button", sub_type: "copy_code", index: "0", parameters: [{ type: "coupon_code", coupon_code: otp }] },
    ])
  );
}

export async function sendBookingConfirmation(
  phone: string,
  details: { serviceName: string; date: string; time: string; bookingId: string }
): Promise<boolean> {
  const shortId = details.bookingId.slice(0, 8).toUpperCase();
  return post(
    templatePayload(phone, env.msg91BookingTemplate, [
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

export async function sendOwnerNotification(details: {
  userName: string | null;
  userPhone: string;
  serviceName: string;
  date: string;
  time: string;
  amountPaise: number;
  bookingId: string;
}): Promise<boolean> {
  const ownerPhone = env.ownerWhatsapp;
  if (!ownerPhone) {
    console.warn("[MSG91] OWNER_WHATSAPP_NUMBER not set — skipping owner notification.");
    return false;
  }
  const shortId = details.bookingId.slice(0, 8).toUpperCase();
  const amountRupees = (details.amountPaise / 100).toFixed(0);
  return post(
    templatePayload(ownerPhone, env.msg91OwnerNotifTemplate, [
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

export async function sendAppointmentConfirmation(
  phone: string,
  details: { type: string; date: string; time: string }
): Promise<boolean> {
  return post(
    templatePayload(phone, env.msg91AppointmentTemplate, [
      {
        type: "body",
        parameters: [
          { type: "text", text: details.type },
          { type: "text", text: details.date },
          { type: "text", text: details.time },
        ],
      },
    ])
  );
}

export async function sendContactEnquiry(
  ownerPhone: string,
  details: { name: string; phone: string; email?: string; message?: string; branch?: string }
): Promise<boolean> {
  return post(
    templatePayload(ownerPhone, env.msg91ContactTemplate, [
      {
        type: "body",
        parameters: [
          { type: "text", text: details.name },
          { type: "text", text: details.phone },
          { type: "text", text: details.email ?? "N/A" },
          { type: "text", text: details.branch ?? "N/A" },
          { type: "text", text: details.message ?? "N/A" },
        ],
      },
    ])
  );
}

// For inbound WhatsApp session replies (24h window)
export async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  if (!env.msg91AuthKey) {
    if (env.isDev) {
      console.log(`[DEV MSG91] → ${to}:\n${body}`);
      return true;
    }
    console.error("[MSG91] MSG91_AUTH_KEY not set.");
    return false;
  }
  try {
    await axios.post(
      API_URL,
      {
        integrated_number: env.msg91SenderNumber,
        content_type: "text",
        payload: {
          to: normalizePhone(to),
          type: "text",
          text: { body },
        },
      },
      { headers: { authkey: env.msg91AuthKey, "content-type": "application/json" } }
    );
    return true;
  } catch (err: any) {
    console.error("[MSG91] Failed to send message:", err?.response?.data ?? err);
    return false;
  }
}
