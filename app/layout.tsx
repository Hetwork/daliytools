import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import AdsenseLoader from "./_components/adsense-loader";
import CookieConsent from "./_components/cookie-consent";
import SiteEffects from "./_components/site-effects";
import "./globals.css";
import "./design.css";

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
      "Free tools for PDFs, images, text, and code. Many run locally in your browser; server-based tools explain their processing.",
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
      suppressHydrationWarning
      className={`${archivo.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "(function(){var t;try{t=localStorage.getItem('daliy-theme')}catch(e){}document.documentElement.dataset.theme=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'})()" }} />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteEffects />
        {children}
        <CookieConsent />
        <AdsenseLoader />
      </body>
    </html>
  );
}
