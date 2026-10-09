"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

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

function Lightbox({
  images,
  startIndex,
  shortcode,
  onClose,
}: {
  images: string[];
  startIndex: number;
  shortcode: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [downloading, setDownloading] = useState(false);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  function download() {
    setDownloading(true);
    const filename = `instagram_${shortcode}_${index + 1}`;
    const proxyUrl = `/api/instagram/proxy?url=${encodeURIComponent(images[index])}&filename=${encodeURIComponent(filename)}`;
    const a = document.createElement("a");
    a.href = proxyUrl;
    a.download = filename;
    a.click();
    setTimeout(() => setDownloading(false), 2000);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Controls bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          gap: 10,
          zIndex: 1001,
        }}
      >
        {images.length > 1 && (
          <span style={{ color: "var(--on-solid)", fontSize: 13, fontWeight: 700, opacity: 0.6, lineHeight: "40px", paddingRight: 6 }}>
            {index + 1} / {images.length}
          </span>
        )}
        <button
          onClick={download}
          disabled={downloading}
          title="Download"
          style={{
            width: 40,
            height: 40,
            border: "2px solid rgba(243,242,242,0.4)",
            background: "rgba(243,242,242,0.1)",
            color: "var(--on-solid)",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: downloading ? 0.5 : 1,
          }}
        >
          ↓
        </button>
        <button
          onClick={onClose}
          title="Close"
          style={{
            width: 40,
            height: 40,
            border: "2px solid rgba(243,242,242,0.4)",
            background: "rgba(243,242,242,0.1)",
            color: "var(--on-solid)",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      </div>

      {/* Prev arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 44,
            height: 44,
            border: "2px solid rgba(243,242,242,0.4)",
            background: "rgba(243,242,242,0.1)",
            color: "var(--on-solid)",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
        >
          ←
        </button>
      )}

      {/* Image */}
      <img
        onClick={(e) => e.stopPropagation()}
        src={images[index]}
        alt={`Photo ${index + 1}`}
        style={{
          maxWidth: "min(90vw, 800px)",
          maxHeight: "85vh",
          objectFit: "contain",
          display: "block",
          border: "2px solid rgba(243,242,242,0.15)",
        }}
      />

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          style={{
            position: "absolute",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 44,
            height: 44,
            border: "2px solid rgba(243,242,242,0.4)",
            background: "rgba(243,242,242,0.1)",
            color: "var(--on-solid)",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
        >
          →
        </button>
      )}
    </div>
  );
}

export default function InstagramPostContent() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PostResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

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

  function downloadImage(mediaUrl: string, filename: string, idx: number) {
    setDownloading(idx);
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
      style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}
    >
      <SiteHeader active="Tools" />

      {lightbox !== null && result?.imageUrls && (
        <Lightbox
          images={result.imageUrls}
          startIndex={lightbox}
          shortcode={result.shortcode}
          onClose={() => setLightbox(null)}
        />
      )}

      <section
        style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}
      >
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Social Media / Instagram Post Downloader
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "var(--on-solid)", background: "var(--red)", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
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
                  border: `2px solid ${error ? "var(--red)" : "var(--border)"}`,
                  background: "transparent",
                  color: "var(--ink)",
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
            {error && <p style={{ marginTop: 8, fontSize: 13, color: "var(--red)", fontWeight: 600 }}>{error}</p>}
          </form>

          {loading && (
            <div className="fade-in-up" style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 12 }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.6 }}>Fetching post&hellip;</span>
            </div>
          )}

          {result && (
            <div className="fade-in-up" style={{ marginTop: 32, border: "2px solid var(--border)", padding: "clamp(24px, 4vw, 36px)" }}>

              {/* Meta row */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28, alignItems: "flex-start" }}>
                {result.thumbnail && (
                  <img
                    src={result.thumbnail}
                    alt="thumbnail"
                    style={{ width: 72, height: 72, objectFit: "cover", border: "2px solid var(--border)", flexShrink: 0 }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4 }}>Instagram Post</span>
                    {result.isCarousel && (
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--solid)", color: "var(--on-solid)", padding: "2px 7px" }}>
                        {result.imageCount} photos
                      </span>
                    )}
                    {result.type === "video" && (
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--red)", color: "var(--on-solid)", padding: "2px 7px" }}>
                        Video
                      </span>
                    )}
                  </div>
                  {result.username && (
                    <p style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 800, marginBottom: 5 }}>{result.username}</p>
                  )}
                  {result.caption && (
                    <p style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {result.caption}
                    </p>
                  )}
                </div>
              </div>

              {/* Video */}
              {result.type === "video" && (
                <button
                  type="button"
                  onClick={() => downloadImage(result.mediaUrl, `instagram_${result.shortcode}`, 0)}
                  disabled={downloading === 0}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 22px",
                    border: "2px solid var(--border)",
                    background: "var(--solid)",
                    color: "var(--on-solid)",
                    fontFamily: "var(--font-archivo)",
                    fontWeight: 700,
                    fontSize: 15,
                    textAlign: "left",
                    opacity: downloading === 0 ? 0.6 : 1,
                  }}
                >
                  <span>{downloading === 0 ? "Starting download…" : "Download Video (MP4)"}</span>
                  <span style={{ fontSize: 18 }}>↓</span>
                </button>
              )}

              {/* Single image */}
              {result.type === "image" && result.imageUrls.length === 1 && (
                <div>
                  <div
                    onClick={() => setLightbox(0)}
                    style={{ position: "relative", display: "inline-block", cursor: "zoom-in", border: "2px solid var(--border)", marginBottom: 12 }}
                  >
                    <img
                      src={result.imageUrls[0]}
                      alt="Photo"
                      style={{ width: 200, height: 200, objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadImage(result.imageUrls[0], `instagram_${result.shortcode}`, 0)}
                    disabled={downloading === 0}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 22px",
                      border: "2px solid var(--border)",
                      background: "var(--solid)",
                      color: "var(--on-solid)",
                      fontFamily: "var(--font-archivo)",
                      fontWeight: 700,
                      fontSize: 15,
                      width: "100%",
                      opacity: downloading === 0 ? 0.6 : 1,
                    }}
                  >
                    <span>{downloading === 0 ? "Starting download…" : "Download Image (JPG)"}</span>
                    <span style={{ fontSize: 18 }}>↓</span>
                  </button>
                </div>
              )}

              {/* Carousel grid */}
              {result.type === "image" && result.imageUrls.length > 1 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, marginBottom: 14 }}>
                    {result.imageCount} photos — click image to preview, or download individually
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                    {result.imageUrls.map((imgUrl, i) => (
                      <div key={i} style={{ border: "2px solid var(--border)", overflow: "hidden" }}>
                        {/* Image (click → lightbox) */}
                        <div
                          onClick={() => setLightbox(i)}
                          style={{ position: "relative", aspectRatio: "1", cursor: "zoom-in", overflow: "hidden" }}
                        >
                          <img
                            src={imgUrl}
                            alt={`Photo ${i + 1}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                          {/* Number badge */}
                          <div style={{ position: "absolute", top: 7, left: 7, background: "var(--solid)", color: "var(--on-solid)", fontSize: 10, fontWeight: 800, padding: "2px 7px" }}>
                            {i + 1}
                          </div>
                          {/* Zoom hint overlay */}
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(var(--ink-rgb), 0.4)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              transition: "opacity 0.15s",
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0")}
                          >
                            <span style={{ color: "var(--on-solid)", fontSize: 28 }}>⤢</span>
                          </div>
                        </div>

                        {/* Download button below image */}
                        <button
                          type="button"
                          onClick={() => downloadImage(imgUrl, `instagram_${result.shortcode}_${i + 1}`, i)}
                          disabled={downloading === i}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 14px",
                            border: "none",
                            borderTop: "2px solid var(--border)",
                            background: downloading === i ? "var(--solid)" : "transparent",
                            color: downloading === i ? "var(--on-solid)" : "var(--ink)",
                            fontFamily: "var(--font-archivo)",
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            opacity: downloading === i ? 0.6 : 1,
                            transition: "background 0.15s, color 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            if (downloading !== i) {
                              (e.currentTarget as HTMLButtonElement).style.background = "var(--solid)";
                              (e.currentTarget as HTMLButtonElement).style.color = "var(--on-solid)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (downloading !== i) {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)";
                            }
                          }}
                        >
                          <span>{downloading === i ? "Downloading…" : "Download"}</span>
                          <span style={{ fontSize: 16 }}>↓</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Download all */}
                  <button
                    type="button"
                    onClick={() => {
                      result.imageUrls.forEach((imgUrl, i) => {
                        setTimeout(() => downloadImage(imgUrl, `instagram_${result.shortcode}_${i + 1}`, i), i * 400);
                      });
                    }}
                    style={{
                      marginTop: 16,
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 22px",
                      border: "2px solid var(--border)",
                      background: "var(--solid)",
                      color: "var(--on-solid)",
                      fontFamily: "var(--font-archivo)",
                      fontWeight: 700,
                      fontSize: 15,
                      textAlign: "left",
                    }}
                  >
                    <span>Download All {result.imageCount} Photos</span>
                    <span style={{ fontSize: 18 }}>↓</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => { setResult(null); setUrl(""); setError(null); setLightbox(null); }}
                className="ink-hover"
                style={{ marginTop: 20, background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.5, fontFamily: "inherit" }}
              >
                Try another URL
              </button>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid var(--border)", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            The server fetches the public Instagram page, extracts all image URLs from the embedded page data (supporting carousel posts with multiple photos), and proxies each file download directly to your device. Only public posts can be downloaded. Only use this tool for content you own or have permission to download.
          </p>
        </div>
        <ToolEditorial toolName="Instagram Post Downloader" {...toolEditorialData["instagram-post"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
