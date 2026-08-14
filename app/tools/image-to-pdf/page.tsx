import type { Metadata } from "next";
import ImageToPdfContent from "./image-to-pdf-content";

export const metadata: Metadata = {
  title: "Image to PDF — Free & Private : Daliy.Tools",
  description: "Combine one or more images into a single PDF. Drag to reorder pages. Nothing uploaded — runs in your browser.",
};

export default function ImageToPdfPage() {
  return <ImageToPdfContent />;
}
