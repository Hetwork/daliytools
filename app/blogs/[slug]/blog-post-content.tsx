"use client";

import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import { formatBlogDate, type BlogPost } from "../../_data/blogs";

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const isSvg = post.image?.endsWith(".svg");

  return (
    <main
      className="noise"
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: "var(--font-archivo), sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <SiteHeader active="Blog" />

      {/* ── BREADCRUMB & BACK LINK ── */}
      <section
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: "clamp(24px, 4vw, 44px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <Link
            href="/blogs"
            style={{
              textDecoration: "none",
              color: "var(--ink)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.04em",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1.5px solid var(--border)",
              padding: "6px 14px",
              background: "var(--surface)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--solid)";
              e.currentTarget.style.color = "var(--on-solid)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--surface)";
              e.currentTarget.style.color = "var(--ink)";
            }}
          >
            Back to all blogs
          </Link>

          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0.5,
            }}
          >
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              Home
            </Link>{" "}
            /{" "}
            <Link href="/blogs" style={{ color: "inherit", textDecoration: "none" }}>
              Blogs
            </Link>{" "}
            / <span style={{ color: "var(--red)" }}>{post.category}</span>
          </div>
        </div>

        {/* ── ARTICLE HEADER ── */}
        <header style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "var(--on-solid)",
                background: "var(--red)",
                padding: "4px 12px",
                textTransform: "uppercase",
              }}
            >
              {post.category}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
                opacity: 0.55,
              }}
            >
              {post.readTime}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(30px, 5.2vw, 54px)",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.025em",
              marginBottom: 20,
            }}
          >
            {post.title}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 13,
              fontWeight: 600,
              opacity: 0.65,
              paddingBottom: 20,
              borderBottom: "1.5px solid rgba(var(--ink-rgb), 0.15)",
              flexWrap: "wrap",
            }}
          >
            <span>Published <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time></span>
            {post.updatedAt && <span>Updated <time dateTime={post.updatedAt}>{formatBlogDate(post.updatedAt)}</time></span>}
            <span>&bull;</span>
            <span>By <Link href="/about">{post.author.name}</Link> / <Link href="/editorial-policy">How we write guides</Link></span>
          </div>
        </header>

        {/* ── FEATURED IMAGE CONTAINER ── */}
        {post.image && <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            background: "#1e1c1b",
            border: "2px solid var(--border)",
            marginBottom: 48,
          }}
        >
          <Image
            src={post.image}
            alt={post.imageAlt || post.title}
            fill
            priority
            unoptimized={isSvg}
            sizes="(max-width: 860px) 100vw, 860px"
            style={{ objectFit: "cover" }}
          />
        </div>}

        {/* ── ARTICLE CONTENT ── */}
        <article
          style={{
            fontSize: "clamp(15px, 1.7vw, 17px)",
            lineHeight: 1.75,
            color: "var(--ink)",
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ ...props }) => (
                <h2
                  style={{
                    fontSize: "clamp(22px, 3.2vw, 32px)",
                    fontWeight: 800,
                    letterSpacing: "-0.015em",
                    lineHeight: 1.25,
                    marginTop: 48,
                    marginBottom: 16,
                    paddingBottom: 10,
                    borderBottom: "2px solid var(--border)",
                  }}
                  {...props}
                />
              ),
              h3: ({ ...props }) => (
                <h3
                  style={{
                    fontSize: "clamp(18px, 2.4vw, 22px)",
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                    marginTop: 24,
                    marginBottom: 10,
                    color: "var(--ink)",
                  }}
                  {...props}
                />
              ),
              p: ({ ...props }) => (
                <p
                  style={{
                    marginBottom: 18,
                    opacity: 0.85,
                  }}
                  {...props}
                />
              ),
              ul: ({ ...props }) => (
                <ul
                  style={{
                    marginBottom: 20,
                    paddingLeft: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                  {...props}
                />
              ),
              ol: ({ ...props }) => (
                <ol
                  style={{
                    marginBottom: 20,
                    paddingLeft: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                  {...props}
                />
              ),
              li: ({ ...props }) => (
                <li
                  style={{
                    lineHeight: 1.7,
                    opacity: 0.85,
                  }}
                  {...props}
                />
              ),
              a: ({ href, ...props }) => (
                <Link
                  href={href || "#"}
                  style={{
                    color: "var(--red)",
                    fontWeight: 700,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                  {...props}
                />
              ),
              blockquote: ({ children, ...props }) => (
                <blockquote
                  style={{
                    borderLeft: "4px solid var(--red)",
                    paddingLeft: 16,
                    margin: "4px 0 8px 0",
                    color: "rgba(var(--ink-rgb), 0.7)",
                    fontSize: 15,
                    fontWeight: 600,
                    fontStyle: "italic",
                  }}
                  {...props}
                >
                  {children}
                </blockquote>
              ),
              hr: () => (
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px dashed rgba(var(--ink-rgb), 0.2)",
                    margin: "28px 0",
                  }}
                />
              ),
              pre: ({ children }) => <pre className="guide-code">{children}</pre>,
              table: ({ ...props }) => (
                <div className="guide-table-scroll" role="region" aria-label="Comparison table" tabIndex={0}><table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 14,
                    margin: "20px 0",
                    border: "1.5px solid var(--border)",
                  }}
                  {...props}
                /></div>
              ),
              thead: ({ ...props }) => (
                <thead
                  style={{
                    background: "var(--solid)",
                    color: "var(--on-solid)",
                  }}
                  {...props}
                />
              ),
              th: ({ ...props }) => (
                <th
                  style={{
                    padding: "8px 14px",
                    textAlign: "left",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                  {...props}
                />
              ),
              td: ({ ...props }) => (
                <td
                  style={{
                    padding: "8px 14px",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.1)",
                    lineHeight: 1.5,
                    fontSize: 14,
                  }}
                  {...props}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* ── FAQ SECTION AT THE END ── */}
        {post.faqs && post.faqs.length > 0 && (
          <section
            style={{
              marginTop: 48,
              paddingTop: 40,
              borderTop: "2px solid var(--border)",
            }}
          >
            <div style={{ marginBottom: 28 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "var(--red)",
                }}
              >
                Clear Answers
              </span>
              <h2
                style={{
                  fontSize: "clamp(24px, 3.5vw, 36px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  marginTop: 8,
                }}
              >
                Frequently Asked Questions
              </h2>
              <p
                style={{
                  fontSize: 15,
                  opacity: 0.7,
                  marginTop: 6,
                }}
              >
                Questions about this workflow and its limitations.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 16,
              }}
            >
              {post.faqs.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    padding: "22px 24px",
                    background: "var(--surface)",
                    border: "2px solid var(--border)",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "clamp(16px, 1.8vw, 18px)",
                      fontWeight: 800,
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        color: "var(--red)",
                        fontFamily: "monospace",
                        fontWeight: 900,
                      }}
                    >
                      Q{i + 1}.
                    </span>
                    <span>{faq.question}</span>
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      opacity: 0.78,
                      lineHeight: 1.65,
                      paddingLeft: 34,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── RELATED TOOLS SECTION ── */}
        {post.relatedTools && post.relatedTools.length > 0 && (
          <section
            style={{
              marginTop: 56,
              padding: "32px",
              background: "var(--surface)",
              border: "2px solid var(--border)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--red)",
                marginBottom: 8,
              }}
            >
              Streamline Your Workflow
            </p>
            <h3
              style={{
                fontSize: "clamp(20px, 2.5vw, 24px)",
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              Tools used in this guide
            </h3>
            <p
              style={{
                fontSize: 14,
                opacity: 0.72,
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              Open a tool to try the workflow. Check its supported formats and processing limits before choosing a file.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {post.relatedTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  style={{
                    padding: "8px 16px",
                    background: "var(--solid)",
                    color: "var(--on-solid)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "background 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--red)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--solid)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
