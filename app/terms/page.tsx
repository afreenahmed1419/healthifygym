import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions — Healthify Women's Fitness Club",
  description: "Terms and conditions for using Healthify Women's Fitness Club services.",
};

export default function TermsPage() {
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
            TERMS &amp; CONDITIONS
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 300, color: "rgba(245,240,235,0.35)" }}>
            Effective date: 1 June 2025 &nbsp;·&nbsp; Healthify Women&apos;s Fitness Club, Port Blair
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

          <Section title="Acceptance of Terms">
            By visiting our website, booking a session, or purchasing a membership, you agree to be
            bound by these Terms &amp; Conditions. If you do not agree, please do not use our services.
          </Section>

          <Section title="Women-Only Policy">
            Healthify is a <strong style={{ color: "rgba(245,240,235,0.85)", fontWeight: 600 }}>100% women-only</strong> facility at all times.
            Membership and access are open exclusively to women aged 14 to 65. By joining, you
            confirm that you meet this eligibility criterion. Healthify reserves the right to refuse
            or revoke membership if this policy is not met.
          </Section>

          <Section title="Membership">
            <List items={[
              "Memberships are personal and non-transferable. They may not be shared or gifted to another person.",
              "Members must carry their membership ID or phone number for verification on entry.",
              "Healthify reserves the right to suspend or terminate a membership for misconduct, violation of gym rules, or behaviour that compromises the safety or comfort of other members.",
              "Membership fees are due in advance. Lapsed memberships do not carry over unused days.",
              "Prices are subject to change. Existing members will be notified at least 15 days before any price revision takes effect.",
            ]} />
          </Section>

          <Section title="Gym Rules & Conduct">
            <List items={[
              "Appropriate gym attire must be worn at all times.",
              "Members are responsible for cleaning equipment after use.",
              "Mobile phones should be used respectfully — photography or recording of other members is strictly prohibited.",
              "Personal trainers from outside Healthify are not permitted to train members on the premises.",
              "Children under 14 are not permitted inside the gym floor.",
            ]} />
          </Section>

          <Section title="Health & Medical Responsibility">
            You are responsible for ensuring that you are physically fit to participate in gym activities.
            Healthify strongly recommends consulting a physician before starting any new fitness programme,
            particularly if you have pre-existing medical conditions, are pregnant, or are post-surgery.
            <br /><br />
            Healthify trainers are fitness professionals and are not licensed medical practitioners.
            Nothing communicated by our staff constitutes medical advice.
          </Section>

          <Section title="Liability">
            Healthify takes all reasonable precautions to maintain a safe environment. However, to the
            fullest extent permitted by applicable law:
            <List items={[
              "Healthify is not liable for any personal injury, illness, or loss of property sustained on the premises, unless caused by the gross negligence of Healthify staff.",
              "Members use the gym facilities and equipment entirely at their own risk.",
              "Healthify is not responsible for loss or theft of personal belongings.",
            ]} />
          </Section>

          <Section title="Website & Online Bookings">
            <List items={[
              "Online bookings are subject to availability and confirmed only upon successful payment.",
              "We reserve the right to modify or discontinue any online service at any time without prior notice.",
              "You agree not to misuse this website or attempt to gain unauthorised access to any part of it.",
            ]} />
          </Section>

          <Section title="Intellectual Property">
            All content on this website — including text, images, logos, and design — is the property
            of Healthify Women&apos;s Fitness Club and may not be reproduced, distributed, or used without
            prior written permission.
          </Section>

          <Section title="Governing Law">
            These Terms are governed by and construed in accordance with the laws of India. Any disputes
            arising shall be subject to the exclusive jurisdiction of the courts in Port Blair, Andaman
            &amp; Nicobar Islands.
          </Section>

          <Section title="Contact">
            <div style={{ background: "rgba(255,130,0,0.04)", border: "1px solid rgba(255,130,0,0.12)", padding: "16px 20px", borderRadius: "6px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: "#FF8200", marginBottom: "10px" }}>HEALTHIFY WOMEN&apos;S FITNESS CLUB</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 300, color: "rgba(245,240,235,0.5)", lineHeight: 1.7 }}>
                Port Blair, Andaman &amp; Nicobar Islands, India<br />
                WhatsApp / Phone: +91 94742 87111
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
