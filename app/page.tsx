import type { Metadata } from "next";
import HomeContent from "./home-content";

export const metadata: Metadata = {
  title: { absolute: "Daliy.Tools — Everyday Tools, Actually Simple" },
  alternates: { canonical: "https://daliy.tools" },
  description:
    "Free everyday tools for PDFs, images, text, media, and developer tasks. Fast, practical, and simple to use without unnecessary complexity.",
};

export default function Home() {
  return <HomeContent />;
}
