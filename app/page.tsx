import type { Metadata } from "next";
import HomeContent from "./home-content";

export const metadata: Metadata = {
  title: "Daliy.Tools — Everyday Tools, Actually Simple",
  description:
    "One simple website. Hundreds of genuinely useful tools on the way. Fast, free whenever possible, no unnecessary complexity.",
};

export default function Home() {
  return <HomeContent />;
}
