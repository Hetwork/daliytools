import type { Metadata } from "next";
import CompressImageContent from "./compress-image-content";

export const metadata: Metadata = {
  title: "Compress Image Online — Free Image Optimizer & Reducer | Daliy.Tools",
  description:
    "Reduce JPG, PNG, and WebP image file sizes online for free without losing quality. 100% private in-browser compression with zero uploads.",
  keywords: [
    "compress image",
    "image compressor online",
    "reduce photo size",
    "shrink jpg",
    "png compressor",
    "daily tools compress image",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/compress-image",
  },
  openGraph: {
    title: "Compress Image Online — Free & Private | Daliy.Tools",
    description:
      "Compress and optimize images directly in your browser. Save up to 80% file size without losing sharpness.",
    url: "https://daliy.tools/tools/compress-image",
    siteName: "Daliy.Tools",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Compress Image - Daliy.Tools",
      "url": "https://daliy.tools/tools/compress-image",
      "description":
        "Free browser tool to reduce and compress photo and image sizes.",
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
          "name": "How much file size can I save?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Most high-resolution photos can be compressed by 50% to 85% with virtually unnoticeable loss in visual quality.",
          },
        },
        {
          "@type": "Question",
          "name": "Are my photos uploaded to any server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "No. All image processing runs locally in your browser memory.",
          },
        },
      ],
    },
  ],
};

export default function CompressImagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompressImageContent />
    </>
  );
}
