import type { Metadata } from "next";
import VideoToFramesContent from "./video-to-frames-content";

export const metadata: Metadata = {
  title: "Video to Frames — Free & Private : Daliy.Tools",
  description: "Extract individual frames from a video at any interval. Download as individual images or a ZIP archive.",
};

export default function VideoToFramesPage() {
  return <VideoToFramesContent />;
}
