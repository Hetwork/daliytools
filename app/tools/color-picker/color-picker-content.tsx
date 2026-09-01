"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

interface ColorData { hex: string; rgb: string; hsl: string }

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

export default function ColorPickerContent() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<ColorData | null>(null);
  const [hovered, setHovered] = useState<ColorData | null>(null);
  const [history, setHistory] = useState<ColorData[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
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
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setSelected(null);
    setHovered(null);
  }

  function pickColorAt(e: React.MouseEvent<HTMLImageElement>) {
    if (!imgRef.current || !canvasRef.current) return;
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * img.naturalWidth);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * img.naturalHeight);
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    canvasRef.current.width = img.naturalWidth;
    canvasRef.current.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(r, g, b);
    return { hex, rgb: `rgb(${r}, ${g}, ${b})`, hsl: hexToHsl(hex) };
  }

  function onMouseMove(e: React.MouseEvent<HTMLImageElement>) {
    const color = pickColorAt(e);
    if (color) setHovered(color);
  }

  function onMouseLeave() { setHovered(null); }

  function onClick(e: React.MouseEvent<HTMLImageElement>) {
    const color = pickColorAt(e);
    if (!color) return;
    setSelected(color);
    setHistory((prev) => [color, ...prev.filter((c) => c.hex !== color.hex)].slice(0, 12));
  }

  function copyValue(value: string, key: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  }

  const display = hovered ?? selected;

  return (
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
      <SiteHeader active="Tools" />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: "clamp(32px, 6vw, 64px)",
          paddingBottom: "clamp(48px, 8vw, 96px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Image Tools / Color Picker
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Color Picker</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Upload any image, then hover to preview colors and click to capture them. Get HEX, RGB, and HSL values instantly.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          {!imageUrl && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
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
              <div style={{ width: 56, height: 56, border: "2px solid #201e1d", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>
                IMG
              </div>
              <p style={{ fontSize: "clamp(17px, 2.2vw, 22px)", fontWeight: 700, marginBottom: 8 }}>Drag & drop your image here</p>
              <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", opacity: 0.55 }}>or click to browse</p>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            </div>
          )}

          {imageUrl && (
            <div className="fade-in-up">
              {/* Color display bar */}
              <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ width: 56, height: 56, border: "2px solid #201e1d", background: display?.hex ?? "#f3f2f2", flexShrink: 0, transition: "background 0.1s" }} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  {display ? (
                    <>
                      {(["hex", "rgb", "hsl"] as const).map((key) => (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ width: 36, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45 }}>{key}</span>
                          <span style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 600 }}>{display[key]}</span>
                          <button
                            type="button"
                            onClick={() => copyValue(display[key], key)}
                            style={{ border: "none", background: "none", fontSize: 11, fontWeight: 700, opacity: 0.45, fontFamily: "inherit", textTransform: "uppercase", letterSpacing: "0.06em" }}
                          >
                            {copiedKey === key ? "✓" : "Copy"}
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p style={{ fontSize: 14, opacity: 0.45 }}>Hover over the image to preview colors. Click to capture.</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { if (imageUrl) URL.revokeObjectURL(imageUrl); setImageUrl(null); setSelected(null); setHovered(null); setHistory([]); }}
                  className="ink-hover"
                  style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.45, fontFamily: "inherit" }}
                >
                  Remove
                </button>
              </div>

              {/* Image */}
              <div style={{ border: "2px solid #201e1d", overflow: "hidden", position: "relative" }}>
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Color picker source"
                  onMouseMove={onMouseMove}
                  onMouseLeave={onMouseLeave}
                  onClick={onClick}
                  style={{ display: "block", width: "100%", maxHeight: 500, objectFit: "contain", cursor: "crosshair", userSelect: "none" }}
                  draggable={false}
                />
              </div>

              {/* History */}
              {history.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, marginBottom: 10 }}>Picked Colors</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {history.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        title={c.hex}
                        onClick={() => copyValue(c.hex, `hist-${c.hex}`)}
                        style={{
                          width: 36,
                          height: 36,
                          border: `2px solid ${selected?.hex === c.hex ? "#ec3013" : "#201e1d"}`,
                          background: c.hex,
                          position: "relative",
                        }}
                      />
                    ))}
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
            When you hover over the image, your pointer coordinates are mapped to the image&apos;s natural pixel grid using a hidden canvas.
            The canvas reads the pixel at that position and converts the RGB values to HEX and HSL. Nothing leaves your browser.
          </p>
        </div>
        <ToolEditorial toolName="Color Picker" {...toolEditorialData["color-picker"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
