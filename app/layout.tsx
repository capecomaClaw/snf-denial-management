import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const geist = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SNF Denial Management Agent | HorizonCare AI",
  description: "AI-powered SNF claim denial categorization, appeal letter generation, and deadline tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>{children}</body>
    </html>
  );
}
