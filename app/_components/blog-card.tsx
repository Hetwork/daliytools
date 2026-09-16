"use client";

import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "../_data/blogs";

export default function BlogCard({
  post,
  delay = 0,
}: {
  post: BlogPost;
  delay?: number;
}) {
  const isSvg = post.image.endsWith(".svg");

  return (
    <article
      className="group"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Link
        href={`/blogs/${post.slug}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "#ffffff",
          border: "2px solid #201e1d",
          position: "relative",
          transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        }}
        className="blog-card-link"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "6px 6px 0px #201e1d";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* ── TOP IMAGE CONTAINER ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            background: "#1e1c1b",
            borderBottom: "2px solid #201e1d",
          }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={isSvg}
            style={{
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            className="group-hover:scale-105"
          />
        </div>

        {/* ── CARD CONTENT ── */}
        <div
          style={{
            padding: "24px 22px 20px 22px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {/* Category Tag */}
          <div style={{ marginBottom: 10 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: "#ec3013",
                color: "#f3f2f2",
                padding: "3px 8px",
                display: "inline-block",
              }}
            >
              {post.category}
            </span>
          </div>

          {/* Post Title */}
          <h2
            style={{
              fontSize: "clamp(18px, 2.2vw, 22px)",
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: "-0.015em",
              marginBottom: 12,
              color: "#201e1d",
              transition: "color 0.2s ease",
            }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              opacity: 0.7,
              marginBottom: 20,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.excerpt}
          </p>

          {/* Divider Line (matching the reference image) */}
          <div
            style={{
              marginTop: "auto",
              height: 1,
              background: "rgba(32, 30, 29, 0.12)",
              marginBottom: 14,
            }}
          />

          {/* Bottom Meta Row: Date & Reading Time */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              opacity: 0.6,
            }}
          >
            <span>{post.publishedAt}</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
