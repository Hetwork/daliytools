import type { Metadata } from "next";
import NumberPdfContent from "./number-pdf-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Number & Stamp PDF Online — Free & Private | Daliy.Tools",
  description: "Add page numbers, headers, footers, and custom text stamps to PDF files in your browser. No uploads, accounts, or watermarks.",
  keywords: ["number pdf", "add page numbers to pdf", "stamp pdf", "pdf header footer", "pdf page numberer"],
  alternates: { canonical: "https://daliy.tools/tools/number-pdf" },
  openGraph: {
    title: "Number & Stamp PDF — Free & Private | Daliy.Tools",
    description: "Add page numbers and custom stamps to PDF files locally in your browser.",
    url: "https://daliy.tools/tools/number-pdf",
    siteName: "Daliy.Tools",
    type: "website",
  },
  ...createToolMetadata("number-pdf"),
};

export default function NumberPdfPage() {
  return <NumberPdfContent />;
}
