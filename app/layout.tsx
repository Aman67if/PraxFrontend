import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Praxes",
  description: "Frontend for Praxes EdTech platform (Under Development)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script src="/mathjax-config.mjs" strategy="beforeInteractive" />
        <Script
          src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
