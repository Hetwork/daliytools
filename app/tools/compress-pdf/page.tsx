import type { Metadata } from "next";
import CompressPdfContent from "./compress-pdf-content";

export const metadata: Metadata = {
  title: "Compress PDF Online — Free, Fast & 100% Private | Daliy.Tools",
  description:
    "Compress and shrink PDF file size online for free without losing quality. 100% private in-browser processing — no file uploads, no limits, no watermarks.",
  keywords: [
    "compress pdf",
    "reduce pdf size online",
    "free pdf compressor",
    "shrink pdf file size",
    "compress pdf without losing quality",
    "private pdf compressor",
    "daily tools pdf",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/compress-pdf",
  },
  openGraph: {
    title: "Compress PDF Online — Free, Fast & Private | Daliy.Tools",
    description:
      "Shrink your PDF file size instantly in your browser. No file uploads to servers, no watermarks, completely free.",
    url: "https://daliy.tools/tools/compress-pdf",
    siteName: "Daliy.Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Online — Free & Private | Daliy.Tools",
    description:
      "Shrink your PDF file size safely in your browser. No uploads, fast and free.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Compress PDF - Daliy.Tools",
      "url": "https://daliy.tools/tools/compress-pdf",
      "description":
        "Free browser-based utility to reduce PDF file sizes securely without uploading files to remote servers.",
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
          "name": "Will compressing my PDF reduce text quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Our Balanced preset maintains high visual fidelity while significantly reducing file size. For high-resolution scanned documents, the High preset preserves crisp details.",
          },
        },
        {
          "@type": "Question",
          "name": "Are my PDF files uploaded to any servers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "No. Daliy.Tools runs PDF compression 100% inside your web browser. Your sensitive files never leave your device.",
          },
        },
        {
          "@type": "Question",
          "name": "Is there a limit on how many PDFs I can compress?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "There are no usage limits or daily caps. You can compress as many files as you need, completely free.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I compress password-protected PDFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "If your PDF is password-protected, you must unlock or remove the password before compressing it in your browser.",
          },
        },
      ],
    },
  ],
};

export default function CompressPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompressPdfContent />
    </>
  );
}
