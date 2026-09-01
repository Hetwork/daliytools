"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";

const MAX_SIZE = 30 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

type Mode = "custom" | "percentage" | "preset";
type Format = "image/jpeg" | "image/png" | "image/webp";

interface Preset {
  label: string;
  w: number;
  h: number;
}

const PRESETS: Preset[] = [
  { label: "HD 1280×720", w: 1280, h: 720 },
  { label: "Full HD 1920×1080", w: 1920, h: 1080 },
  { label: "2K 2560×1440", w: 2560, h: 1440 },
  { label: "4K 3840×2160", w: 3840, h: 2160 },
  { label: "Instagram 1080×1080", w: 1080, h: 1080 },
  { label: "Twitter 1200×675", w: 1200, h: 675 },
  { label: "Facebook Cover 851×315", w: 851, h: 315 },
  { label: "Thumbnail 320×180", w: 320, h: 180 },
];

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export default function ResizeImageContent() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);

  const [mode, setMode] = useState<Mode>("custom");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [percentage, setPercentage] = useState("100");
  const [preset, setPreset] = useState<Preset>(PRESETS[1]);
  const [lockAspect, setLockAspect] = useState(true);
  const [format, setFormat] = useState<Format>("image/png");
  const [quality, setQuality] = useState(92);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [outW, setOutW] = useState(0);
  const [outH, setOutH] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-fast").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleFile(f: File | null) {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setErrorMsg("Please choose a JPG, PNG, or WebP image.");
      setStatus("error");
      return;
    }
    if (f.size > MAX_SIZE) {
      setErrorMsg("Image must be under 30 MB.");
      setStatus("error");
      return;
    }
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
    };
    img.src = url;

    setFile(f);
    setOriginalUrl(url);
    setResultUrl(null);
    setStatus("idle");
    setErrorMsg("");
    setPercentage("100");
    setFormat(f.type === "image/jpeg" ? "image/jpeg" : f.type === "image/webp" ? "image/webp" : "image/png");
  }

  // Keep aspect ratio when width changes in custom mode
  function onWidthChange(val: string) {
    setWidth(val);
    if (lockAspect && origW > 0 && origH > 0) {
      const w = parseInt(val, 10);
      if (!isNaN(w) && w > 0) setHeight(String(Math.round((w / origW) * origH)));
    }
  }

  function onHeightChange(val: string) {
    setHeight(val);
    if (lockAspect && origW > 0 && origH > 0) {
      const h = parseInt(val, 10);
      if (!isNaN(h) && h > 0) setWidth(String(Math.round((h / origH) * origW)));
    }
  }

  function computeDimensions(): { w: number; h: number } | null {
    if (mode === "custom") {
      const w = parseInt(width, 10);
      const h = parseInt(height, 10);
      if (!w || !h || w < 1 || h < 1) return null;
      return { w: clamp(w, 1, 8000), h: clamp(h, 1, 8000) };
    }
    if (mode === "percentage") {
      const pct = parseFloat(percentage);
      if (!pct || pct <= 0) return null;
      return {
        w: Math.max(1, Math.round((origW * pct) / 100)),
        h: Math.max(1, Math.round((origH * pct) / 100)),
      };
    }
    return { w: preset.w, h: preset.h };
  }

  async function resize() {
    if (!file || !originalUrl) return;
    const dims = computeDimensions();
    if (!dims) { setErrorMsg("Enter valid dimensions."); return; }

    const img = new Image();
    img.src = originalUrl;
    await new Promise<void>((res) => { img.onload = () => res(); });

    const canvas = document.createElement("canvas");
    canvas.width = dims.w;
    canvas.height = dims.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) { setErrorMsg("Canvas not supported."); return; }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, dims.w, dims.h);
    }

    ctx.drawImage(img, 0, 0, dims.w, dims.h);

    canvas.toBlob(
      (blob) => {
        if (!blob) { setErrorMsg("Failed to export image."); setStatus("error"); return; }
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(URL.createObjectURL(blob));
        setResultSize(blob.size);
        setOutW(dims.w);
        setOutH(dims.h);
        setStatus("done");
      },
      format,
      format === "image/jpeg" ? quality / 100 : undefined
    );
  }

  function clearResult() {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultSize(0);
    setOutW(0);
    setOutH(0);
    setStatus("idle");
    setErrorMsg("");
  }

  function reset() {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setOrigW(0);
    setOrigH(0);
    setWidth("");
    setHeight("");
    setPercentage("100");
    setResultSize(0);
    setOutW(0);
    setOutH(0);
    setStatus("idle");
    setErrorMsg("");
  }

  const ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
  const downloadName = file ? file.name.replace(/\.[^.]+$/, "") + `_${outW}x${outH}.${ext}` : `resized.${ext}`;

  return (
    <main className="noise" style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}>
      <SiteHeader active="Tools" />

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}>
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Image Tools / Resize Image
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Resize Image</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Resize to exact pixel dimensions, a percentage, or a common preset. Your image never leaves this tab.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>

          {/* Drop zone */}
          {!file && status !== "error" && (
            <div
              role="button" tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0] ?? null); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              className="fade-in-up"
              style={{ border: `2px dashed ${isDragging ? "#ec3013" : "#201e1d"}`, background: isDragging ? "rgba(236,48,19,0.05)" : "transparent", padding: "clamp(48px, 8vw, 80px) 24px", textAlign: "center", transition: "border-color 0.25s, background 0.25s", cursor: "pointer" }}
            >
              <div style={{ width: 56, height: 56, border: "2px solid #201e1d", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" }}>IMG</div>
              <p style={{ fontSize: "clamp(17px, 2.2vw, 22px)", fontWeight: 700, marginBottom: 8 }}>Drag & drop your image here</p>
              <p style={{ fontSize: 14, opacity: 0.55 }}>or click to browse — JPG, PNG, WebP · up to 30 MB</p>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            </div>
          )}

          {/* Controls */}
          {file && originalUrl && status !== "done" && (
            <div className="fade-in-up">
              {/* Preview */}
              <div style={{ position: "relative", marginBottom: 28, textAlign: "center", background: "#e8e6e6", border: "2px solid #201e1d" }}>
                <img src={originalUrl} alt="Original" style={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain", display: "block", margin: "0 auto" }} />
                <div style={{ position: "absolute", bottom: 8, left: 8, background: "#201e1d", color: "#f3f2f2", fontSize: 10, fontWeight: 800, padding: "3px 8px", letterSpacing: "0.08em" }}>
                  {origW} × {origH} · {formatBytes(file.size)}
                </div>
              </div>

              {/* Mode tabs */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 12 }}>Resize by</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(["custom", "percentage", "preset"] as Mode[]).map((m) => (
                    <button key={m} type="button" onClick={() => setMode(m)}
                      style={{ padding: "9px 18px", border: `2px solid ${mode === m ? "#ec3013" : "#201e1d"}`, background: mode === m ? "#ec3013" : "transparent", color: mode === m ? "#f3f2f2" : "#201e1d", fontWeight: 700, fontSize: 13, textTransform: "capitalize", letterSpacing: "0.04em", fontFamily: "var(--font-archivo)", transition: "background 0.2s, border-color 0.2s, color 0.2s", cursor: "pointer" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom dimensions */}
              {mode === "custom" && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.5, display: "block", marginBottom: 6 }}>Width (px)</label>
                      <input type="number" min={1} max={8000} value={width} onChange={(e) => onWidthChange(e.target.value)}
                        style={{ width: 120, border: "2px solid #201e1d", background: "transparent", color: "#201e1d", fontFamily: "var(--font-archivo)", fontSize: 15, fontWeight: 600, padding: "10px 12px", outline: "none" }} />
                    </div>
                    <span style={{ fontSize: 20, opacity: 0.4, marginTop: 20 }}>×</span>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.5, display: "block", marginBottom: 6 }}>Height (px)</label>
                      <input type="number" min={1} max={8000} value={height} onChange={(e) => onHeightChange(e.target.value)}
                        style={{ width: 120, border: "2px solid #201e1d", background: "transparent", color: "#201e1d", fontFamily: "var(--font-archivo)", fontSize: 15, fontWeight: 600, padding: "10px 12px", outline: "none" }} />
                    </div>
                    <div style={{ marginTop: 22 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                        <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#ec3013" }} />
                        <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>Lock aspect ratio</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Percentage */}
              {mode === "percentage" && (
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.5, display: "block", marginBottom: 6 }}>Scale (%)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <input type="number" min={1} max={400} value={percentage} onChange={(e) => setPercentage(e.target.value)}
                      style={{ width: 100, border: "2px solid #201e1d", background: "transparent", color: "#201e1d", fontFamily: "var(--font-archivo)", fontSize: 15, fontWeight: 600, padding: "10px 12px", outline: "none" }} />
                    {origW > 0 && (
                      <span style={{ fontSize: 13, opacity: 0.5 }}>
                        → {Math.round(origW * parseFloat(percentage || "0") / 100)} × {Math.round(origH * parseFloat(percentage || "0") / 100)} px
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {[25, 50, 75, 150, 200].map((p) => (
                      <button key={p} type="button" onClick={() => setPercentage(String(p))}
                        style={{ padding: "6px 12px", border: `1px solid ${percentage === String(p) ? "#ec3013" : "#201e1d"}`, background: percentage === String(p) ? "#ec3013" : "transparent", color: percentage === String(p) ? "#f3f2f2" : "#201e1d", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-archivo)", cursor: "pointer" }}>
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preset */}
              {mode === "preset" && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.5, marginBottom: 10 }}>Select preset</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {PRESETS.map((p) => (
                      <label key={p.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", border: `2px solid ${preset.label === p.label ? "#201e1d" : "#c8c6c4"}`, background: preset.label === p.label ? "#201e1d" : "transparent", color: preset.label === p.label ? "#f3f2f2" : "#201e1d", cursor: "pointer", fontFamily: "var(--font-archivo)" }}>
                        <input type="radio" name="preset" checked={preset.label === p.label} onChange={() => setPreset(p)} style={{ display: "none" }} />
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{p.label}</span>
                        <span style={{ fontSize: 12, opacity: 0.5, marginLeft: "auto" }}>{p.w} × {p.h}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Output format */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 12 }}>Output format</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {([["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]] as [Format, string][]).map(([val, label]) => (
                    <button key={val} type="button" onClick={() => setFormat(val)}
                      style={{ padding: "9px 18px", border: `2px solid ${format === val ? "#201e1d" : "#c8c6c4"}`, background: format === val ? "#201e1d" : "transparent", color: format === val ? "#f3f2f2" : "#201e1d", fontWeight: 700, fontSize: 13, fontFamily: "var(--font-archivo)", transition: "background 0.2s, border-color 0.2s, color 0.2s", cursor: "pointer" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality slider for JPG/WebP */}
              {(format === "image/jpeg" || format === "image/webp") && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Quality — {quality}%</p>
                  <input type="range" min={10} max={100} step={1} value={quality} onChange={(e) => setQuality(Number(e.target.value))}
                    style={{ width: "100%", maxWidth: 320, accentColor: "#ec3013" }} />
                </div>
              )}

              {errorMsg && <p style={{ fontSize: 13, color: "#ec3013", fontWeight: 600, marginBottom: 16 }}>{errorMsg}</p>}

              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <button type="button" onClick={resize} className="btn btn-primary">Resize Image</button>
                <button type="button" onClick={reset} className="ink-hover" style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.5, fontFamily: "inherit", cursor: "pointer" }}>Choose another</button>
              </div>
            </div>
          )}

          {/* Result */}
          {status === "done" && resultUrl && (
            <div className="fade-in-up">
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
                {/* Original */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.4, marginBottom: 8 }}>Original</p>
                  <div style={{ background: "#e8e6e6", border: "2px solid #201e1d", display: "flex", alignItems: "center", justifyContent: "center", height: 180 }}>
                    {originalUrl && <img src={originalUrl} alt="Original" style={{ maxWidth: "100%", maxHeight: 176, objectFit: "contain", display: "block" }} />}
                  </div>
                  <p style={{ fontSize: 12, opacity: 0.5, marginTop: 6 }}>{origW} × {origH} · {file ? formatBytes(file.size) : ""}</p>
                </div>
                {/* Result */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.4, marginBottom: 8 }}>Resized</p>
                  <div style={{ background: "#e8e6e6", border: "2px solid #ec3013", display: "flex", alignItems: "center", justifyContent: "center", height: 180 }}>
                    <img src={resultUrl} alt="Resized" style={{ maxWidth: "100%", maxHeight: 176, objectFit: "contain", display: "block" }} />
                  </div>
                  <p style={{ fontSize: 12, opacity: 0.5, marginTop: 6 }}>{outW} × {outH} · {formatBytes(resultSize)}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a href={resultUrl} download={downloadName} className="btn btn-primary">
                  Download {ext.toUpperCase()} <span className="btn-arrow">&darr;</span>
                </a>
                <button type="button" onClick={clearResult} className="btn">Resize again</button>
                <button type="button" onClick={reset} className="ink-hover" style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.5, fontFamily: "inherit", cursor: "pointer" }}>New image</button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="fade-in-up" style={{ borderLeft: "4px solid #ec3013", paddingLeft: 24 }}>
              <p style={{ fontWeight: 700, fontSize: "clamp(17px, 2vw, 20px)", marginBottom: 8 }}>Something went wrong</p>
              <p style={{ opacity: 0.7, fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>{errorMsg}</p>
              <button type="button" onClick={reset} className="btn">Try again</button>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            Your image is drawn onto an HTML canvas at the target dimensions using high-quality bicubic-style smoothing, then exported in your chosen format. Everything happens locally — nothing is uploaded.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
