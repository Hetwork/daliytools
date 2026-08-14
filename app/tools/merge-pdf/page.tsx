import type { Metadata } from "next";
import MergePdfContent from "./merge-pdf-content";

export const metadata: Metadata = {
  title: "Merge PDF — Free & Private : Daliy.Tools",
  description: "Combine multiple PDF files into one. No uploads, runs entirely in your browser.",
};

export default function MergePdfPage() {
  return <MergePdfContent />;
}
