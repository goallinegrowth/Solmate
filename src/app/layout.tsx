import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SolMate — AI Coaching Assistant",
  description:
    "AI-powered coaching assistant for Sol Sports Club, a youth soccer academy in Central Florida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-white pb-20`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
