import type { Metadata } from "next";
import ResizeImageContent from "./resize-image-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

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
  ...createToolMetadata("resize-image"),
};

export default function ResizeImagePage() {
  return <ResizeImageContent />;
}
