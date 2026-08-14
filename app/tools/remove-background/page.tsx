import type { Metadata } from "next";
import RemoveBackgroundContent from "./remove-background-content";

export const metadata: Metadata = {
  title: "Remove Background — Free & Private : Daliy.Tools",
  description: "Remove image backgrounds instantly using AI. Runs entirely in your browser — no uploads, no sign-up.",
};

export default function RemoveBackgroundPage() {
  return <RemoveBackgroundContent />;
}
