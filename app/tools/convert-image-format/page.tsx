import type { Metadata } from "next";
import ConvertImageFormatContent from "./convert-image-format-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Convert Image Format — Free & Private : Daliy.Tools",
  description: "Convert images between JPEG, PNG, WebP, and AVIF formats. Runs entirely in your browser — nothing uploaded.",
  ...createToolMetadata("convert-image-format"),
};

export default function ConvertImageFormatPage() {
  return <ConvertImageFormatContent />;
}
