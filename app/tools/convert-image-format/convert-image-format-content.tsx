"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolAdRail from "../../_components/tool-ad-rail";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

const FORMATS = [
  { value: "image/jpeg", label: "JPEG", ext: "jpg", note: "Best for photos" },
  { value: "image/png", label: "PNG", ext: "png", note: "Lossless, transparency" },
  { value: "image/webp", label: "WebP", ext: "webp", note: "Modern, smaller size" },
  { value: "image/avif", label: "AVIF", ext: "avif", note: "Next-gen, best compression" },
];

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export default function ConvertImageFormatContent() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number | null>(null);
  const [targetFormat, setTargetFormat] = useState(FORMATS[1]);
  const [isConverting, setIsConverting] = useState(false);
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
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    };
  }, []);

  function handleFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setOriginalUrl(URL.createObjectURL(file));
    setOriginalFile(file);
    setConvertedUrl(null);
    setConvertedSize(null);
  }

  async function convert() {
    if (!originalFile || !originalUrl) return;
    setIsConverting(true);
    try {
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = rej;
        img.src = originalUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      await new Promise<void>((res) => {
        canvas.toBlob((blob) => {
          if (!blob) return res();
          if (convertedUrl) URL.revokeObjectURL(convertedUrl);
          setConvertedUrl(URL.createObjectURL(blob));
          setConvertedSize(blob.size);
          res();
        }, targetFormat.value, 0.92);
      });
    } finally {
      setIsConverting(false);
    }
  }

  function download() {
    if (!convertedUrl || !originalFile) return;
    const link = document.createElement("a");
    link.href = convertedUrl;
    link.download = `${originalFile.name.replace(/\.[^/.]+$/, "")}.${targetFormat.ext}`;
    link.click();
  }

  function reset() {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setOriginalUrl(null);
    setOriginalFile(null);
    setConvertedUrl(null);
    setConvertedSize(null);
  }

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
          <Link href="/tools" className="ink-hover">All Tools</Link> / Image Tools / Convert Image Format
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Convert Image Format</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Switch between JPEG, PNG, WebP, and AVIF in seconds. No uploads — everything stays in your browser.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          {!originalFile && (
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
              <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", opacity: 0.55 }}>or click to browse</p>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            </div>
          )}

          {originalFile && (
            <div className="fade-in-up">
              {/* File info */}
              <div style={{ border: "2px solid #201e1d", padding: "clamp(20px, 3vw, 28px)", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, border: "2px solid #201e1d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>IMG</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 16, wordBreak: "break-all" }}>{originalFile.name}</p>
                    <p style={{ opacity: 0.5, fontSize: 13, marginTop: 2 }}>{formatBytes(originalFile.size)}</p>
                  </div>
                  <button type="button" onClick={reset} className="ink-hover" style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.45, fontFamily: "inherit" }}>Remove</button>
                </div>

                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Convert to</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                  {FORMATS.map((fmt) => (
                    <button
                      key={fmt.value}
                      type="button"
                      onClick={() => { setTargetFormat(fmt); setConvertedUrl(null); setConvertedSize(null); }}
                      style={{
                        padding: "10px 18px",
                        border: `2px solid ${targetFormat.value === fmt.value ? "#ec3013" : "#201e1d"}`,
                        background: targetFormat.value === fmt.value ? "#ec3013" : "transparent",
                        color: targetFormat.value === fmt.value ? "#f3f2f2" : "#201e1d",
                        fontWeight: 700,
                        fontSize: 13,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        fontFamily: "var(--font-archivo)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 13, opacity: 0.5 }}>{targetFormat.note}</p>

                <div style={{ marginTop: 20 }}>
                  <button type="button" onClick={convert} disabled={isConverting} className="btn btn-primary">
                    {isConverting ? "Converting…" : `Convert to ${targetFormat.label}`}
                  </button>
                </div>
              </div>

              {convertedUrl && convertedSize !== null && (
                <div style={{ border: "2px solid #201e1d", padding: "clamp(20px, 3vw, 28px)" }}>
                  <p style={{ fontSize: "clamp(11px, 1.3vw, 13px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.45, marginBottom: 16 }}>Done</p>
                  <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 20 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Original</p>
                      <p style={{ fontSize: 18, fontWeight: 800 }}>{formatBytes(originalFile.size)}</p>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, opacity: 0.3, alignSelf: "center" }}>→</div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{targetFormat.label}</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: "#ec3013" }}>{formatBytes(convertedSize)}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <button type="button" onClick={download} className="btn btn-primary">
                      Download {targetFormat.label} <span className="btn-arrow">&darr;</span>
                    </button>
                    <button type="button" onClick={() => { setConvertedUrl(null); setConvertedSize(null); }} className="btn">Convert to another format</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            Your image is drawn onto a canvas and re-encoded using the browser&apos;s built-in codec for the chosen format.
            All processing is client-side — nothing is uploaded. AVIF and WebP produce the smallest files; PNG preserves transparency.
          </p>
        </div>
        <ToolEditorial toolName="Convert Image Format" {...toolEditorialData["convert-image-format"]} />
      </section>

              <ToolAdRail />
      </div>

      <SiteFooter />
    </main>
  );
}
