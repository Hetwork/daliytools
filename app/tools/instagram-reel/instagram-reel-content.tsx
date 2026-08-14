"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";

interface ReelResult {
  shortcode: string;
  videoUrl: string | null;
  thumbnail: string | null;
  username: string;
  caption: string;
  audio: string | null;
  duration: string | null;
}

export default function InstagramReelContent() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReelResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

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

  async function handleFetch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    if (!trimmed.includes("instagram.com")) {
      setError("Please enter a valid Instagram reel URL.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/instagram/reel?url=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to fetch reel.");
        return;
      }

      if (!data.videoUrl) {
        setError("No video found in this post. Make sure it's a reel or video post.");
        return;
      }

      setResult(data as ReelResult);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function download() {
    if (!result?.videoUrl) return;
    setDownloading(true);
    try {
      const filename = `instagram_reel_${result.shortcode}`;
      const proxyUrl = `/api/instagram/proxy?url=${encodeURIComponent(result.videoUrl)}&filename=${encodeURIComponent(filename)}`;
      const a = document.createElement("a");
      a.href = proxyUrl;
      a.download = filename;
      a.click();
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
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
          <Link href="/tools" className="ink-hover">All Tools</Link> / Social Media / Instagram Reel Downloader
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Instagram Reel Downloader</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Save any public Instagram reel as MP4 directly to your device. Paste the reel URL and download in seconds.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          <form onSubmit={handleFetch} className="fade-in-up">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(null); }}
                placeholder="https://www.instagram.com/reel/..."
                style={{
                  flex: 1,
                  minWidth: 260,
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
                {loading ? "Fetching…" : "Fetch Reel"}
              </button>
            </div>
            {error && <p style={{ marginTop: 8, fontSize: 13, color: "#ec3013", fontWeight: 600 }}>{error}</p>}
          </form>

          {loading && (
            <div className="fade-in-up" style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 12 }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.6 }}>Fetching reel&hellip;</span>
            </div>
          )}

          {result && (
            <div className="fade-in-up" style={{ marginTop: 32, border: "2px solid #201e1d", padding: "clamp(24px, 4vw, 36px)" }}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 28 }}>
                {/* Thumbnail */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {result.thumbnail && (
                    <img
                      src={result.thumbnail}
                      alt="Reel thumbnail"
                      style={{ width: 100, height: 180, objectFit: "cover", border: "2px solid #201e1d", display: "block" }}
                    />
                  )}
                  {result.duration && (
                    <div style={{ position: "absolute", bottom: 6, left: 6, background: "#201e1d", color: "#f3f2f2", fontSize: 10, fontWeight: 800, padding: "2px 6px" }}>
                      {result.duration}
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 6 }}>Instagram Reel</p>
                  {result.username && (
                    <p style={{ fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 800, marginBottom: 8 }}>{result.username}</p>
                  )}
                  {result.caption && (
                    <p style={{ fontSize: 14, opacity: 0.6, lineHeight: 1.6, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {result.caption}
                    </p>
                  )}
                  {result.audio && (
                    <p style={{ fontSize: 13, opacity: 0.5 }}>♪ {result.audio}</p>
                  )}
                </div>
              </div>

              {/* Download */}
              <button
                type="button"
                onClick={download}
                disabled={downloading}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 22px",
                  border: "2px solid #201e1d",
                  background: "#201e1d",
                  color: "#f3f2f2",
                  fontFamily: "var(--font-archivo)",
                  fontWeight: 700,
                  fontSize: 15,
                  textAlign: "left",
                  opacity: downloading ? 0.6 : 1,
                }}
              >
                <span>{downloading ? "Starting download…" : "Download Reel (MP4)"}</span>
                <span style={{ fontSize: 18 }}>&darr;</span>
              </button>

              <button
                type="button"
                onClick={() => { setResult(null); setUrl(""); setError(null); }}
                className="ink-hover"
                style={{ marginTop: 20, background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.5, fontFamily: "inherit" }}
              >
                Try another URL
              </button>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            The server fetches the public Instagram reel page, extracts the video URL from the page metadata, and proxies the MP4 download directly to your device. Only public reels can be downloaded. Only use this tool for content you own or have permission to download.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
