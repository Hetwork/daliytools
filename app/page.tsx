import type { Metadata } from "next";
import HomeContent from "./home-content";

export const metadata: Metadata = {
  title: "Daliy.Tools — Everyday Tools, Actually Simple",
  description:
    "Free everyday tools for PDFs, images, text, media, and developer tasks. Fast, practical, and simple to use without unnecessary complexity.",
};

export default function Home() {
  return <HomeContent />;
}
