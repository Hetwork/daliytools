import type { Metadata } from "next";
import HtmlViewerContent from "./html-viewer-content";

export const metadata: Metadata = {
  title: "HTML Viewer — Free & Live Preview : Daliy.Tools",
  description: "Paste HTML and see it rendered live in a preview pane. No uploads, runs entirely in your browser.",
};

export default function HtmlViewerPage() {
  return <HtmlViewerContent />;
}
