import type { Metadata } from "next";
import JsonFormatterContent from "./json-formatter-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator Online — Free & Private | Daliy.Tools",
  description:
    "Beautify, format, validate, and minify JSON data online for free. Fix syntax errors and clean up payloads with 100% private in-browser parsing.",
  keywords: [
    "json formatter",
    "json validator",
    "beautify json online",
    "json minifier",
    "format json code",
    "daily tools json formatter",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/json-formatter",
  },
  openGraph: {
    title: "JSON Formatter & Validator Online — Free & Private | Daliy.Tools",
    description:
      "Clean, format, and validate messy JSON data in one click with zero data transmission.",
    url: "https://daliy.tools/tools/json-formatter",
    siteName: "Daliy.Tools",
    type: "website",
  },
  ...createToolMetadata("json-formatter"),
};

export default function JsonFormatterPage() {
  return <JsonFormatterContent />;
}
