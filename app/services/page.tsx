import type { Metadata } from "next";
import ServicesClient from "../_components/ServicesClient";

export const metadata: Metadata = {
  title: "Services & Classes | Strength, HIIT, Yoga & Zumba",
  description:
    "Explore Healthify's classes — strength training, HIIT, yoga, Zumba, functional training & personal coaching at our women's gym in Sri Vijaya Puram (Port Blair).",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services & Classes at Healthify | Women's Gym in Sri Vijaya Puram",
    description:
      "Strength training, HIIT, yoga, Zumba, functional training & personal coaching — explore every class at Healthify, Sri Vijaya Puram (Port Blair).",
    url: "/services",
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
  return <ServicesClient />;
}
