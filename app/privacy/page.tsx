import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Healthify Women's Fitness Club",
  description: "How Healthify collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main style={{ background: "#080808", minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px" }}>
      {/* Subtle grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,130,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,130,0,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: "56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "32px", height: "1px", background: "#FF8200", opacity: 0.5 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", color: "#FF8200" }}>LEGAL</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.8rem, 6vw, 4rem)", color: "#F5F0EB", lineHeight: 0.95, marginBottom: "16px" }}>
            PRIVACY POLICY
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 300, color: "rgba(245,240,235,0.35)" }}>
            Effective date: 1 June 2025 &nbsp;·&nbsp; Healthify Women&apos;s Fitness Club, Port Blair
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

          <Section title="Who We Are">
            Healthify Women&apos;s Fitness Club (&quot;Healthify&quot;, &quot;we&quot;, &quot;our&quot;) is a women-only fitness facility
            operating in Port Blair, Andaman &amp; Nicobar Islands, India. This policy explains how we handle
            personal information collected through our website, booking forms, and membership process.
          </Section>

          <Section title="Information We Collect">
            When you use our website or services, we may collect:
            <List items={[
              "Full name, email address, and phone number submitted via booking or contact forms",
              "Fitness goals you provide when booking a session",
              "Visit date and time slot preferences",
              "Payment transaction references (processed entirely by Razorpay — we do not store card details)",
              "Technical data such as browser type and IP address (collected automatically by hosting infrastructure)",
            ]} />
          </Section>

          <Section title="How We Use Your Information">
            <List items={[
              "To confirm and manage your gym bookings and membership",
              "To send you booking confirmations and updates via WhatsApp or phone",
              "To respond to enquiries submitted through our contact form",
              "To notify you of relevant offers, events, or schedule changes (you may opt out at any time)",
              "To comply with legal obligations under Indian law",
            ]} />
          </Section>

          <Section title="Payments">
            All online payments are processed by Razorpay Software Pvt. Ltd. Healthify does not receive
            or store your card number, CVV, or banking credentials. Your payment data is governed by
            Razorpay&apos;s Privacy Policy. We only receive a transaction reference ID upon successful payment.
          </Section>

          <Section title="Data Storage & Security">
            Your data is stored on Supabase — a secure, encrypted cloud database compliant with industry
            standards. We use JWT-based authentication and HTTPS throughout. Access to personal data is
            restricted to authorised staff only.
          </Section>

          <Section title="Data Sharing">
            We do not sell, rent, or trade your personal information. We share data only with:
            <List items={[
              "Razorpay, to process payments",
              "Government or law-enforcement agencies, if required by law",
            ]} />
            No data is shared for marketing purposes with any third party.
          </Section>

          <Section title="Data Retention">
            We retain your personal information for as long as your membership is active or as required by
            applicable law. You may request deletion of your data at any time by contacting us — see below.
          </Section>

          <Section title="Your Rights">
            Under India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act) you have the right to:
            <List items={[
              "Access the personal data we hold about you",
              "Request correction of inaccurate data",
              "Request erasure of your data (subject to legal retention requirements)",
              "Withdraw consent for non-essential communications at any time",
            ]} />
          </Section>

          <Section title="Contact Us">
            For privacy-related requests or questions, contact us at:
            <div style={{ marginTop: "12px", background: "rgba(255,130,0,0.04)", border: "1px solid rgba(255,130,0,0.12)", padding: "16px 20px", borderRadius: "6px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 600, color: "#F5F0EB", marginBottom: "4px" }}>
                Healthify Women&apos;s Fitness Club
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 300, color: "rgba(245,240,235,0.5)", lineHeight: 1.7 }}>
                Port Blair, Andaman &amp; Nicobar Islands, India<br />
                WhatsApp / Phone: +91 94742 87111
              </div>
            </div>
          </Section>

          <Section title="Changes to This Policy">
            We may update this policy from time to time. The effective date at the top of this page will
            reflect the latest revision. Continued use of our services after changes constitutes acceptance
            of the updated policy.
          </Section>

        </div>

        {/* Back link */}
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
