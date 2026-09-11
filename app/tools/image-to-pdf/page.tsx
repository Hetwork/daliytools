import type { Metadata } from "next";
import ImageToPdfContent from "./image-to-pdf-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

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
  ...createToolMetadata("image-to-pdf"),
};

export default function ImageToPdfPage() {
  return <ImageToPdfContent />;
}
