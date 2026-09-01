import type { Metadata } from "next";
import MergePdfContent from "./merge-pdf-content";

export const metadata: Metadata = {
  title: "Merge PDF Files Online — Free, Fast & Private | Daliy.Tools",
  description:
    "Combine multiple PDF documents into one single file online for free. Arrange page order with zero file uploads and 100% in-browser privacy.",
  keywords: [
    "merge pdf",
    "combine pdf files",
    "join pdfs online",
    "free pdf merger",
    "merge multiple pdf documents",
    "daily tools merge pdf",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/merge-pdf",
  },
  openGraph: {
    title: "Merge PDF Files Online — Free & Private | Daliy.Tools",
    description:
      "Join multiple PDF files into one clean document directly in your browser. Fast, free, and completely secure.",
    url: "https://daliy.tools/tools/merge-pdf",
    siteName: "Daliy.Tools",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Merge PDF - Daliy.Tools",
      "url": "https://daliy.tools/tools/merge-pdf",
      "description":
        "Free utility to combine multiple PDF files into a single document in the browser.",
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
          "name": "Does merging PDFs reduce document quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "No. Merging preserves the original vector text, high-resolution graphics, and fonts without compression artifacts.",
          },
        },
        {
          "@type": "Question",
          "name": "Are my files uploaded to a remote server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "No. Merging is performed 100% in your local browser using client-side WebAssembly.",
          },
        },
      ],
    },
  ],
};

export default function MergePdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MergePdfContent />
    </>
  );
}
