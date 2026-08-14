import type { Metadata } from "next";
import CompressImageContent from "./compress-image-content";

export const metadata: Metadata = {
  title: "Compress Image — Free & Private : Daliy.Tools",
  description: "Reduce image file size with a quality slider. Supports JPG, PNG, and WebP. Runs entirely in your browser.",
};

export default function CompressImagePage() {
  return <CompressImageContent />;
}
