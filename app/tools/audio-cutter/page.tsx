import type { Metadata } from "next";
import AudioCutterContent from "./audio-cutter-content";

export const metadata: Metadata = {
  title: "Audio Cutter — Free & Private : Daliy.Tools",
  description:
    "Trim audio files in your browser with start/end selection, live playback, and WAV export. Private and fast.",
};

export default function AudioCutterPage() {
  return <AudioCutterContent />;
}
