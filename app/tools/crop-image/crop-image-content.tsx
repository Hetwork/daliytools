"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

interface CropArea { x: number; y: number; width: number; height: number }
interface ImageData { file: File; url: string; naturalWidth: number; naturalHeight: number }

const RATIOS = [
  { label: "Free", value: 0 },
  { label: "1 : 1", value: 1 },
  { label: "16 : 9", value: 16 / 9 },
  { label: "9 : 16", value: 9 / 16 },
  { label: "4 : 3", value: 4 / 3 },
  { label: "3 : 4", value: 3 / 4 },
];

export default function CropImageContent() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 10, y: 10, width: 80, height: 80 });
  const [selectedRatio, setSelectedRatio] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDrop, setIsDrop] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  function handleFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (image) URL.revokeObjectURL(image.url);
      setImage({ file, url, naturalWidth: img.width, naturalHeight: img.height });
      setCropArea({ x: 10, y: 10, width: 80, height: 80 });
      setSelectedRatio(0);
    };
    img.src = url;
  }

  function handlePointerDown(e: React.PointerEvent<HTMLElement>, type: string) {
    e.preventDefault();
    e.stopPropagation();
    if (type === "move") setIsDragging(true);
    else setIsResizing(type);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    if (!containerRef.current || (!isDragging && !isResizing)) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.y) / rect.height) * 100;
    if (isDragging) {
      setCropArea((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(100 - prev.width, prev.x + dx)),
        y: Math.max(0, Math.min(100 - prev.height, prev.y + dy)),
      }));
    } else if (isResizing) {
      setCropArea((prev) => {
        let c = { ...prev };
        if (isResizing.includes("right")) c.width = Math.max(10, Math.min(100 - prev.x, prev.width + dx));
        if (isResizing.includes("left")) { const nw = Math.max(10, prev.width - dx); c.x = Math.max(0, prev.x + (prev.width - nw)); c.width = nw; }
        if (isResizing.includes("bottom")) c.height = Math.max(10, Math.min(100 - prev.y, prev.height + dy));
        if (isResizing.includes("top")) { const nh = Math.max(10, prev.height - dy); c.y = Math.max(0, prev.y + (prev.height - nh)); c.height = nh; }
        if (selectedRatio > 0) {
          if (isResizing.includes("right") || isResizing.includes("left")) c.height = c.width / selectedRatio;
          else c.width = c.height * selectedRatio;
        }
        return c;
      });
    }
    setDragStart({ x: e.clientX, y: e.clientY });
  }

  function handlePointerUp() { setIsDragging(false); setIsResizing(null); }

  function setRatio(ratio: number) {
    setSelectedRatio(ratio);
    if (ratio > 0) setCropArea((prev) => ({ ...prev, height: Math.min(100 - prev.y, prev.width / ratio) }));
  }

  function cropAndDownload() {
    if (!image || !imageRef.current || !canvasRef.current) return;
    const img = imageRef.current;
    const scaleX = image.naturalWidth / img.width;
    const scaleY = image.naturalHeight / img.height;
    const x = (cropArea.x / 100) * img.width * scaleX;
    const y = (cropArea.y / 100) * img.height * scaleY;
    const w = (cropArea.width / 100) * img.width * scaleX;
    const h = (cropArea.height / 100) * img.height * scaleY;
    const canvas = canvasRef.current;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cropped_${image.file.name}`;
      link.click();
      URL.revokeObjectURL(url);
    }, image.file.type || "image/png");
  }

  const handleDotStyle: React.CSSProperties = {
    width: 14,
    height: 14,
    background: "#f3f2f2",
    border: "2px solid #201e1d",
    position: "absolute",
  };

  return (
    <main
      className="noise"
      style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}
    >
      <SiteHeader active="Tools" />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <section
        style={{ maxWidth: 1000, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}
      >
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Image Tools / Crop Image
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Crop Image</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Drag the crop box, resize it from any handle, or pick a preset aspect ratio. Download the cropped result instantly.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          {!image && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
              onDrop={(e) => { e.preventDefault(); setIsDrop(false); handleFile(e.dataTransfer.files?.[0] ?? null); }}
              onDragOver={(e) => { e.preventDefault(); setIsDrop(true); }}
              onDragLeave={() => setIsDrop(false)}
              className="fade-in-up"
              style={{
                border: `2px dashed ${isDrop ? "#ec3013" : "#201e1d"}`,
                background: isDrop ? "rgba(236,48,19,0.05)" : "transparent",
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

          {image && (
            <div className="fade-in-up">
              {/* Aspect ratio */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Aspect Ratio</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {RATIOS.map((r) => (
                    <button
                      key={r.label}
                      type="button"
                      onClick={() => setRatio(r.value)}
                      style={{
                        padding: "8px 16px",
                        border: `2px solid ${selectedRatio === r.value ? "#ec3013" : "#201e1d"}`,
                        background: selectedRatio === r.value ? "#ec3013" : "transparent",
                        color: selectedRatio === r.value ? "#f3f2f2" : "#201e1d",
                        fontWeight: 700,
                        fontSize: 12,
                        fontFamily: "var(--font-archivo)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop editor */}
              <div
                ref={containerRef}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{ position: "relative", border: "2px solid #201e1d", background: "#201e1d", userSelect: "none", overflow: "hidden", touchAction: "none" }}
              >
                <img
                  ref={imageRef}
                  src={image.url}
                  alt="Crop source"
                  draggable={false}
                  style={{ display: "block", width: "100%", maxHeight: 560, objectFit: "contain", opacity: 0.4 }}
                />
                {/* Dark overlay over image except crop area — achieved by crop box shadow */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, "move")}
                  style={{
                    position: "absolute",
                    left: `${cropArea.x}%`,
                    top: `${cropArea.y}%`,
                    width: `${cropArea.width}%`,
                    height: `${cropArea.height}%`,
                    border: "2px solid #f3f2f2",
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                    cursor: "move",
                  }}
                >
                  {/* Grid thirds */}
                  <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr 1fr", pointerEvents: "none" }}>
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} style={{ border: "1px solid rgba(243,242,242,0.25)" }} />
                    ))}
                  </div>
                  {/* Resize handles */}
                  {[
                    { s: "top-left", top: -7, left: -7 },
                    { s: "top", top: -7, left: "calc(50% - 7px)" },
                    { s: "top-right", top: -7, right: -7 },
                    { s: "right", top: "calc(50% - 7px)", right: -7 },
                    { s: "bottom-right", bottom: -7, right: -7 },
                    { s: "bottom", bottom: -7, left: "calc(50% - 7px)" },
                    { s: "bottom-left", bottom: -7, left: -7 },
                    { s: "left", top: "calc(50% - 7px)", left: -7 },
                  ].map(({ s, ...pos }) => (
                    <div
                      key={s}
                      onPointerDown={(e) => handlePointerDown(e, s)}
                      style={{ ...handleDotStyle, ...pos, touchAction: "none" }}
                    />
                  ))}
                </div>
              </div>

              <p style={{ fontSize: 12, opacity: 0.4, marginTop: 8 }}>
                Crop: {Math.round(cropArea.width)}% × {Math.round(cropArea.height)}% — Drag to move, handles to resize
              </p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 20 }}>
                <button type="button" onClick={cropAndDownload} className="btn btn-primary">
                  Crop & Download <span className="btn-arrow">&darr;</span>
                </button>
                <button type="button" onClick={() => { if (image) URL.revokeObjectURL(image.url); setImage(null); }} className="btn">
                  Change image
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            The crop box is positioned as a percentage of the container. When you click "Crop & Download," those percentages are
            mapped back to the image&apos;s natural pixel dimensions using a canvas, and the selected region is exported at full resolution.
          </p>
        </div>
        <ToolEditorial toolName="Crop Image" {...toolEditorialData["crop-image"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
