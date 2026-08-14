import type { Metadata } from "next";
import AgeCalculatorContent from "./age-calculator-content";

export const metadata: Metadata = {
  title: "Age Calculator — Free & Private : Daliy.Tools",
  description: "Find the exact age between two dates — years, months, and days. Runs entirely in your browser.",
};

export default function AgeCalculatorPage() {
  return <AgeCalculatorContent />;
}
