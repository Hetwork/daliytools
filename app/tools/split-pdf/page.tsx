import type { Metadata } from "next";
import SplitPdfContent from "./split-pdf-content";

export const metadata: Metadata = {
  title: "Split PDF Online — Free, Fast & Private | Daliy.Tools",
  description:
    "Extract pages, separate single pages, or split PDF documents into separate files online for free. 100% private in-browser tool with zero server uploads.",
  keywords: [
    "split pdf",
    "extract pdf pages",
    "separate pdf pages online",
    "free pdf splitter",
    "cut pdf pages",
    "daily tools split pdf",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/split-pdf",
  },
  openGraph: {
    title: "Split PDF Online — Free & Private | Daliy.Tools",
    description:
      "Separate and extract pages from any PDF document safely in your browser. Fast, free, and completely secure.",
    url: "https://daliy.tools/tools/split-pdf",
    siteName: "Daliy.Tools",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Split PDF - Daliy.Tools",
      "url": "https://daliy.tools/tools/split-pdf",
      "description":
        "Free tool to extract and split pages from PDF documents securely in the browser.",
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
          "name": "Can I extract non-consecutive pages?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. You can enter specific pages or custom ranges (e.g. 1, 3, 5-8) to extract only what you need.",
          },
        },
        {
          "@type": "Question",
          "name": "Is my confidential document stored anywhere?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "No. Extraction is performed entirely in client-side memory. Your documents are never uploaded to any server.",
          },
        },
      ],
    },
  ],
};

export default function SplitPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SplitPdfContent />
    </>
  );
}
