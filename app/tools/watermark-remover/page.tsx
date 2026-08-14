import type { Metadata } from "next";
import WatermarkRemoverContent from "./watermark-remover-content";

export const metadata: Metadata = {
  title: "Watermark Remover — Free & Private : Daliy.Tools",
  description: "Select any area of your image and blur, fill, or clone it out. Runs entirely in your browser.",
};

export default function WatermarkRemoverPage() {
  return <WatermarkRemoverContent />;
}
