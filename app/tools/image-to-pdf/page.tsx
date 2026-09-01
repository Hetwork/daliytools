import type { Metadata } from "next";
import ImageToPdfContent from "./image-to-pdf-content";

export const metadata: Metadata = {
  title: "Image to PDF Converter Online — Free & 100% Private | Daliy.Tools",
  description:
    "Convert JPG, PNG, and WebP images to PDF online for free. Reorder pages, adjust margins, and download your clean PDF in seconds without server uploads.",
  keywords: [
    "image to pdf",
    "jpg to pdf",
    "png to pdf",
    "convert photos to pdf",
    "free image to pdf converter",
    "combine pictures into pdf",
    "daily tools image to pdf",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/image-to-pdf",
  },
  openGraph: {
    title: "Image to PDF Converter — Free & Private | Daliy.Tools",
    description:
      "Combine photos and images into a single PDF document in your browser. Fast, free, and completely private.",
    url: "https://daliy.tools/tools/image-to-pdf",
    siteName: "Daliy.Tools",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Image to PDF Converter - Daliy.Tools",
      "url": "https://daliy.tools/tools/image-to-pdf",
      "description":
        "Convert JPG, PNG, and WebP images into a single PDF document securely in the browser.",
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
          "name": "What image formats can I convert to PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "You can convert JPG, JPEG, PNG, WebP, GIF, and BMP files into a single PDF file.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I reorder pages before downloading the PDF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. Drag and drop your image thumbnails to arrange them in the exact order you want them to appear in the final PDF.",
          },
        },
        {
          "@type": "Question",
          "name": "Are my images uploaded to any cloud server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "No. Everything is converted locally in your browser. Your images never leave your computer or phone.",
          },
        },
      ],
    },
  ],
};

export default function ImageToPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageToPdfContent />
    </>
  );
}
