import type { Metadata } from "next";
import ScreenRecorderContent from "./screen-recorder-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Screen Recorder — Free & Private : Daliy.Tools",
  description:
    "Record your screen, window, or browser tab with optional microphone audio. Download instantly in your browser with no uploads.",
  ...createToolMetadata("screen-recorder"),
};

export default function ScreenRecorderPage() {
  return <ScreenRecorderContent />;
}
