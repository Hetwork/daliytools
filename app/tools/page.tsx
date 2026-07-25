import type { Metadata } from "next";
import ToolsContent from "./tools-content";

export const metadata: Metadata = {
  title: "All Tools : Daliy.Tools",
  description:
    "Browse every tool coming to Daliy.Tools — PDF tools, image tools, text tools, generators, and calculators. All in one simple, fast site.",
};

export default function ToolsPage() {
  return <ToolsContent />;
}
