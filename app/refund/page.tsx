import Link from "next/link";

export const metadata = {
  title: "Refund & Cancellation Policy — Healthify Women's Fitness Club",
  description: "Healthify's refund and cancellation policy for memberships, bookings, and daily passes.",
};

export default function RefundPage() {
  return (
    <main style={{ background: "#080808", minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,130,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,130,0,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

        <div style={{ marginBottom: "56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "32px", height: "1px", background: "#FF8200", opacity: 0.5 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>LEGAL</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.8rem, 6vw, 4rem)", color: "#F5F0EB", lineHeight: 0.95, marginBottom: "16px" }}>
            REFUND &amp; CANCELLATION POLICY
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 300, color: "rgba(245,240,235,0.35)" }}>
            Effective date: 1 June 2025 &nbsp;·&nbsp; Healthify Women&apos;s Fitness Club, Sri Vijaya Puram
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

          <Section title="Membership Fees">
            All membership fees are collected in advance and are <strong style={{ color: "rgba(245,240,235,0.85)", fontWeight: 600 }}>non-refundable</strong> once
            the membership has been activated and gym access has been granted.
            <br /><br />
            We encourage you to visit the gym in person or speak with our team before purchasing a
            membership to ensure it is the right fit for you.
          </Section>

          <Section title="Refund Request Window">
            All refund requests — for any reason — must be raised within <strong style={{ color: "rgba(245,240,235,0.85)", fontWeight: 600 }}>3 days of the original purchase date</strong>. Requests submitted after this window will not be entertained under any circumstances.
          </Section>

          <Section title="Technical & Duplicate Payment Errors">
            If your payment was charged more than once, or if a payment was deducted but the booking
            was not confirmed due to a technical error, you are entitled to a full refund of the
            duplicate or failed transaction amount, provided the request is raised within 3 days of the transaction.
            <List items={[
              "Raise a refund request within 3 days of the transaction",
              "Contact us via WhatsApp (+91 94742 87111) with your transaction ID",
              "Refunds are processed within 7–10 business days back to your original payment method",
            ]} />
          </Section>

          <Section title="Daily Pass (Drop-In)">
            Daily passes are <strong style={{ color: "rgba(245,240,235,0.85)", fontWeight: 600 }}>non-refundable</strong> once purchased.
            If you are unable to attend on the booked day, please contact us in advance and we will
            do our best to accommodate a rescheduled visit at our discretion.
          </Section>

          <Section title="Class or Session Cancellation by Healthify">
            In the rare event that we cancel a scheduled class or session:
            <List items={[
              "You will be notified as early as possible via WhatsApp",
              "You will be offered a reschedule to an alternative slot at no extra charge",
              "If rescheduling is not possible, a credit equivalent to the session value will be applied to your account",
            ]} />
          </Section>

          <Section title="Lifetime Membership">
            The one-time Lifetime Membership fee of ₹3,000 is <strong style={{ color: "rgba(245,240,235,0.85)", fontWeight: 600 }}>non-refundable</strong> under
            any circumstances once access has been activated.
          </Section>

          <Section title="Happy Hours Discount">
            The ₹500 Happy Hours discount applies to sessions booked between 9:00 AM and 3:00 PM.
            Refunds will be calculated based on the actual amount paid after the discount.
          </Section>

          <Section title="How to Request a Refund">
            <div style={{ background: "rgba(255,130,0,0.04)", border: "1px solid rgba(255,130,0,0.12)", padding: "16px 20px", borderRadius: "6px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: "#FF8200", marginBottom: "10px" }}>CONTACT US</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 300, color: "rgba(245,240,235,0.5)", lineHeight: 1.7 }}>
                WhatsApp / Phone: +91 94742 87111<br />
                Please include your full name, transaction ID, and a brief description of the issue.
              </div>
            </div>
          </Section>

        </div>

        <div style={{ marginTop: "56px", paddingTop: "24px", borderTop: "1px solid rgba(255,130,0,0.1)" }}>
          <Link href="/" style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", color: "#FF8200", textDecoration: "none" }}>
            ← BACK TO HOME
          </Link>
        </div>

      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", color: "#FF8200", marginBottom: "12px", textTransform: "uppercase" as const }}>
        {title}
      </h2>
      <div style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 300, color: "rgba(245,240,235,0.6)", lineHeight: 1.85 }}>
        {children}
      </div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul style={{ marginTop: "10px", paddingLeft: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
      {items.map((item) => (
        <li key={item} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ color: "#FF8200", marginTop: "3px", flexShrink: 0 }}>›</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
