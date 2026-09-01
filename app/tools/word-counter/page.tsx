import type { Metadata } from "next";
import WordCounterContent from "./word-counter-content";

export const metadata: Metadata = {
  title: "Word Counter Online — Free Character & Reading Time Counter | Daliy.Tools",
  description:
    "Count words, characters (with and without spaces), sentences, paragraphs, and reading time in real time. 100% private, browser-based text analysis.",
  keywords: [
    "word counter",
    "character counter",
    "count words online",
    "free word counter tool",
    "reading time calculator",
    "daily tools word counter",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/word-counter",
  },
  openGraph: {
    title: "Word Counter Online — Free & Private | Daliy.Tools",
    description:
      "Instant word, character, and sentence counter with reading time estimation.",
    url: "https://daliy.tools/tools/word-counter",
    siteName: "Daliy.Tools",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Word Counter - Daliy.Tools",
      "url": "https://daliy.tools/tools/word-counter",
      "description":
        "Free tool to count words, characters, sentences, and estimated reading time.",
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
          "name": "How is reading time calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Reading time is calculated using a standard rate of 225 words per minute for silent adult reading.",
          },
        },
        {
          "@type": "Question",
          "name": "Is my text saved or logged anywhere?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "No. All text parsing runs locally in your browser memory and is never transmitted over the internet.",
          },
        },
      ],
    },
  ],
};

export default function WordCounterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WordCounterContent />
    </>
  );
}
