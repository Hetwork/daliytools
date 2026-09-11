import type { Metadata } from "next";
import CaseConverterContent from "./case-converter-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Case Converter — Free & Private : Daliy.Tools",
  description: "Flip text between UPPER, lower, Title Case, camelCase, snake_case and more. Runs entirely in your browser.",
  ...createToolMetadata("case-converter"),
};

export default function CaseConverterPage() {
  return <CaseConverterContent />;
}
