import type { Metadata } from "next";
import ResizeImageContent from "./resize-image-content";

export const metadata: Metadata = {
  title: "Resize Image Online — Free Image Resizer & Scaler | Daliy.Tools",
  description:
    "Resize images to exact pixel dimensions, aspect ratios, or percentages for free. Fast, browser-based image resizer with no file uploads or quality loss.",
  keywords: [
    "resize image",
    "image resizer online",
    "scale photo size",
    "change image dimensions",
    "free image resizer",
    "bulk resize images",
    "daily tools resize image",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/resize-image",
  },
  openGraph: {
    title: "Resize Image Online — Free & Private | Daliy.Tools",
    description:
      "Resize JPG, PNG, and WebP images to exact pixels or aspect ratios without losing clarity.",
    url: "https://daliy.tools/tools/resize-image",
    siteName: "Daliy.Tools",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Resize Image - Daliy.Tools",
      "url": "https://daliy.tools/tools/resize-image",
      "description":
        "Free tool to resize, crop, and scale photos and graphics without uploading them to remote servers.",
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
          "name": "Does resizing an image reduce its clarity?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Downscaling an image maintains crispness while reducing file size. When upscaling, modern browser interpolation ensures clean edges.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I lock the aspect ratio while resizing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. By default, aspect ratio lock is enabled so your photo will not stretch or distort when changing width or height.",
          },
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Daliy.Tools supports all modern web image formats including JPG, PNG, WebP, GIF, SVG, and BMP.",
          },
        },
      ],
    },
  ],
};

export default function ResizeImagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResizeImageContent />
    </>
  );
}
