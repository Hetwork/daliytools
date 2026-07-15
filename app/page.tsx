"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Home() {

  // scroll reveal
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

    document.querySelectorAll(".reveal, .reveal-fast").forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  return (
    <>
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
        {/* ── HERO ── */}
        <section
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 32px",
            paddingTop: "clamp(48px, 10vw, 96px)",
          }}
        >
          {/* top rule */}
          <div
            className="line-animated"
            style={{ height: 12, background: "#201e1d", marginBottom: 28 }}
          />

          {/* logo row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <h1
              className="logo-text"
              style={{
                fontSize: "clamp(52px, 10vw, 108px)",
                fontWeight: 800,
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              daliy
              <span style={{ color: "#ec3013" }}>.</span>
              tools
            </h1>
            <div className="red-square" style={{ marginTop: 4 }} />
          </div>

          {/* bottom rule */}
          <div
            className="line-animated"
            style={{
              height: 12,
              background: "#201e1d",
              marginTop: 28,
              animationDelay: "0.15s",
            }}
          />
        </section>

        {/* ── COMING SOON ── */}
        <section
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 32px",
            paddingTop: "clamp(32px, 6vw, 64px)",
            paddingBottom: "clamp(48px, 8vw, 96px)",
          }}
        >
          <div
            className="coming-soon-badge"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <span
              style={{
                fontSize: "clamp(11px, 1.4vw, 13px)",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#f3f2f2",
                background: "#ec3013",
                padding: "6px 14px",
                textTransform: "uppercase",
              }}
            >
              Coming Soon
            </span>
            <span
              style={{
                fontSize: "clamp(11px, 1.4vw, 13px)",
                fontWeight: 500,
                letterSpacing: "0.1em",
                opacity: 0.45,
                textTransform: "uppercase",
              }}
            >
              About Daliy
              <span style={{ color: "#ec3013" }}>.</span>
              Tools
              <span className="blink" style={{ marginLeft: 2 }}>
                _
              </span>
            </span>
          </div>

          {/* ── STORY ── */}
          <div
            style={{
              marginTop: "clamp(56px, 9vw, 112px)",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(48px, 7vw, 80px)",
            }}
          >
            {/* Block 1 – The Typo */}
            <div className="reveal" style={{ maxWidth: 640 }}>
              <p
                style={{
                  fontSize: "clamp(36px, 6vw, 64px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                Yes.
                <br />
                It&apos;s{" "}
                <span className="accent ink-hover">Daliy</span>.
                <br />
                Not Daily.
              </p>
            </div>

            {/* Block 2 – Origin */}
            <div className="reveal" style={{ maxWidth: 580 }}>
              <p
                style={{
                  fontSize: "clamp(16px, 2vw, 22px)",
                  fontWeight: 400,
                  lineHeight: 1.75,
                  opacity: 0.85,
                }}
              >
                That wasn&apos;t the plan.
                <br />
                <br />
                When we went to buy the domain, we made the kind of mistake
                every developer, designer, and founder has made at least once.
                One missing letter. One typo. One{" "}
                <em>&ldquo;We&apos;ll fix it later.&rdquo;</em>
                <br />
                <br />
                Except&hellip; we couldn&apos;t.
                <br />
                The domain was already ours.
              </p>
            </div>

            {/* Block 3 – The Question */}
            <div
              className="reveal"
              style={{
                borderLeft: "4px solid #ec3013",
                paddingLeft: 28,
                maxWidth: 560,
              }}
            >
              <p
                style={{
                  fontSize: "clamp(20px, 3vw, 32px)",
                  fontWeight: 700,
                  lineHeight: 1.4,
                  letterSpacing: "-0.01em",
                }}
              >
                &ldquo;If our tools help people fix mistakes every day&hellip;
                why are we embarrassed by one of our own?&rdquo;
              </p>
              <p
                style={{
                  marginTop: 20,
                  fontSize: "clamp(14px, 1.6vw, 18px)",
                  opacity: 0.55,
                  fontWeight: 500,
                }}
              >
                So we kept it.
              </p>
            </div>

            {/* Block 4 – The Problem */}
            <div className="reveal" style={{ maxWidth: 640 }}>
              <p
                style={{
                  fontSize: "clamp(14px, 1.6vw, 18px)",
                  fontWeight: 400,
                  lineHeight: 1.8,
                  opacity: 0.8,
                }}
              >
                The internet has millions of tools.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "10px 24px",
                  margin: "24px 0",
                }}
              >
                {[
                  "Compress a PDF?",
                  "Convert an image?",
                  "Generate a QR code?",
                  "Count words?",
                  "Resize a photo?",
                  "Remove a background?",
                  "Calculate percentages?",
                  "Compare two files?",
                ].map((task) => (
                  <p
                    key={task}
                    className="ink-hover"
                    style={{
                      fontSize: "clamp(14px, 1.5vw, 17px)",
                      fontWeight: 500,
                      opacity: 0.7,
                      paddingBottom: 2,
                    }}
                  >
                    {task}
                  </p>
                ))}
              </div>
              <p
                style={{
                  fontSize: "clamp(14px, 1.6vw, 18px)",
                  fontWeight: 400,
                  lineHeight: 1.8,
                  opacity: 0.8,
                }}
              >
                Every task sends you to a different website, usually full of
                popups, paywalls, and enough ads to make your browser cry.
              </p>
            </div>

            {/* Block 5 – The Solution */}
            <div className="reveal" style={{ maxWidth: 580 }}>
              <p
                style={{
                  fontSize: "clamp(28px, 4.5vw, 52px)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                We thought there had to be a better way.
                <br />
                <span style={{ color: "#ec3013" }}>
                  So we started building one.
                </span>
              </p>
              <div
                style={{
                  marginTop: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {[
                  "One simple website.",
                  "Hundreds of genuinely useful tools.",
                  "Fast.",
                  "Free whenever possible.",
                  "No unnecessary complexity.",
                ].map((line, i) => (
                  <p
                    key={line}
                    className="reveal-fast"
                    style={{
                      fontSize: "clamp(15px, 1.8vw, 20px)",
                      fontWeight: i === 0 ? 600 : 400,
                      lineHeight: 1.6,
                      opacity: 0.85,
                      transitionDelay: `${i * 0.08}s`,
                    }}
                  >
                    {line}
                  </p>
                ))}
                <p
                  className="reveal-fast"
                  style={{
                    fontSize: "clamp(15px, 1.8vw, 20px)",
                    fontWeight: 700,
                    lineHeight: 1.6,
                    marginTop: 4,
                    transitionDelay: "0.45s",
                  }}
                >
                  Just open the tool, get your job done, and move on with your
                  day.
                  <br />
                  Or your{" "}
                  <span style={{ color: "#ec3013" }}>daliy</span>.
                </p>
              </div>
            </div>

            {/* Block 6 – The Brand */}
            <div className="reveal" style={{ maxWidth: 580 }}>
              <p
                style={{
                  fontSize: "clamp(14px, 1.6vw, 18px)",
                  lineHeight: 1.8,
                  opacity: 0.8,
                }}
              >
                People ask if the name bothers us.
                <br />
                Not anymore. In fact, we like it.
                <br />
                <br />
                It&apos;s a reminder that good products aren&apos;t built by people who
                never make mistakes.{" "}
                <strong>
                  They&apos;re built by people who keep shipping anyway.
                </strong>
                <br />
                <br />
                Every time someone notices the typo, they remember the name.
                <br />
                That&apos;s marketing we couldn&apos;t have planned.
              </p>
            </div>

            {/* Block 7 – Mission */}
            <div
              className="reveal"
              style={{
                paddingTop: "clamp(32px, 5vw, 56px)",
                borderTop: "2px solid #201e1d",
              }}
            >
              <p
                style={{
                  fontSize: "clamp(10px, 1.2vw, 12px)",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  opacity: 0.45,
                  marginBottom: 20,
                }}
              >
                Our Mission
              </p>
              <p
                style={{
                  fontSize: "clamp(24px, 4vw, 44px)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                To build the internet&apos;s most useful collection of online tools.
              </p>
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {[
                  "One tool at a time.",
                  "One problem at a time.",
                  "One typo at a time.",
                ].map((line, i) => (
                  <p
                    key={line}
                    className="reveal-fast"
                    style={{
                      fontSize: "clamp(15px, 1.8vw, 20px)",
                      fontWeight: 500,
                      opacity: 0.6,
                      transitionDelay: `${i * 0.1}s`,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            background: "#201e1d",
            color: "#f3f2f2",
            padding: "clamp(40px, 6vw, 72px) 32px",
            marginTop: "clamp(48px, 8vw, 96px)",
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div className="reveal">
              <p
                style={{
                  fontSize: "clamp(28px, 5vw, 56px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                Welcome to Daliy
                <span style={{ color: "#ec3013" }}>.</span>
                Tools.
              </p>
              <p
                style={{
                  marginTop: 16,
                  fontSize: "clamp(14px, 1.5vw, 17px)",
                  opacity: 0.45,
                  fontWeight: 400,
                }}
              >
                We promise the tools are spelled correctly.
              </p>
            </div>
            <div
              style={{
                marginTop: 48,
                paddingTop: 24,
                borderTop: "1px solid rgba(243,242,242,0.12)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  opacity: 0.3,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                }}
              >
                daliy.tools — everyday utilities
              </p>
              <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                <Link
                  href="/privacy-policy"
                  style={{
                    fontSize: 12,
                    opacity: 0.3,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textDecoration: "none",
                    color: "#f3f2f2",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.3")}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-use"
                  style={{
                    fontSize: 12,
                    opacity: 0.3,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textDecoration: "none",
                    color: "#f3f2f2",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.3")}
                >
                  Terms of Use
                </Link>
                <p style={{ fontSize: 12, opacity: 0.3, fontWeight: 500 }}>
                  © {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
