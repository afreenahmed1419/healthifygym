import { Request, Response } from "express";
import { getUserByPhone } from "../services/SupabaseService";
import { searchFAQs } from "../services/FAQService";
import { sendWhatsAppMessage } from "../services/TwilioService";

const HELP_TEXT =
  `👋 *Welcome to Healthify Women's Fitness Club!*\n\n` +
  `You can type:\n` +
  `• *BOOK* — to book a class\n` +
  `• *APPOINTMENTS* — to enquire about appointments\n` +
  `• *HELP* — to see this menu\n` +
  `• Any question — and I'll search our FAQs for you!\n\n` +
  `Or visit our website to get started 💪`;

export async function incomingWhatsAppHandler(req: Request, res: Response): Promise<void> {
  const body: string = (req.body?.Body ?? "").trim();
  const from: string = (req.body?.From ?? "").replace("whatsapp:", "");

  if (!from) {
    res.status(400).json({ success: false, message: "Missing From field." });
    return;
  }

  const upper = body.toUpperCase();

  if (!body || upper === "HELP") {
    await sendWhatsAppMessage(from, HELP_TEXT);
    res.status(200).send("OK");
    return;
  }

  if (upper === "BOOK") {
    const user = await getUserByPhone(from);
    const name = user?.name ?? "there";
    await sendWhatsAppMessage(
      from,
      `Hi ${name}! 🏋️\n\nTo book a class, visit our website and log in with your WhatsApp number.\n\nWe offer Yoga, Zumba, Pilates, and more. See you soon! 💪`
    );
    res.status(200).send("OK");
    return;
  }

  if (upper === "APPOINTMENTS") {
    await sendWhatsAppMessage(
      from,
      `📅 *Book an Appointment*\n\nVisit our website to request a consultation appointment or send us a direct message and we'll get back to you shortly.`
    );
    res.status(200).send("OK");
    return;
  }

  // Default: FAQ search
  const results = await searchFAQs(body, 3);

  if (results.length === 0) {
    await sendWhatsAppMessage(
      from,
      `Sorry, I couldn't find an answer to that. 😕\n\nType *HELP* to see what I can do, or visit our website for more information.`
    );
  } else {
    const reply =
      `Here's what I found:\n\n` +
      results
        .map((faq, i) => `*${i + 1}. ${faq.question}*\n${faq.answer}`)
        .join("\n\n") +
      `\n\nType *HELP* for more options.`;
    await sendWhatsAppMessage(from, reply);
  }

  res.status(200).send("OK");
}
