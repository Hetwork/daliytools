import type { Metadata } from "next";
import CronGeneratorContent from "./cron-generator-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Cron Generator — Free & Private : Daliy.Tools",
  description:
    "Build cron expressions with a visual editor, get human-friendly explanations, and preview upcoming run times.",
  ...createToolMetadata("cron-generator"),
};

export default function CronGeneratorPage() {
  return <CronGeneratorContent />;
}
