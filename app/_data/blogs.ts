import { guides } from "./guides";

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogAuthor = {
  name: string;
  role: string;
  avatar?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string; // ISO date: YYYY-MM-DD
  updatedAt?: string;
  readTime: string;
  image?: string; // Local path (e.g. "/blogs/...") OR External URL (e.g. "https://...")
  imageAlt?: string;
  author: BlogAuthor;
  featured?: boolean;
  content: string;
  faqs: BlogFaq[];
  relatedTools?: {
    slug: string;
    name: string;
  }[];
};

export const blogs: BlogPost[] = guides;

export function getAllBlogs(): BlogPost[] { return blogs; }
export function getBlogBySlug(slug: string): BlogPost | undefined { return blogs.find(post => post.slug === slug); }
export function getRecentBlogs(limit = 3): BlogPost[] { return blogs.slice(0, limit); }
export function formatBlogDate(date: string): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(date));
}
