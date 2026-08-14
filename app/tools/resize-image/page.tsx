import type { Metadata } from "next";
import ResizeImageContent from "./resize-image-content";

export const metadata: Metadata = {
  title: "Resize Image — Free & Private : Daliy.Tools",
  description: "Resize any image to exact dimensions, percentage, or a preset. Runs entirely in your browser — no uploads.",
};

export default function ResizeImagePage() {
  return <ResizeImageContent />;
}
