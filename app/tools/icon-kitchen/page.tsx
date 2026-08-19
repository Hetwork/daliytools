import type { Metadata } from "next";
import IconKitchenContent from "./icon-kitchen-content";

export const metadata: Metadata = {
  title: "Icon Kitchen — App Icon & Favicon Generator : Daliy.Tools",
  description:
    "Generate production-ready Android adaptive icons, iOS AppIcon sets, and Web Favicons in all densities. 100% in-browser, free, and private.",
};

export default function IconKitchenPage() {
  return <IconKitchenContent />;
}
