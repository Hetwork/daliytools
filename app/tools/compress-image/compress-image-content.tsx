"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";

interface CompressedImage {
  original: File;
  originalUrl: string;
  originalSize: number;
  compressedUrl: string | null;
  compressedSize: number | null;
  compressedBlob: Blob | null;
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export default function CompressImageContent() {
  const [image, setImage] = useState<CompressedImage | null>(null);
  const [quality, setQuality] = useState(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    return () => {
      if (image?.originalUrl) URL.revokeObjectURL(image.originalUrl);
      if (image?.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
    };
  }, [image]);

  const compressFile = useCallback(async (file: File, q: number): Promise<{ blob: Blob; url: string; size: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas not available"));
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Compression failed"));
              const url = URL.createObjectURL(blob);
              resolve({ blob, url, size: blob.size });
            },
            "image/jpeg",
            q / 100
          );
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  async function handleFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    if (image) {
      URL.revokeObjectURL(image.originalUrl);
      if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
    }
    setIsCompressing(true);
    const originalUrl = URL.createObjectURL(file);
    try {
      const { blob, url, size } = await compressFile(file, quality);
      setImage({ original: file, originalUrl, originalSize: file.size, compressedUrl: url, compressedSize: size, compressedBlob: blob });
    } catch {
      setImage({ original: file, originalUrl, originalSize: file.size, compressedUrl: null, compressedSize: null, compressedBlob: null });
    } finally {
      setIsCompressing(false);
    }
  }

  async function handleQualityChange(q: number) {
    setQuality(q);
    if (!image) return;
    setIsCompressing(true);
    if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
    try {
      const { blob, url, size } = await compressFile(image.original, q);
      setImage((prev) => prev ? { ...prev, compressedUrl: url, compressedSize: size, compressedBlob: blob } : prev);
    } finally {
      setIsCompressing(false);
    }
  }

  function download() {
    if (!image?.compressedUrl) return;
    const link = document.createElement("a");
    link.href = image.compressedUrl;
    link.download = `compressed_${image.original.name.replace(/\.[^/.]+$/, "")}.jpg`;
    link.click();
  }

  function reset() {
    if (image) {
      URL.revokeObjectURL(image.originalUrl);
      if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
    }
    setImage(null);
    setQuality(80);
  }

  const savings = image?.originalSize && image?.compressedSize
    ? Math.max(0, Math.round((1 - image.compressedSize / image.originalSize) * 100))
    : 0;

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
          <Link href="/tools" className="ink-hover">All Tools</Link> / Image Tools / Compress Image
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Compress Image</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Reduce image file size with a quality slider. Supports JPG, PNG, and WebP. Your file never leaves this tab.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          {!image && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0] ?? null); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className="fade-in-up"
              style={{
                border: `2px dashed ${isDragging ? "#ec3013" : "#201e1d"}`,
                background: isDragging ? "rgba(236,48,19,0.05)" : "transparent",
                padding: "clamp(48px, 8vw, 80px) 24px",
                textAlign: "center",
                transition: "border-color 0.25s ease, background 0.25s ease",
              }}
            >
              <div style={{ width: 56, height: 56, border: "2px solid #201e1d", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>IMG</div>
              <p style={{ fontSize: "clamp(17px, 2.2vw, 22px)", fontWeight: 700, marginBottom: 8 }}>Drag & drop your image here</p>
              <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", opacity: 0.55 }}>or click to browse — JPG, PNG, WebP</p>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            </div>
          )}

          {image && (
            <div className="fade-in-up">
              {/* File info + controls */}
              <div style={{ border: "2px solid #201e1d", padding: "clamp(24px, 4vw, 32px)", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 48, height: 48, border: "2px solid #201e1d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>IMG</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "clamp(14px, 1.8vw, 17px)", wordBreak: "break-all" }}>{image.original.name}</p>
                    <p style={{ opacity: 0.5, fontSize: 13, marginTop: 2 }}>{formatBytes(image.originalSize)}</p>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45 }}>Quality</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#ec3013" }}>{quality}%</p>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => handleQualityChange(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#ec3013", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.4, marginTop: 4 }}>
                    <span>Smallest</span>
                    <span>Best quality</span>
                  </div>
                </div>
              </div>

              {/* Result */}
              {isCompressing && (
                <div style={{ border: "2px solid #201e1d", padding: 24, display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="pulse-dot" />
                  <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.6 }}>Compressing&hellip;</span>
                </div>
              )}

              {!isCompressing && image.compressedSize !== null && (
                <div style={{ border: "2px solid #201e1d", padding: "clamp(24px, 4vw, 36px)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                    <p style={{ fontSize: "clamp(11px, 1.3vw, 13px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.45 }}>Result</p>
                    <p style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#ec3013", lineHeight: 1, letterSpacing: "-0.02em" }}>{savings}% smaller</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                        <span style={{ opacity: 0.5 }}>Original</span>
                        <span>{formatBytes(image.originalSize)}</span>
                      </div>
                      <div style={{ height: 10, background: "#201e1d" }} />
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                        <span style={{ opacity: 0.5 }}>Compressed</span>
                        <span>{formatBytes(image.compressedSize!)}</span>
                      </div>
                      <div style={{ height: 10, background: "#ec3013", width: `${Math.min(100, Math.round((image.compressedSize! / image.originalSize) * 100))}%`, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <button type="button" onClick={download} className="btn btn-primary">
                      Download Compressed Image <span className="btn-arrow">&darr;</span>
                    </button>
                    <button type="button" onClick={reset} className="btn">Compress another</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>
            How It Works
          </p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            Your image is drawn onto an HTML canvas, then re-encoded as a JPEG at the quality level you choose.
            Lower quality means smaller file size — drag the slider to find the right balance for your use case.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
