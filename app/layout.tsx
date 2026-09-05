import type { Metadata } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { generateWebSiteStructuredData } from "@/lib/structured-data";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap"
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.addiscrown.et"),
  title: {
    default: "Addis Crown — Law, Rights & Policy, Explained",
    template: "%s | Addis Crown"
  },
  description:
    "Plain-language explainers on Ethiopian law, rights, and the policy questions shaping how AI and institutions affect ordinary people."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const websiteStructuredData = generateWebSiteStructuredData();

  return (
    <html lang="en" className={`${newsreader.variable} ${publicSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
      </head>
      <body className="font-body flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
