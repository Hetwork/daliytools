import type { Metadata } from "next";
import JsonFormatterContent from "./json-formatter-content";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator Online — Free & Private | Daliy.Tools",
  description:
    "Beautify, format, validate, and minify JSON data online for free. Fix syntax errors and clean up payloads with 100% private in-browser parsing.",
  keywords: [
    "json formatter",
    "json validator",
    "beautify json online",
    "json minifier",
    "format json code",
    "daily tools json formatter",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/json-formatter",
  },
  openGraph: {
    title: "JSON Formatter & Validator Online — Free & Private | Daliy.Tools",
    description:
      "Clean, format, and validate messy JSON data in one click with zero data transmission.",
    url: "https://daliy.tools/tools/json-formatter",
    siteName: "Daliy.Tools",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "JSON Formatter - Daliy.Tools",
      "url": "https://daliy.tools/tools/json-formatter",
      "description":
        "Free developer tool to format, validate, and minify JSON data.",
      "applicationCategory": "DeveloperApplication",
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
          "name": "Does this tool detect JSON syntax errors?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. If your JSON has syntax issues (like missing quotes or trailing commas), it highlights the exact line and error description.",
          },
        },
        {
          "@type": "Question",
          "name": "Is my confidential JSON data private?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Completely private. Everything runs locally in your browser so API tokens and user records remain safe.",
          },
        },
      ],
    },
  ],
};

export default function JsonFormatterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonFormatterContent />
    </>
  );
}
