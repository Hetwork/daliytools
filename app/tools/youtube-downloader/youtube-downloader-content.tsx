"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolAdRail from "../../_components/tool-ad-rail";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

interface Format {
  id: string;
  qualityLabel: string;
  ext: string;
  filesize: number | null;
  type: "video" | "audio";
}

interface VideoInfo {
  videoId: string;
  title: string;
  author: string;
  thumbnail: string | null;
  duration: string;
  viewCount: string;
  formats: Format[];
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes > 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function formatViews(count: string): string {
  const n = parseInt(count, 10);
  if (n > 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n > 1_000) return `${(n / 1_000).toFixed(0)}K views`;
  return `${n} views`;
}

export default function YouTubeDownloaderContent() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [setupWarning, setSetupWarning] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  useEffect(() => {
    let active = true;

    async function checkDownloaderRuntime() {
      try {
        const res = await fetch("/api/youtube/status", { cache: "no-store" });
        if (!active) return;

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const hint = data?.windowsHint || data?.installHint || "Install yt-dlp and ensure it is in PATH.";
          setSetupWarning(`YouTube downloads are not ready on this server. ${hint}`);
          return;
        }

        setSetupWarning(null);
      } catch {
        if (!active) return;
        setSetupWarning("Could not verify downloader runtime. If fetching fails, install yt-dlp and ensure it is in PATH.");
      }
    }

    void checkDownloaderRuntime();

    return () => {
      active = false;
    };
  }, []);

  async function handleFetch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    if (!trimmed.includes("youtube.com") && !trimmed.includes("youtu.be")) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    setError(null);
    setLoading(true);
    setInfo(null);
    setSelectedId(null);

    try {
      const res = await fetch(`/api/youtube/info?url=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to fetch video info.");
        return;
      }
      setInfo(data as VideoInfo);
      if (data.formats?.length > 0) setSelectedId(data.formats[0].id);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!info || !selectedId) return;
    setDownloading(true);
    const safeName = info.title.replace(/[^a-zA-Z0-9_\- ]/g, "_").slice(0, 80);
    const fmt = info.formats.find((f) => f.id === selectedId);
    const a = document.createElement("a");
    a.href = `/api/youtube/download?url=${encodeURIComponent(url.trim())}&formatId=${encodeURIComponent(selectedId)}&ext=${fmt?.ext ?? "mp4"}&filename=${encodeURIComponent(safeName)}`;
    a.download = safeName;
    a.click();
    setTimeout(() => setDownloading(false), 3000);
  }

  const selectedFormat = info?.formats.find((f) => f.id === selectedId);

  return (
    <main
      className="noise"
      style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}
    >
      <SiteHeader active="Tools" />

      <div className="tool-ad-layout">
        <ToolAdRail />

      <section
        style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}
      >
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Social Media / YouTube Video Downloader
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>YouTube Video Downloader</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Paste any public YouTube link, pick your quality, and download as MP4 or audio-only M4A. No sign-up needed.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          {setupWarning && (
            <div
              className="fade-in-up"
              style={{
                marginBottom: 16,
                border: "2px solid #ec3013",
                background: "rgba(236,48,19,0.06)",
                padding: "12px 14px",
              }}
            >
              <p style={{ fontSize: 13, color: "#201e1d", fontWeight: 600, lineHeight: 1.55 }}>{setupWarning}</p>
            </div>
          )}

          <form onSubmit={handleFetch} className="fade-in-up">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(null); }}
                placeholder="https://www.youtube.com/watch?v=..."
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
                {loading ? "Fetching…" : "Fetch Video"}
              </button>
            </div>
            {error && <p style={{ marginTop: 8, fontSize: 13, color: "#ec3013", fontWeight: 600 }}>{error}</p>}
          </form>

          {loading && (
            <div className="fade-in-up" style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 12 }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.6 }}>Fetching video info&hellip;</span>
            </div>
          )}

          {info && (
            <div className="fade-in-up" style={{ marginTop: 32, border: "2px solid #201e1d", padding: "clamp(24px, 4vw, 36px)" }}>
              {/* Video preview */}
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 28 }}>
                {info.thumbnail && (
                  <img
                    src={info.thumbnail}
                    alt="Video thumbnail"
                    style={{ width: 160, height: 90, objectFit: "cover", border: "2px solid #201e1d", flexShrink: 0 }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 6 }}>YouTube Video</p>
                  <p style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 800, marginBottom: 6, lineHeight: 1.3 }}>{info.title}</p>
                  <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 4 }}>{info.author}</p>
                  <p style={{ fontSize: 12, opacity: 0.45 }}>
                    {info.duration} &middot; {formatViews(info.viewCount)}
                  </p>
                </div>
              </div>

              {/* Quality selector */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 12 }}>Select Quality</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {info.formats.map((f) => (
                    <label
                      key={f.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        border: `2px solid ${selectedId === f.id ? "#201e1d" : "#c8c6c4"}`,
                        background: selectedId === f.id ? "#201e1d" : "transparent",
                        color: selectedId === f.id ? "#f3f2f2" : "#201e1d",
                        cursor: "pointer",
                        fontFamily: "var(--font-archivo)",
                      }}
                    >
                      <input
                        type="radio"
                        name="quality"
                        value={f.id}
                        checked={selectedId === f.id}
                        onChange={() => setSelectedId(f.id)}
                        style={{ display: "none" }}
                      />
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{f.qualityLabel}</span>
                      <span style={{ fontSize: 12, opacity: 0.6, marginLeft: "auto" }}>
                        {f.ext.toUpperCase()}
                        {f.filesize ? ` · ${formatBytes(f.filesize)}` : ""}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Download button */}
              <button
                type="button"
                onClick={download}
                disabled={downloading || !selectedId}
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
                  cursor: downloading ? "not-allowed" : "pointer",
                  opacity: downloading ? 0.6 : 1,
                }}
              >
                <span>
                  {downloading
                    ? "Starting download…"
                    : `Download ${selectedFormat?.type === "audio" ? "Audio (M4A)" : "Video (MP4)"}`}
                </span>
                <span style={{ fontSize: 18 }}>&darr;</span>
              </button>

              <button
                type="button"
                onClick={() => { setInfo(null); setUrl(""); setError(null); setSelectedId(null); }}
                className="ink-hover"
                style={{ marginTop: 20, background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.5, fontFamily: "inherit", cursor: "pointer" }}
              >
                Try another URL
              </button>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            The server fetches available video formats directly from YouTube and streams the selected quality to your device. Only public videos can be downloaded. Only use this tool for content you own or have permission to download.
          </p>
        </div>
        <ToolEditorial toolName="YouTube Video Downloader" {...toolEditorialData["youtube-downloader"]} />
      </section>

              <ToolAdRail />
      </div>

      <SiteFooter />
    </main>
  );
}
