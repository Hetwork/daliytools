import type { Metadata } from "next";
import PercentageCalculatorContent from "./percentage-calculator-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Percentage Calculator Online — Free Percentage Increase & Discount Math | Daliy.Tools",
  description:
    "Free percentage calculator. Quickly calculate percentage increase, discount savings, percentage difference, and fraction ratios with instant real-time results.",
  keywords: [
    "percentage calculator",
    "calculate percentage online",
    "percentage increase calculator",
    "discount calculator",
    "percent difference calculator",
    "daily tools percentage calculator",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/percentage-calculator",
  },
  openGraph: {
    title: "Percentage Calculator Online — Free & Fast | Daliy.Tools",
    description:
      "Calculate percentage discounts, increases, and ratios instantly with zero mental math.",
    url: "https://daliy.tools/tools/percentage-calculator",
    siteName: "Daliy.Tools",
    type: "website",
  },
  ...createToolMetadata("percentage-calculator"),
};

export default function PercentageCalculatorPage() {
  return <PercentageCalculatorContent />;
}
