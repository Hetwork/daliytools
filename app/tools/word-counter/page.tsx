import type { Metadata } from "next";
import WordCounterContent from "./word-counter-content";

export const metadata: Metadata = {
  title: "Word Counter — Free & Private : Daliy.Tools",
  description: "Count words, characters, sentences, and reading time instantly. Runs entirely in your browser.",
};

export default function WordCounterPage() {
  return <WordCounterContent />;
}
