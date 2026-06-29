import type { Metadata } from "next";
import { Jost, Cormorant_Garamond, Geist_Mono } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aletta Scarf | Premium Medical Hijab",
  description: "Website e-commerce Aletta Scarf, menyediakan hijab medis premium untuk tenaga kesehatan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jost.variable} ${cormorantGaramond.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-pink-200 selection:text-pink-900">
        {children}
      </body>
    </html>
  );
}
