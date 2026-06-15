import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BrainstormProvider } from "@/context/BrainstormContext";
import { AnimatePresenceWrapper } from "@/components/AnimatePresenceWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brainstormer — Structured Brainstorming",
  description:
    "A collaborative brainstorming tool based on Getting to Yes principles. Organize ideas, prioritize, and make better decisions together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BrainstormProvider>
          <AnimatePresenceWrapper>{children}</AnimatePresenceWrapper>
        </BrainstormProvider>
      </body>
    </html>
  );
}
