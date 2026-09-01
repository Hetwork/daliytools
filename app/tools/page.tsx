import type { Metadata } from "next";
import ToolsContent from "./tools-content";

export const metadata: Metadata = {
  title: "All Online Tools & Utilities — Free & Private | Daliy.Tools",
  description:
    "Browse our complete catalog of free, fast, and private online tools. PDF compressors, image resizers, converters, QR generators, and developer utilities.",
  alternates: {
    canonical: "https://daliy.tools/tools",
  },
  openGraph: {
    title: "All Online Tools & Utilities | Daliy.Tools",
    description:
      "Explore 30+ free browser-based tools and utilities. Fast, privacy-focused, and no file uploads to servers.",
    url: "https://daliy.tools/tools",
    siteName: "Daliy.Tools",
    type: "website",
  },
};

export default function ToolsPage() {
  return <ToolsContent />;
}
