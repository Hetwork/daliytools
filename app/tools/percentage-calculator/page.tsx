import type { Metadata } from "next";
import PercentageCalculatorContent from "./percentage-calculator-content";

export const metadata: Metadata = {
  title: "Percentage Calculator Online — Free Percentage Increase & Discount Math | Daliy.Tools",
  description:
    "Free percentage calculator. Quickly calculate percentage increase, discount savings, percentage difference, and fraction ratios with instant real-time results.",
  keywords: [
    "percentage calculator",
    "calculate percentage online",
    "percentage increase calculator",
    "discount calculator",
    "percent difference calculator",
    "daily tools percentage calculator",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/percentage-calculator",
  },
  openGraph: {
    title: "Percentage Calculator Online — Free & Fast | Daliy.Tools",
    description:
      "Calculate percentage discounts, increases, and ratios instantly with zero mental math.",
    url: "https://daliy.tools/tools/percentage-calculator",
    siteName: "Daliy.Tools",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Percentage Calculator - Daliy.Tools",
      "url": "https://daliy.tools/tools/percentage-calculator",
      "description":
        "Free mathematical calculator to solve percentage increases, discounts, and fractions.",
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
          "name": "How do I calculate a percentage discount?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Multiply the original price by the discount percentage and divide by 100, then subtract that amount from the original price.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I calculate percentage increase or decrease?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. Enter your original value and new value to calculate the exact percentage change automatically.",
          },
        },
      ],
    },
  ],
};

export default function PercentageCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PercentageCalculatorContent />
    </>
  );
}
