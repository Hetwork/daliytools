import type { Metadata } from "next";
import PdfToImageContent from "./pdf-to-image-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "PDF to Image Converter Online — Free & Private | Daliy.Tools",
  description: "Convert PDF pages to PNG, JPG, or WebP images in your browser. Select pages, download individual images, or export everything as a ZIP without uploading files.",
  keywords: ["pdf to image", "pdf to jpg", "pdf to png", "convert pdf pages", "pdf page image converter"],
  alternates: { canonical: "https://daliy.tools/tools/pdf-to-image" },
  openGraph: {
    title: "PDF to Image Converter — Free & Private | Daliy.Tools",
    description: "Convert PDF pages to images locally in your browser.",
    url: "https://daliy.tools/tools/pdf-to-image",
    siteName: "Daliy.Tools",
    type: "website",
  },
  ...createToolMetadata("pdf-to-image"),
};

export default function PdfToImagePage() {
  return <PdfToImageContent />;
}
