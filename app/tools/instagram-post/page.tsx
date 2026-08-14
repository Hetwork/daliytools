import type { Metadata } from "next";
import InstagramPostContent from "./instagram-post-content";

export const metadata: Metadata = {
  title: "Instagram Post Downloader — Daliy.Tools",
  description: "Download Instagram posts and carousels at full quality. Paste a post URL and save directly to your device.",
};

export default function InstagramPostPage() {
  return <InstagramPostContent />;
}
