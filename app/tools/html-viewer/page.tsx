import type { Metadata } from "next";
import HtmlViewerContent from "./html-viewer-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "HTML Viewer — Free & Live Preview : Daliy.Tools",
  description: "Paste HTML and see it rendered live in a preview pane. No uploads, runs entirely in your browser.",
  ...createToolMetadata("html-viewer"),
};

export default function HtmlViewerPage() {
  return <HtmlViewerContent />;
}
