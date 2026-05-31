import type { Metadata } from "next";
import { Geist, Bebas_Neue, Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import PageTransition from "./_components/PageTransition";

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

export const metadata: Metadata = {
  title: "Healthify — Exclusive Ladies Fitness Club",
  description:
    "Empowering women from 14 to 65 to build strength, confidence and a healthier, unstoppable tomorrow.",
  keywords: ["women fitness", "ladies gym", "healthify", "strength training", "women wellness", "India"],
  openGraph: {
    title: "Healthify — Exclusive Ladies Fitness Club",
    description: "Strength Is Her Power. Join 2500+ women transforming their lives.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${bebasNeue.variable} ${barlowCondensed.variable} ${barlow.variable}`}>
      <body className="bg-[#0d0d0d] text-white antialiased">
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
