import type { Metadata } from "next";
import YouTubeDownloaderContent from "./youtube-downloader-content";

export const metadata: Metadata = {
  title: "YouTube Video Downloader — DailyTools",
  description: "Download any public YouTube video as MP4 or audio-only M4A. No sign-up required.",
};

export default function YouTubeDownloaderPage() {
  return <YouTubeDownloaderContent />;
}
