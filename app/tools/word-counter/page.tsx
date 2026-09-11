import type { Metadata } from "next";
import WordCounterContent from "./word-counter-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Word Counter Online — Free Character & Reading Time Counter | Daliy.Tools",
  description:
    "Count words, characters (with and without spaces), sentences, paragraphs, and reading time in real time. 100% private, browser-based text analysis.",
  keywords: [
    "word counter",
    "character counter",
    "count words online",
    "free word counter tool",
    "reading time calculator",
    "daily tools word counter",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/word-counter",
  },
  openGraph: {
    title: "Word Counter Online — Free & Private | Daliy.Tools",
    description:
      "Instant word, character, and sentence counter with reading time estimation.",
    url: "https://daliy.tools/tools/word-counter",
    siteName: "Daliy.Tools",
    type: "website",
  },
  ...createToolMetadata("word-counter"),
};

export default function WordCounterPage() {
  return <WordCounterContent />;
}
