import type { Metadata } from "next";
import QrCodeGeneratorContent from "./qr-code-generator-content";

export const metadata: Metadata = {
  title: "Free QR Code Generator — Create Custom QR Codes | Daliy.Tools",
  description:
    "Generate custom, high-resolution QR codes for URLs, Wi-Fi networks, text, contacts, and emails for free. 100% private, instant download with zero tracking.",
  keywords: [
    "qr code generator",
    "create qr code online",
    "free qr maker",
    "wifi qr code generator",
    "custom qr code generator",
    "daily tools qr code",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/qr-code-generator",
  },
  openGraph: {
    title: "Free QR Code Generator — Instant & Private | Daliy.Tools",
    description:
      "Generate custom QR codes instantly for links, Wi-Fi, and text. No sign-up, no expired links, completely free.",
    url: "https://daliy.tools/tools/qr-code-generator",
    siteName: "Daliy.Tools",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "QR Code Generator - Daliy.Tools",
      "url": "https://daliy.tools/tools/qr-code-generator",
      "description":
        "Free tool to generate high-resolution QR codes directly in the web browser.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do these QR codes ever expire?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "No. Daliy.Tools generates static, direct QR codes that contain your exact data without intermediate redirects, so they work forever.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I use the generated QR codes for commercial projects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. All QR codes generated here are 100% free for both personal and commercial use without attribution required.",
          },
        },
      ],
    },
  ],
};

export default function QrCodeGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QrCodeGeneratorContent />
    </>
  );
}
