"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "./_components/site-header";
import SiteFooter from "./_components/site-footer";
import ToolCard from "./_components/tool-card";
import { tools, featuredSlugs } from "./_data/tools";

const TICKER_ITEMS = [
  "PDF TOOLS",
  "IMAGE TOOLS",
  "TEXT TOOLS",
  "GENERATORS",
  "CALCULATORS",
  "NO POPUPS",
  "NO PAYWALLS",
];

const FEATURES = [
  {
    num: "01",
    title: "Fast",
    body: "Every tool is built to run lean — no bloated ad-tech, no ten-second load screens before you can do the thing you came for.",
  },
  {
    num: "02",
    title: "Free",
    body: "Free whenever possible. No forced sign-ups and no premium wall in front of the basics.",
  },
  {
    num: "03",
    title: "Focused",
    body: "One tool, one job, done well. No popups, no dark patterns, no five redirects to reach a download button.",
  },
  {
    num: "04",
    title: "Honest",
    body: "We spelled our own name wrong and kept it anyway. We're not pretending to be perfect — just useful.",
  },
];

function StatCounter({
  value,
  suffix = "",
  label,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || started.current) return;
          started.current = true;

          const duration = 1100;
          const startTime = performance.now() + delay * 1000;

          const tick = (now: number) => {
            const elapsed = now - startTime;
            if (elapsed < 0) {
              requestAnimationFrame(tick);
              return;
            }
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div>
      <p
        ref={ref}
        style={{
          fontSize: "clamp(40px, 6vw, 64px)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: "#ec3013",
        }}
      >
        {display}
        {suffix}
      </p>
      <p
        style={{
          marginTop: 10,
          fontSize: "clamp(12px, 1.3vw, 14px)",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          opacity: 0.55,
        }}
      >
        {label}
      </p>
    </div>
  );
}

export default function HomeContent() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document
      .querySelectorAll(".reveal, .reveal-fast")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const featured = featuredSlugs
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter(Boolean) as typeof tools;

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
      <SiteHeader active="Home" />

      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: "clamp(56px, 9vw, 104px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="float-shape"
          style={{
            position: "absolute",
            right: 24,
            top: 8,
            width: 22,
            height: 22,
            border: "3px solid #ec3013",
          }}
        />

        <p
          className="reveal-fast"
          style={{
            fontSize: "clamp(11px, 1.4vw, 13px)",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.45,
            marginBottom: 20,
          }}
        >
          Everyday Utilities
        </p>

        <h1
          className="reveal"
          style={{
            fontSize: "clamp(40px, 7.5vw, 84px)",
            fontWeight: 800,
            lineHeight: 1.03,
            letterSpacing: "-0.02em",
            maxWidth: 760,
          }}
        >
          Everyday tools.
          <br />
          Actually <span style={{ color: "#ec3013" }}>simple.</span>
        </h1>

        <p
          className="reveal"
          style={{
            marginTop: 28,
            fontSize: "clamp(16px, 2vw, 22px)",
            lineHeight: 1.6,
            opacity: 0.75,
            maxWidth: 560,
          }}
        >
          One site. No popups. No paywalls. No twelve tabs open just to
          compress a PDF.
        </p>

        <div
          className="reveal"
          style={{
            marginTop: 40,
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <Link href="/tools" className="btn btn-primary">
            Browse Tools
            <span className="btn-arrow">&rarr;</span>
          </Link>
          <Link href="/about" className="btn">
            Why the typo?
          </Link>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div
        style={{
          marginTop: "clamp(56px, 8vw, 96px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={`${item}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "16px 0",
                  color: "#f3f2f2",
                  fontSize: "clamp(13px, 1.6vw, 16px)",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                }}
              >
                {item}
                <span style={{ color: "#ec3013", fontSize: 20 }}>&middot;</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(48px, 8vw, 88px) 32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "36px 24px",
          }}
        >
          <div className="reveal-fast">
            <StatCounter value={15} suffix="+" label="Tools in the pipeline" />
          </div>
          <div className="reveal-fast" style={{ transitionDelay: "0.08s" }}>
            <StatCounter value={5} label="Categories" delay={0.05} />
          </div>
          <div className="reveal-fast" style={{ transitionDelay: "0.16s" }}>
            <StatCounter value={0} label="Popups. Ever." delay={0.1} />
          </div>
          <div className="reveal-fast" style={{ transitionDelay: "0.24s" }}>
            <StatCounter value={1} label="Infamous typo" delay={0.15} />
          </div>
        </div>
      </section>

      {/* ── TOOLS PREVIEW ── */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(32px, 5vw, 56px) 32px",
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
            What&apos;s Coming
          </p>
          <p
            style={{
              fontSize: "clamp(26px, 4vw, 44px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              maxWidth: 620,
            }}
          >
            A handful of the tools we&apos;re building right now.
          </p>
        </div>

        <div
          style={{
            marginTop: 44,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {featured.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} delay={i * 0.06} />
          ))}
        </div>

        <div
          className="reveal-fast"
          style={{ marginTop: 40, display: "flex", justifyContent: "center" }}
        >
          <Link href="/tools" className="btn">
            See all {tools.length} tools
            <span className="btn-arrow">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(56px, 8vw, 96px) 32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(40px, 6vw, 64px)",
          }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.num}
              className="reveal"
              style={{
                display: "flex",
                gap: "clamp(20px, 4vw, 40px)",
                borderTop: "2px solid #201e1d",
                paddingTop: 28,
              }}
            >
              <p
                style={{
                  fontSize: "clamp(24px, 3.5vw, 36px)",
                  fontWeight: 800,
                  opacity: 0.2,
                  minWidth: 60,
                }}
              >
                {feature.num}
              </p>
              <div style={{ maxWidth: 560 }}>
                <p
                  className="ink-hover"
                  style={{
                    fontSize: "clamp(20px, 2.6vw, 28px)",
                    fontWeight: 700,
                    marginBottom: 12,
                    display: "inline-block",
                  }}
                >
                  {feature.title}
                </p>
                <p
                  style={{
                    fontSize: "clamp(14px, 1.6vw, 17px)",
                    lineHeight: 1.7,
                    opacity: 0.7,
                  }}
                >
                  {feature.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 32px clamp(48px, 8vw, 88px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="reveal"
          style={{
            border: "2px solid #201e1d",
            padding: "clamp(32px, 6vw, 56px)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ maxWidth: 480 }}>
            <p
              style={{
                fontSize: "clamp(20px, 3vw, 30px)",
                fontWeight: 800,
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
              }}
            >
              Curious why it&apos;s spelled{" "}
              <span style={{ color: "#ec3013" }}>Daliy</span>, not Daily?
            </p>
          </div>
          <Link href="/about" className="btn btn-primary">
            Read the story
            <span className="btn-arrow">&rarr;</span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
