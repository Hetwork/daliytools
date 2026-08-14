import type { Metadata } from "next";
import InstagramReelContent from "./instagram-reel-content";

export const metadata: Metadata = {
  title: "Instagram Reel Downloader — Daliy.Tools",
  description: "Save Instagram reels in HD directly to your device. Paste the reel URL and download in seconds.",
};

export default function InstagramReelPage() {
  return <InstagramReelContent />;
}
