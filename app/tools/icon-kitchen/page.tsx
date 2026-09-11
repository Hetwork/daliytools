import type { Metadata } from "next";
import IconKitchenContent from "./icon-kitchen-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Icon Kitchen — App Icon & Favicon Generator : Daliy.Tools",
  description:
    "Generate production-ready Android adaptive icons, iOS AppIcon sets, and Web Favicons in all densities. 100% in-browser, free, and private.",
  ...createToolMetadata("icon-kitchen"),
};

export default function IconKitchenPage() {
  return <IconKitchenContent />;
}
