import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getAllBlogs } from "../../_data/blogs";
import BlogPostContent from "./blog-post-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const allBlogs = getAllBlogs();
  return allBlogs.map((b) => ({
    slug: b.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Daliy.Tools",
    };
  }

  const url = `https://daliy.tools/blogs/${post.slug}`;
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `https://daliy.tools${post.image}`;

  return {
    title: `${post.title} — Free Online Guide | Daliy.Tools`,
    description: post.excerpt,
    keywords: [
      "daily tools",
      "free online tools",
      "productivity guide",
      "save time online",
      post.category.toLowerCase(),
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${post.title} | Daliy.Tools Blog`,
      description: post.excerpt,
      url,
      siteName: "Daliy.Tools",
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Daliy.Tools Blog`,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image.startsWith("http")
          ? post.image
          : `https://daliy.tools${post.image}`,
        "datePublished": post.publishedAt,
        "dateModified": post.publishedAt,
        "author": {
          "@type": "Organization",
          "name": post.author.name,
        },
        "publisher": {
          "@type": "Organization",
          "name": "Daliy.Tools",
          "url": "https://daliy.tools",
          "logo": {
            "@type": "ImageObject",
            "url": "https://daliy.tools/favicon.ico",
          },
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://daliy.tools/blogs/${post.slug}`,
        },
      },
      ...(post.faqs && post.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              "mainEntity": post.faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer,
                },
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://daliy.tools",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://daliy.tools/blogs",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": `https://daliy.tools/blogs/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogPostContent post={post} />
    </>
  );
}
