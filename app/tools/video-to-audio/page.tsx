import type { Metadata } from "next";
import VideoToAudioContent from "./video-to-audio-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Video to Audio Converter — Extract MP3 & WAV | Daliy.Tools",
  description:
    "Extract audio from video files online for free. Convert MP4, WebM, and MOV to high-quality MP3 or lossless WAV directly in your browser with zero file uploads.",
  keywords: [
    "video to audio",
    "extract audio from video",
    "video to mp3",
    "convert video to audio",
    "mp4 to mp3 online",
    "video to wav converter",
    "extract sound from video",
    "free audio extractor",
    "daily tools",
    "private audio conversion",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/video-to-audio",
  },
  openGraph: {
    title: "Video to Audio Converter — Free & Private | Daliy.Tools",
    description:
      "Extract audio from your videos securely in your browser. Convert MP4, WebM, or MOV to MP3 and WAV with no server uploads, no watermarks, completely free.",
    url: "https://daliy.tools/tools/video-to-audio",
    siteName: "Daliy.Tools",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video to Audio Converter — Free & Private | Daliy.Tools",
    description:
      "Extract audio from your videos in seconds. Free, fast, and 100% private in your browser with no server uploads.",
  },
  ...createToolMetadata("video-to-audio"),
};

export default function VideoToAudioPage() {
  return <VideoToAudioContent />;
}
