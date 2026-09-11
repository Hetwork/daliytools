import type { Metadata } from "next";
import MergePdfContent from "./merge-pdf-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Merge PDF Files Online — Free, Fast & Private | Daliy.Tools",
  description:
    "Combine multiple PDF documents into one single file online for free. Arrange page order with zero file uploads and 100% in-browser privacy.",
  keywords: [
    "merge pdf",
    "combine pdf files",
    "join pdfs online",
    "free pdf merger",
    "merge multiple pdf documents",
    "daily tools merge pdf",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/merge-pdf",
  },
  openGraph: {
    title: "Merge PDF Files Online — Free & Private | Daliy.Tools",
    description:
      "Join multiple PDF files into one clean document directly in your browser. Fast, free, and completely secure.",
    url: "https://daliy.tools/tools/merge-pdf",
    siteName: "Daliy.Tools",
    type: "website",
  },
  ...createToolMetadata("merge-pdf"),
};

export default function MergePdfPage() {
  return <MergePdfContent />;
}
