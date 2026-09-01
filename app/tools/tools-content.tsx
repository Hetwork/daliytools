"use client";

import { useEffect } from "react";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";
import ToolCard from "../_components/tool-card";
import { categories, tools } from "../_data/tools";

export default function ToolsContent() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document
      .querySelectorAll(".reveal, .reveal-fast")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
      <SiteHeader active="Tools" />

      {/* ── INTRO ── */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: "clamp(32px, 6vw, 64px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="reveal">
          <p
            style={{
              fontSize: "clamp(11px, 1.3vw, 13px)",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.45,
              marginBottom: 16,
            }}
          >
            {tools.length} Tools &middot; {categories.length} Categories
          </p>
          <p
            style={{
              fontSize: "clamp(30px, 5vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 680,
            }}
          >
            All your daily tools, in one simple place.
          </p>
          <p
            style={{
              marginTop: 20,
              fontSize: "clamp(15px, 1.8vw, 19px)",
              lineHeight: 1.7,
              opacity: 0.7,
              maxWidth: 560,
            }}
          >
            Every tool runs 100% in your browser, zero file uploads to servers, no account required, no paywalls, and no watermarks.
          </p>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(48px, 7vw, 80px) 32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(56px, 8vw, 88px)",
          }}
        >
          {categories.map((category, ci) => {
            const categoryTools = tools.filter(
              (tool) => tool.category === category
            );
            return (
              <div key={category}>
                <div
                  className="reveal"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    borderBottom: "2px solid #201e1d",
                    paddingBottom: 16,
                    marginBottom: 28,
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(13px, 1.6vw, 16px)",
                      fontWeight: 800,
                      opacity: 0.3,
                    }}
                  >
                    {String(ci + 1).padStart(2, "0")}
                  </span>
                  <h2
                    style={{
                      fontSize: "clamp(20px, 2.8vw, 30px)",
                      fontWeight: 800,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {category}
                  </h2>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      opacity: 0.4,
                    }}
                  >
                    {categoryTools.length} tools
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 20,
                  }}
                >
                  {categoryTools.map((tool, ti) => (
                    <ToolCard
                      key={tool.slug}
                      tool={tool}
                      delay={ti * 0.06}
                      showCategory={false}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
