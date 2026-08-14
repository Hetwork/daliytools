import type { Metadata } from "next";
import InstagramStoryContent from "./instagram-story-content";

export const metadata: Metadata = {
  title: "Instagram Story Viewer — Daliy.Tools",
  description: "View Instagram stories anonymously without leaving a trace. Enter a username and browse their stories.",
};

export default function InstagramStoryPage() {
  return <InstagramStoryContent />;
}
