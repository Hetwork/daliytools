import type { Metadata } from "next";
import Base64ConverterContent from "./base64-converter-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Base64 / URL / HTML Converter — Free & Private : Daliy.Tools",
  description:
    "Encode and decode Base64, URL-encoded strings, and HTML entities entirely in your browser.",
  ...createToolMetadata("base64-converter"),
};

export default function Base64ConverterPage() {
  return <Base64ConverterContent />;
}
