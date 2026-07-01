import type { Metadata } from "next";
import AboutClient from "../_components/AboutClient";

export const metadata: Metadata = {
  title: "About Us | Women Only Fitness Club in Sri Vijaya Puram",
  description:
    "Discover Healthify's story — a women only fitness club in Sri Vijaya Puram (Port Blair) built to help women of all ages build strength, confidence and community.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Healthify | Women Only Fitness Club in Sri Vijaya Puram",
    description:
      "Discover Healthify's story — a women only fitness club in Sri Vijaya Puram (Port Blair) built to help women build strength, confidence and community.",
    url: "/about",
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
  return <AboutClient />;
}
