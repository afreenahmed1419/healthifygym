import type { Metadata } from "next";
import MembershipsClient from "../_components/MembershipsClient";

export const metadata: Metadata = {
  title: "Membership Plans | Join Healthify Sri Vijaya Puram",
  description:
    "Compare Healthify's membership plans starting at ₹1,499/month — gym access, group classes, personal coaching & nutrition guidance in Sri Vijaya Puram (Port Blair).",
  alternates: { canonical: "/memberships" },
  openGraph: {
    title: "Membership Plans at Healthify | Women's Gym in Sri Vijaya Puram",
    description:
      "Gym access, group classes, personal coaching & nutrition guidance — compare Healthify's membership plans for women in Sri Vijaya Puram (Port Blair).",
    url: "/memberships",
    siteName: "Healthify",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 1600,
        height: 800,
        alt: "Healthify — Women's Fitness Gym in Sri Vijaya Puram, Andaman & Nicobar Islands",
      },
    ],
  },
};

export default function Page() {
  return <MembershipsClient />;
}
