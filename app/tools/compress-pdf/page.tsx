import type { Metadata } from "next";
import CompressPdfContent from "./compress-pdf-content";

export const metadata: Metadata = {
  title: "Compress PDF — Free & Private : Daliy.Tools",
  description:
    "Shrink your PDF file size for free, right in your browser. No uploads, no sign-ups, no watermarks — your file never leaves your device.",
};

export default function CompressPdfPage() {
  return <CompressPdfContent />;
}
