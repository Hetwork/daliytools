import type { Metadata } from "next";
import MarkdownViewerContent from "./markdown-viewer-content";

export const metadata: Metadata = {
  title: "Markdown Viewer — Free & Live Preview : Daliy.Tools",
  description: "Edit and preview Markdown side by side in real time. Supports GFM tables, code blocks, and more.",
};

export default function MarkdownViewerPage() {
  return <MarkdownViewerContent />;
}
