import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carlo Fonollera — AI Automation Specialist",
  description:
    "Senior Software Engineer with 10+ years in QA, Automation, and Python-based system integration. Ask me anything.",
  openGraph: {
    title: "Carlo Fonollera — AI Automation Specialist",
    description: "AI-native portfolio. Ask Carlo anything about his work, skills, and projects.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
