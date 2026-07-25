import type { Metadata } from "next";
import AboutContent from "./about-content";

export const metadata: Metadata = {
  title: "Our Story : Daliy.Tools",
  description:
    "Yes, it's Daliy, not Daily. Here's the typo behind the name, and why we're building the internet's most useful collection of online tools anyway.",
};

export default function AboutPage() {
  return <AboutContent />;
}
