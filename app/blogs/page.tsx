import type { Metadata } from "next";
import BlogsContent from "./blogs-content";

export const metadata: Metadata = {
  title: "Practical PDF, Image & Developer Guides",
  description:
    "Explore practical guides, online tool roundups, and time-saving workflows to boost your daily productivity. Fast, actionable, and 100% free.",
  alternates: {
    canonical: "https://daliy.tools/blogs",
  },
  openGraph: {
    title: "Blog & Productivity Guides | Daliy.Tools",
    description:
      "Practical workflows with worked examples, output checks, and tool limitations for PDFs, images, and JSON.",
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
