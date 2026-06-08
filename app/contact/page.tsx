import type { Metadata } from "next";
import ContactClient from "../_components/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Healthify Sri Vijaya Puram Address & Location",
  description:
    "Find Healthify's address, phone, email & opening hours. Visit our women's gym opposite the petrol pump in Delanipur, Sri Vijaya Puram (Port Blair) 744102.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Healthify | Sri Vijaya Puram (Port Blair) Gym Location",
    description:
      "Address, phone, email & opening hours for Healthify's women's gym in Delanipur, Sri Vijaya Puram (Port Blair), Andaman & Nicobar Islands 744102.",
    url: "/contact",
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
  return <ContactClient />;
}
