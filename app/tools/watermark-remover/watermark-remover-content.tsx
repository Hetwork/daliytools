"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

interface ImageData { file: File; url: string }
interface Selection { startX: number; startY: number; width: number; height: number }
type Method = "blur" | "fill" | "clone";

export default function WatermarkRemoverContent() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [processed, setProcessed] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [tempSel, setTempSel] = useState<Selection | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [method, setMethod] = useState<Method>("blur");
  const [intensity, setIntensity] = useState(15);
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
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
    if (image) URL.revokeObjectURL(image.url);
    setImage({ file, url: URL.createObjectURL(file) });
    setProcessed(null);
    setSelection(null);
    setTempSel(null);
  }

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    setIsSelecting(true);
    setTempSel({ startX: ((e.clientX - rect.left) / rect.width) * 100, startY: ((e.clientY - rect.top) / rect.height) * 100, width: 0, height: 0 });
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isSelecting || !tempSel || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    setTempSel({ ...tempSel, width: ((e.clientX - rect.left) / rect.width) * 100 - tempSel.startX, height: ((e.clientY - rect.top) / rect.height) * 100 - tempSel.startY });
  }

  function onMouseUp() {
    if (tempSel && Math.abs(tempSel.width) > 2 && Math.abs(tempSel.height) > 2) {
      setSelection({
        startX: tempSel.width < 0 ? tempSel.startX + tempSel.width : tempSel.startX,
        startY: tempSel.height < 0 ? tempSel.startY + tempSel.height : tempSel.startY,
        width: Math.abs(tempSel.width),
        height: Math.abs(tempSel.height),
      });
    }
    setIsSelecting(false);
    setTempSel(null);
  }

  async function removeWatermark() {
    if (!image || !selection || !imageRef.current || !canvasRef.current) return;
    setIsProcessing(true);
    try {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      const x = Math.floor((selection.startX / 100) * canvas.width);
      const y = Math.floor((selection.startY / 100) * canvas.height);
      const w = Math.floor((selection.width / 100) * canvas.width);
      const h = Math.floor((selection.height / 100) * canvas.height);

      if (method === "blur") {
        const imageData = ctx.getImageData(x, y, w, h);
        const px = imageData.data;
        const orig = new Uint8ClampedArray(px);
        const r = intensity;
        for (let py = 0; py < h; py++) {
          for (let qx = 0; qx < w; qx++) {
            let rr = 0, gr = 0, br = 0, cnt = 0;
            for (let ky = -r; ky <= r; ky++) {
              for (let kx = -r; kx <= r; kx++) {
                const ny = py + ky, nx = qx + kx;
                if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
                  const idx = (ny * w + nx) * 4;
                  rr += orig[idx]; gr += orig[idx + 1]; br += orig[idx + 2]; cnt++;
                }
              }
            }
            const idx = (py * w + qx) * 4;
            px[idx] = rr / cnt; px[idx + 1] = gr / cnt; px[idx + 2] = br / cnt;
          }
        }
        ctx.putImageData(imageData, x, y);
      } else if (method === "fill") {
        const border = ctx.getImageData(Math.max(0, x - 5), Math.max(0, y - 5), w + 10, h + 10);
        const bp = border.data;
        const bw = w + 10;
        let rr = 0, gr = 0, br = 0, cnt = 0;
        for (let i = 0; i < w; i++) {
          const ti = (5 * bw + (i + 5)) * 4;
          const bi = ((h + 5) * bw + (i + 5)) * 4;
          rr += bp[ti] + bp[bi]; gr += bp[ti + 1] + bp[bi + 1]; br += bp[ti + 2] + bp[bi + 2]; cnt += 2;
        }
        ctx.fillStyle = `rgb(${rr / cnt},${gr / cnt},${br / cnt})`;
        ctx.fillRect(x, y, w, h);
      } else {
        const srcY = Math.max(0, y - h - 10);
        const srcData = ctx.getImageData(x, srcY, w, h);
        ctx.putImageData(srcData, x, y);
      }
      setProcessed(canvas.toDataURL("image/png"));
    } finally {
      setIsProcessing(false);
    }
  }

  function download() {
    if (!processed) return;
    const link = document.createElement("a");
    link.href = processed;
    link.download = `no_watermark_${image?.file.name ?? "image.png"}`;
    link.click();
  }

  const currentSel = tempSel ?? selection;

  return (
    <main
      className="noise"
      style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}
    >
      <SiteHeader active="Tools" />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}
      >
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Image Tools / Watermark Remover
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Watermark Remover</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Upload an image, draw a selection over the watermark, pick a removal method, and download the result. Nothing uploaded.
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
              {/* Settings */}
              <div style={{ border: "2px solid #201e1d", padding: "clamp(20px, 3vw, 28px)", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Removal Method</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {(["blur", "fill", "clone"] as Method[]).map((m) => (
                        <button key={m} type="button" onClick={() => setMethod(m)}
                          style={{
                            padding: "8px 16px", border: `2px solid ${method === m ? "#ec3013" : "#201e1d"}`,
                            background: method === m ? "#ec3013" : "transparent", color: method === m ? "#f3f2f2" : "#201e1d",
                            fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em",
                            fontFamily: "var(--font-archivo)", transition: "all 0.2s ease",
                          }}
                        >{m === "blur" ? "Blur" : m === "fill" ? "Fill" : "Clone"}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45 }}>Intensity</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#ec3013" }}>{intensity}</p>
                    </div>
                    <input type="range" min={5} max={30} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} style={{ width: "100%", accentColor: "#ec3013" }} />
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={removeWatermark}
                      disabled={!selection || isProcessing}
                      className="btn btn-primary"
                      style={{ opacity: !selection || isProcessing ? 0.5 : 1 }}
                    >
                      {isProcessing ? "Processing…" : "Remove"}
                    </button>
                    <button type="button" onClick={() => { if (image) URL.revokeObjectURL(image.url); setImage(null); setProcessed(null); setSelection(null); }} className="btn">
                      Change image
                    </button>
                  </div>
                </div>
              </div>

              {/* Side-by-side editor */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 8 }}>
                    Original {!selection && "— click and drag to select watermark"}
                  </p>
                  <div
                    style={{ border: "2px solid #201e1d", position: "relative", cursor: "crosshair", userSelect: "none" }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                  >
                    <img ref={imageRef} src={image.url} alt="Original" draggable={false} style={{ display: "block", width: "100%", maxHeight: 500, objectFit: "contain" }} />
                    {currentSel && (
                      <div
                        style={{
                          position: "absolute",
                          left: `${currentSel.startX}%`,
                          top: `${currentSel.startY}%`,
                          width: `${Math.abs(currentSel.width)}%`,
                          height: `${Math.abs(currentSel.height)}%`,
                          border: "2px solid #ec3013",
                          background: "rgba(236,48,19,0.15)",
                        }}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 8 }}>
                    Result {processed && <span style={{ color: "#ec3013" }}>— ready to download</span>}
                  </p>
                  <div style={{ border: "2px solid #201e1d", minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
                    {processed ? (
                      <img src={processed} alt="Processed" style={{ display: "block", width: "100%", maxHeight: 500, objectFit: "contain" }} />
                    ) : (
                      <p style={{ opacity: 0.35, fontSize: 13, padding: 32, textAlign: "center" }}>
                        {isProcessing ? "Processing…" : "Select area on the left then click Remove"}
                      </p>
                    )}
                  </div>
                  {processed && (
                    <button type="button" onClick={download} className="btn btn-primary" style={{ marginTop: 12 }}>
                      Download <span className="btn-arrow">&darr;</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            <strong>Blur</strong> averages surrounding pixels to soften the selected area.
            <strong> Fill</strong> samples border colors and floods the region.
            <strong> Clone</strong> copies the region above the selection.
            All processing runs locally on a canvas — your image never leaves your browser.
          </p>
        </div>
        <ToolEditorial toolName="Watermark Remover" {...toolEditorialData["watermark-remover"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
