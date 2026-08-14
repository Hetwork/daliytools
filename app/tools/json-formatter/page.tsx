import type { Metadata } from "next";
import JsonFormatterContent from "./json-formatter-content";

export const metadata: Metadata = {
  title: "JSON Formatter — Free & Private : Daliy.Tools",
  description: "Beautify or minify messy JSON data in one click. Runs entirely in your browser — nothing is uploaded.",
};

export default function JsonFormatterPage() {
  return <JsonFormatterContent />;
}
