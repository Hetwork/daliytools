import type { Metadata } from "next";
import RemoveBackgroundContent from "./remove-background-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Remove Background — Free & Private : Daliy.Tools",
  description: "Remove image backgrounds instantly using AI. Runs entirely in your browser — no uploads, no sign-up.",
  ...createToolMetadata("remove-background"),
};

export default function RemoveBackgroundPage() {
  return <RemoveBackgroundContent />;
}
