import type { Metadata } from "next";
import SplitPdfContent from "./split-pdf-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Split PDF Online — Free, Fast & Private | Daliy.Tools",
  description:
    "Extract pages, separate single pages, or split PDF documents into separate files online for free. 100% private in-browser tool with zero server uploads.",
  keywords: [
    "split pdf",
    "extract pdf pages",
    "separate pdf pages online",
    "free pdf splitter",
    "cut pdf pages",
    "daily tools split pdf",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/split-pdf",
  },
  openGraph: {
    title: "Split PDF Online — Free & Private | Daliy.Tools",
    description:
      "Separate and extract pages from any PDF document safely in your browser. Fast, free, and completely secure.",
    url: "https://daliy.tools/tools/split-pdf",
    siteName: "Daliy.Tools",
    type: "website",
  },
  ...createToolMetadata("split-pdf"),
};

export default function SplitPdfPage() {
  return <SplitPdfContent />;
}
