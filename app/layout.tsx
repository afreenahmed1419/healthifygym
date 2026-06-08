import type { Metadata } from "next";
import { Geist, Bebas_Neue, Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import PageTransition from "./_components/PageTransition";
import StructuredData from "./_components/StructuredData";

const ChatbotWidget = dynamic(() => import("./_components/ChatbotWidget"));

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const barlow = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://www.healthifygym.in";
const DEFAULT_DESCRIPTION =
  "Healthify is a women-only fitness gym in Sri Vijaya Puram (Port Blair), Andaman & Nicobar Islands — strength training, group classes & coaching for ages 14 to 65.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Healthify Sri Vijaya Puram",
    default: "Healthify | Women's Fitness Gym in Sri Vijaya Puram (Port Blair)",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Healthify",
    "women's gym Port Blair",
    "ladies gym Port Blair",
    "women's gym Sri Vijaya Puram",
    "ladies gym Sri Vijaya Puram",
    "women's fitness gym Sri Vijaya Puram",
    "best women's fitness club Andaman",
    "women only fitness club",
    "strength training",
    "Andaman & Nicobar Islands",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Healthify | Women's Fitness Gym in Sri Vijaya Puram (Port Blair)",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
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
  twitter: {
    card: "summary_large_image",
    title: "Healthify | Women's Fitness Gym in Sri Vijaya Puram (Port Blair)",
    description: DEFAULT_DESCRIPTION,
    images: ["/logo.jpg"],
  },
  verification: {
    google: "D8_DPKn2z-fwWbtQyrS10ycITt0u6QuTT5UHasPcEu8",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${bebasNeue.variable} ${barlowCondensed.variable} ${barlow.variable}`}>
      <body className="bg-[#0d0d0d] text-white antialiased">
        <StructuredData />
        <AuthProvider>
          <Navbar />
          <PageTransition>{children}</PageTransition>
          <Footer />
          <ChatbotWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
