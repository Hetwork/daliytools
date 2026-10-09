import { MetadataRoute } from "next";
import { tools } from "./_data/tools";
import { blogs } from "./_data/blogs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://daliy.tools";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    { url: `${baseUrl}/editorial-policy`, changeFrequency: "monthly", priority: 0.5 },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-use`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((tool) => tool.live)
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}
