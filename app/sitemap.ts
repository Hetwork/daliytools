import { MetadataRoute } from "next";
import { tools } from "./_data/tools";
import { blogs } from "./_data/blogs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://daliy.tools";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-use`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((tool) => tool.live)
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}
