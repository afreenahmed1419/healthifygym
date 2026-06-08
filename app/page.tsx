import type { Metadata } from "next";
import HomeClient from "./_components/HomeClient";

export const metadata: Metadata = {
  title: "Healthify | Women's Fitness Gym in Sri Vijaya Puram (Port Blair)",
  description:
    "Join Healthify, the exclusive women's fitness gym in Sri Vijaya Puram (Port Blair), Andaman & Nicobar Islands. Strength training, group classes & coaching for ages 14 to 65.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Healthify | Women's Fitness Gym in Sri Vijaya Puram (Port Blair)",
    description:
      "Join Healthify, the exclusive women's fitness gym in Sri Vijaya Puram (Port Blair). Strength training, group classes & coaching for ages 14 to 65.",
    url: "/",
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
  return <HomeClient />;
}
