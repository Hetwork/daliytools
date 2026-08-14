"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";

interface PostResult {
  shortcode: string;
  type: "image" | "video";
  imageUrls: string[];
  imageCount: number;
  isCarousel: boolean;
  mediaUrl: string;
  thumbnail: string | null;
  username: string;
  caption: string;
}

export default function InstagramPostContent() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PostResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

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
      setError("Please enter a valid Instagram post URL.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/instagram/post?url=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to fetch post.");
        return;
      }

      setResult(data as PostResult);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  function downloadMedia(mediaUrl: string, filename: string, index: number) {
    setDownloading(index);
    const proxyUrl = `/api/instagram/proxy?url=${encodeURIComponent(mediaUrl)}&filename=${encodeURIComponent(filename)}`;
    const a = document.createElement("a");
    a.href = proxyUrl;
    a.download = filename;
    a.click();
    setTimeout(() => setDownloading(null), 2000);
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
          <Link href="/tools" className="ink-hover">All Tools</Link> / Social Media / Instagram Post Downloader
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Instagram Post Downloader</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Paste a public Instagram post URL to download all photos or the video at full quality. Supports carousels. No login required.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          <form onSubmit={handleFetch} className="fade-in-up">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(null); }}
                placeholder="https://www.instagram.com/p/..."
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
                {loading ? "Fetching…" : "Fetch Post"}
              </button>
            </div>
            {error && <p style={{ marginTop: 8, fontSize: 13, color: "#ec3013", fontWeight: 600 }}>{error}</p>}
          </form>

          {loading && (
            <div className="fade-in-up" style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 12 }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.6 }}>Fetching post&hellip;</span>
            </div>
          )}

          {result && (
            <div className="fade-in-up" style={{ marginTop: 32, border: "2px solid #201e1d", padding: "clamp(24px, 4vw, 36px)" }}>
              {/* Header meta */}
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 28, alignItems: "flex-start" }}>
                {result.thumbnail && (
                  <img
                    src={result.thumbnail}
                    alt="Post thumbnail"
                    style={{ width: 80, height: 80, objectFit: "cover", border: "2px solid #201e1d", display: "block", flexShrink: 0 }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, margin: 0 }}>Instagram Post</p>
                    {result.isCarousel && (
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", background: "#201e1d", color: "#f3f2f2", padding: "2px 8px" }}>
                        {result.imageCount} photos
                      </span>
                    )}
                    {result.type === "video" && (
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", background: "#ec3013", color: "#f3f2f2", padding: "2px 8px" }}>
                        Video
                      </span>
                    )}
                  </div>
                  {result.username && (
                    <p style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 800, marginBottom: 6 }}>{result.username}</p>
                  )}
                  {result.caption && (
                    <p style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {result.caption}
                    </p>
                  )}
                </div>
              </div>

              {/* Video download */}
              {result.type === "video" && (
                <button
                  type="button"
                  onClick={() => downloadMedia(result.mediaUrl, `instagram_${result.shortcode}`, 0)}
                  disabled={downloading === 0}
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
                    opacity: downloading === 0 ? 0.6 : 1,
                  }}
                >
                  <span>{downloading === 0 ? "Starting download…" : "Download Video (MP4)"}</span>
                  <span style={{ fontSize: 18 }}>&darr;</span>
                </button>
              )}

              {/* Image grid */}
              {result.type === "image" && result.imageUrls.length > 0 && (
                <>
                  {result.imageUrls.length === 1 ? (
                    <button
                      type="button"
                      onClick={() => downloadMedia(result.imageUrls[0], `instagram_${result.shortcode}`, 0)}
                      disabled={downloading === 0}
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
                        opacity: downloading === 0 ? 0.6 : 1,
                      }}
                    >
                      <span>{downloading === 0 ? "Starting download…" : "Download Image (JPG)"}</span>
                      <span style={{ fontSize: 18 }}>&darr;</span>
                    </button>
                  ) : (
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, marginBottom: 14 }}>
                        {result.imageCount} photos — click any to download
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                        {result.imageUrls.map((imgUrl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => downloadMedia(imgUrl, `instagram_${result.shortcode}_${i + 1}`, i)}
                            disabled={downloading === i}
                            style={{
                              position: "relative",
                              border: "2px solid #201e1d",
                              background: "none",
                              padding: 0,
                              overflow: "hidden",
                              aspectRatio: "1",
                              opacity: downloading === i ? 0.6 : 1,
                            }}
                          >
                            <img
                              src={imgUrl}
                              alt={`Photo ${i + 1}`}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(32,30,29,0.55)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0,
                                transition: "opacity 0.15s",
                              }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "1")}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "0")}
                            >
                              <span style={{ color: "#f3f2f2", fontSize: 22 }}>&darr;</span>
                              <span style={{ color: "#f3f2f2", fontSize: 11, fontWeight: 700, marginTop: 4 }}>
                                {downloading === i ? "Downloading…" : `Photo ${i + 1}`}
                              </span>
                            </div>
                            <div style={{ position: "absolute", top: 6, left: 6, background: "#201e1d", color: "#f3f2f2", fontSize: 10, fontWeight: 800, padding: "2px 6px" }}>
                              {i + 1}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Download all */}
                      <button
                        type="button"
                        onClick={() => {
                          result.imageUrls.forEach((imgUrl, i) => {
                            setTimeout(() => downloadMedia(imgUrl, `instagram_${result.shortcode}_${i + 1}`, i), i * 300);
                          });
                        }}
                        style={{
                          marginTop: 16,
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "14px 22px",
                          border: "2px solid #201e1d",
                          background: "#201e1d",
                          color: "#f3f2f2",
                          fontFamily: "var(--font-archivo)",
                          fontWeight: 700,
                          fontSize: 15,
                          textAlign: "left",
                        }}
                      >
                        <span>Download All {result.imageCount} Photos</span>
                        <span style={{ fontSize: 18 }}>&darr;</span>
                      </button>
                    </div>
                  )}
                </>
              )}

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
            The server fetches the public Instagram page, extracts all image or video URLs from the embedded page data (supporting carousel posts with multiple photos), and proxies each file download directly to your device. Only public posts can be downloaded. Only use this tool for content you own or have permission to download.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
