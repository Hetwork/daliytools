import type { Metadata } from "next";
import LoremIpsumGeneratorContent from "./lorem-ipsum-generator-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator — Free & Private : Daliy.Tools",
  description: "Generate placeholder text for mockups and prototypes. Runs entirely in your browser.",
  ...createToolMetadata("lorem-ipsum-generator"),
};

export default function LoremIpsumGeneratorPage() {
  return <LoremIpsumGeneratorContent />;
}
