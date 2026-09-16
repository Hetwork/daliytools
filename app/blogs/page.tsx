import type { Metadata } from "next";
import BlogsContent from "./blogs-content";

export const metadata: Metadata = {
  title: "Blog & Productivity Guides — Everyday Digital Utilities | Daliy.Tools",
  description:
    "Explore practical guides, online tool roundups, and time-saving workflows to boost your daily productivity. Fast, actionable, and 100% free.",
  alternates: {
    canonical: "https://daliy.tools/blogs",
  },
  openGraph: {
    title: "Blog & Productivity Guides | Daliy.Tools",
    description:
      "Actionable guides, online tool roundups, and smart workflows to save hours on everyday digital tasks.",
    url: "https://daliy.tools/blogs",
    siteName: "Daliy.Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Productivity Guides | Daliy.Tools",
    description:
      "Actionable guides and online tool roundups to streamline your daily tasks.",
  },
};

export default function BlogsPage() {
  return <BlogsContent />;
}
