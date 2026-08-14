"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";

interface Story { id: number; type: "image" | "video"; thumbnail: string }
interface StoryResult { username: string; stories: Story[] }

const MOCK_STORIES: Story[] = [
  { id: 1, type: "image", thumbnail: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&h=540&fit=crop" },
  { id: 2, type: "video", thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=540&fit=crop" },
  { id: 3, type: "image", thumbnail: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=300&h=540&fit=crop" },
  { id: 4, type: "image", thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=540&fit=crop" },
];

export default function InstagramStoryContent() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-fast").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const name = username.trim().replace(/^@/, "");
    if (!name) return;
    setError(null);
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult({ username: name, stories: MOCK_STORIES });
    }, 2000);
  }

  return (
    <main
      className="noise"
      style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}
    >
      <SiteHeader active="Tools" />

      <section
        style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}
      >
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Social Media / Instagram Story Viewer
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Instagram Story Viewer</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            View and download Instagram stories anonymously. Enter a username to browse their active stories without leaving a trace.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          <form onSubmit={handleSearch} className="fade-in-up">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(null); }}
                placeholder="@username or username"
                style={{
                  flex: 1,
                  minWidth: 240,
                  border: `2px solid ${error ? "#ec3013" : "#201e1d"}`,
                  background: "transparent",
                  color: "#201e1d",
                  fontFamily: "var(--font-archivo)",
                  fontSize: 15,
                  fontWeight: 500,
                  padding: "14px 18px",
                  outline: "none",
                }}
              />
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                {loading ? "Searching…" : "View Stories"}
              </button>
            </div>
            {error && <p style={{ marginTop: 8, fontSize: 13, color: "#ec3013", fontWeight: 600 }}>{error}</p>}
          </form>

          {loading && (
            <div className="fade-in-up" style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 12 }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.6 }}>Fetching stories&hellip;</span>
            </div>
          )}

          {result && (
            <div className="fade-in-up" style={{ marginTop: 32 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <p style={{ fontSize: "clamp(17px, 2vw, 22px)", fontWeight: 800 }}>
                  @{result.username} <span style={{ opacity: 0.4, fontSize: 14, fontWeight: 400 }}>· {result.stories.length} stories</span>
                </p>
                <button type="button" onClick={() => { setResult(null); setUsername(""); }} className="ink-hover" style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.5, fontFamily: "inherit" }}>
                  Search again
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
                {result.stories.map((story) => (
                  <div key={story.id} style={{ position: "relative", border: "2px solid #201e1d" }}>
                    <img
                      src={story.thumbnail}
                      alt={`Story ${story.id}`}
                      style={{ display: "block", width: "100%", aspectRatio: "9/16", objectFit: "cover" }}
                    />
                    {story.type === "video" && (
                      <div style={{ position: "absolute", top: 8, right: 8, background: "#ec3013", color: "#f3f2f2", fontSize: 9, fontWeight: 800, padding: "2px 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Video
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => alert("Demo only — download would save this story")}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "rgba(32,30,29,0.8)",
                        border: "none",
                        color: "#f3f2f2",
                        fontFamily: "var(--font-archivo)",
                        fontWeight: 700,
                        fontSize: 11,
                        padding: "8px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      Download &darr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            Enter any public Instagram username to view their currently active stories without them knowing.
            Stories are fetched anonymously and displayed in a grid. Click Download on any story to save it locally.
            Only use this tool to view publicly available content.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
