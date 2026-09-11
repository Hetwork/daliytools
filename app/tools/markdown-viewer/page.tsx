import type { Metadata } from "next";
import MarkdownViewerContent from "./markdown-viewer-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Markdown Viewer — Free & Live Preview : Daliy.Tools",
  description: "Edit and preview Markdown side by side in real time. Supports GFM tables, code blocks, and more.",
  ...createToolMetadata("markdown-viewer"),
};

export default function MarkdownViewerPage() {
  return <MarkdownViewerContent />;
}
