import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import AdsenseLoader from "./_components/adsense-loader";
import CookieConsent from "./_components/cookie-consent";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://daliy.tools"),
  title: {
    default: "Daliy.Tools — Free Everyday Online Tools & Utilities",
    template: "%s | Daliy.Tools",
  },
  description:
    "Free, fast, and private online tools for everyday tasks. Compress PDFs, resize images, format code, generate QR codes, and more directly in your browser.",
  keywords: [
    "daily tools",
    "free online tools",
    "everyday utilities",
    "pdf tools",
    "image compressor",
    "qr code generator",
    "browser tools",
    "developer utilities",
  ],
  authors: [{ name: "Daliy.Tools Team" }],
  creator: "Daliy.Tools",
  publisher: "Daliy.Tools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Daliy.Tools — Everyday Tools, Actually Simple",
    description:
      "Free, private online tools for daily tasks. No file uploads to servers, no popups, no accounts needed.",
    url: "https://daliy.tools",
    siteName: "Daliy.Tools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daliy.Tools — Everyday Tools, Actually Simple",
    description:
      "Fast, free, and private everyday utilities in your browser.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CookieConsent />
        <AdsenseLoader />
      </body>
    </html>
  );
}
