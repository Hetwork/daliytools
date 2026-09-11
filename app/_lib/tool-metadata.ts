import type { Metadata } from "next";
import { tools } from "../_data/tools";

export function createToolMetadata(slug: string): Metadata {
  const tool = tools.find((item) => item.slug === slug);

  if (!tool) {
    throw new Error(`Unknown tool metadata slug: ${slug}`);
  }

  const title = tool.seo?.title ?? `Free ${tool.name}`;
  const description =
    tool.seo?.description ??
    `Free ${tool.name.toLowerCase()} to ${tool.description.toLowerCase()} No account required.`;
  const keywords = tool.seo?.keywords ?? [
    tool.name.toLowerCase(),
    `${tool.name.toLowerCase()} online`,
    tool.category.toLowerCase(),
    "free online tools",
    "daily tools",
  ];
  const openGraphTitle = tool.seo?.openGraphTitle ?? `${title} | Daliy.Tools`;
  const openGraphDescription = tool.seo?.openGraphDescription ?? description;
  const url = `https://daliy.tools/tools/${tool.slug}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      url,
      siteName: "Daliy.Tools",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description: openGraphDescription,
    },
  };
}
