"use client";

import { useState } from "react";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";
import BlogCard from "../_components/blog-card";
import { blogs } from "../_data/blogs";

export default function BlogsContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === selectedCategory);

  return (
    <main
      className="noise"
      style={{
        background: "#f3f2f2",
        color: "#201e1d",
        fontFamily: "var(--font-archivo), sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <SiteHeader active="Blog" />

      {/* ── INTRO HERO ── */}
      <section
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: "clamp(32px, 6vw, 64px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div>
          <div
            className="coming-soon-badge"
            style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 20 }}
          >
            <span
              style={{
                fontSize: "clamp(11px, 1.4vw, 13px)",
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "#f3f2f2",
                background: "#ec3013",
                padding: "6px 14px",
                textTransform: "uppercase",
              }}
            >
              Editorial
            </span>
            <span
              style={{
                fontSize: "clamp(11px, 1.4vw, 13px)",
                fontWeight: 600,
                letterSpacing: "0.1em",
                opacity: 0.5,
                textTransform: "uppercase",
              }}
            >
              Guides & Insights
              <span className="blink" style={{ marginLeft: 2 }}>
                _
              </span>
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 5.5vw, 60px)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              maxWidth: 780,
            }}
          >
            Articles, Guides &amp; Daily Productivity.
          </h1>

          <p
            style={{
              marginTop: 20,
              fontSize: "clamp(15px, 1.8vw, 19px)",
              lineHeight: 1.7,
              opacity: 0.72,
              maxWidth: 640,
            }}
          >
            Practical breakdowns to eliminate digital clutter, streamline everyday file tasks, and put hours back into your work week.
          </p>
        </div>

        {/* ── CATEGORY FILTER ── */}
        {categories.length > 1 && (
          <div
            style={{
              marginTop: 36,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              borderBottom: "1.5px solid rgba(32,30,29,0.12)",
              paddingBottom: 20,
            }}
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    border: "1.5px solid #201e1d",
                    background: active ? "#201e1d" : "#ffffff",
                    color: active ? "#f3f2f2" : "#201e1d",
                    padding: "6px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ── BLOG POSTS GRID ── */}
      <section
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 64px) 32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 32,
          }}
        >
          {filteredBlogs.map((post, idx) => (
            <BlogCard key={post.slug} post={post} delay={idx * 0.08} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
