import type { Metadata } from "next";
import ColorPickerContent from "./color-picker-content";

export const metadata: Metadata = {
  title: "Color Picker — Free & Private : Daliy.Tools",
  description: "Extract colors from any image. Click anywhere to get HEX, RGB, and HSL values instantly. Nothing uploaded.",
};

export default function ColorPickerPage() {
  return <ColorPickerContent />;
}
