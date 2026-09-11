import type { Metadata } from "next";
import ContrastCheckerContent from "./contrast-checker-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "WCAG Contrast Checker — Free & Private : Daliy.Tools",
  description:
    "Check text and background color pairs against WCAG AA and AAA requirements with live previews.",
  ...createToolMetadata("contrast-checker"),
};

export default function ContrastCheckerPage() {
  return <ContrastCheckerContent />;
}
