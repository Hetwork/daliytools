import type { Metadata } from "next";
import CompareFilesContent from "./compare-files-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Compare Two Files — Free & Private : Daliy.Tools",
  description: "Spot the differences between two documents with line-by-line diff highlighting. Runs entirely in your browser.",
  ...createToolMetadata("compare-files"),
};

export default function CompareFilesPage() {
  return <CompareFilesContent />;
}
