import type { Metadata } from "next";
import UnitConverterContent from "./unit-converter-content";

export const metadata: Metadata = {
  title: "Unit Converter — Free & Private : Daliy.Tools",
  description: "Convert length, weight, volume, temperature and more in seconds. Runs entirely in your browser.",
};

export default function UnitConverterPage() {
  return <UnitConverterContent />;
}
