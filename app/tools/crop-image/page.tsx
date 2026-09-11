import type { Metadata } from "next";
import CropImageContent from "./crop-image-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Crop Image — Free & Private : Daliy.Tools",
  description: "Trim your photo to a custom area or a preset aspect ratio. Drag-to-crop, runs entirely in your browser.",
  ...createToolMetadata("crop-image"),
};

export default function CropImagePage() {
  return <CropImageContent />;
}
