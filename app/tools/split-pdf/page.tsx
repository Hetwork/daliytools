import type { Metadata } from "next";
import SplitPdfContent from "./split-pdf-content";

export const metadata: Metadata = {
  title: "Split PDF — Free & Private : Daliy.Tools",
  description: "Extract pages or page ranges from any PDF. No uploads, runs entirely in your browser.",
};

export default function SplitPdfPage() {
  return <SplitPdfContent />;
}
