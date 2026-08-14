import type { Metadata } from "next";
import PercentageCalculatorContent from "./percentage-calculator-content";

export const metadata: Metadata = {
  title: "Percentage Calculator — Free & Private : Daliy.Tools",
  description: "Work out percentages without the mental math. Multiple calculation modes — runs entirely in your browser.",
};

export default function PercentageCalculatorPage() {
  return <PercentageCalculatorContent />;
}
