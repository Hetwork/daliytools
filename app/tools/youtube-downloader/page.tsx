import type { Metadata } from "next";
import YouTubeDownloaderContent from "./youtube-downloader-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "YouTube Video Downloader — DailyTools",
  description: "Download any public YouTube video as MP4 or audio-only M4A. No sign-up required.",
  ...createToolMetadata("youtube-downloader"),
};

export default function YouTubeDownloaderPage() {
  return <YouTubeDownloaderContent />;
}
