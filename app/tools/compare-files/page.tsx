import type { Metadata } from "next";
import CompareFilesContent from "./compare-files-content";

export const metadata: Metadata = {
  title: "Compare Two Files — Free & Private : Daliy.Tools",
  description: "Spot the differences between two documents with line-by-line diff highlighting. Runs entirely in your browser.",
};

export default function CompareFilesPage() {
  return <CompareFilesContent />;
}
