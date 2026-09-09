"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolAdRail from "../../_components/tool-ad-rail";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

interface ImageFile { id: string; file: File; preview: string }

type PageSize = "a4" | "letter" | "legal";
type Orientation = "portrait" | "landscape";

const PAGE_SIZES: Record<PageSize, { label: string; w: number; h: number }> = {
  a4: { label: "A4", w: 595.28, h: 841.89 },
  letter: { label: "Letter", w: 612, h: 792 },
  legal: { label: "Legal", w: 612, h: 1008 },
};

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function ImageToPdfContent() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [dragOver, setDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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
    return () => images.forEach((img) => URL.revokeObjectURL(img.preview));
  }, []);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const newImages: ImageFile[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      newImages.push({ id: `${Date.now()}-${Math.random()}`, file, preview: URL.createObjectURL(file) });
    });
    setImages((prev) => [...prev, ...newImages]);
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  }

  function moveImage(from: number, to: number) {
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  async function generatePdf() {
    if (images.length === 0) return;
    setIsGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const ps = PAGE_SIZES[pageSize];
      const pw = orientation === "portrait" ? ps.w : ps.h;
      const ph = orientation === "portrait" ? ps.h : ps.w;
      const pdf = new jsPDF({ orientation, unit: "pt", format: [pw, ph] });

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage([pw, ph], orientation);
        const img = images[i];
        await new Promise<void>((res) => {
          const image = new Image();
          image.onload = () => {
            const margin = 20;
            const maxW = pw - margin * 2;
            const maxH = ph - margin * 2;
            const ratio = Math.min(maxW / image.width, maxH / image.height);
            const w = image.width * ratio;
            const h = image.height * ratio;
            const x = (pw - w) / 2;
            const y = (ph - h) / 2;
            pdf.addImage(image, "JPEG", x, y, w, h);
            res();
          };
          image.src = img.preview;
        });
      }

      pdf.save(`images-${Date.now()}.pdf`);
    } finally {
      setIsGenerating(false);
    }
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
          <Link href="/tools" className="ink-hover">All Tools</Link> / PDF Tools / Image to PDF
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Image to PDF</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Upload one or more images and convert them into a single PDF. Drag to reorder pages before generating.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className="fade-in-up"
            style={{
              border: `2px dashed ${dragOver ? "#ec3013" : "#201e1d"}`,
              background: dragOver ? "rgba(236,48,19,0.05)" : "transparent",
              padding: "clamp(32px, 5vw, 48px) 24px",
              textAlign: "center",
              transition: "border-color 0.25s ease, background 0.25s ease",
              marginBottom: images.length > 0 ? 24 : 0,
            }}
          >
            <div style={{ width: 56, height: 56, border: "2px solid #201e1d", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>IMG</div>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              {images.length > 0 ? "Add more images" : "Drag & drop images here"}
            </p>
            <p style={{ fontSize: 14, opacity: 0.55 }}>or click to browse — JPG, PNG, WebP</p>
            <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
          </div>

          {images.length > 0 && (
            <div className="fade-in-up">
              {/* Page settings */}
              <div style={{ border: "2px solid #201e1d", padding: "clamp(20px, 3vw, 28px)", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Page Size</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      {(["a4", "letter", "legal"] as PageSize[]).map((s) => (
                        <button key={s} type="button" onClick={() => setPageSize(s)}
                          style={{
                            padding: "8px 16px",
                            border: `2px solid ${pageSize === s ? "#ec3013" : "#201e1d"}`,
                            background: pageSize === s ? "#ec3013" : "transparent",
                            color: pageSize === s ? "#f3f2f2" : "#201e1d",
                            fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em",
                            fontFamily: "var(--font-archivo)", transition: "all 0.2s ease",
                          }}
                        >{PAGE_SIZES[s].label}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Orientation</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      {(["portrait", "landscape"] as Orientation[]).map((o) => (
                        <button key={o} type="button" onClick={() => setOrientation(o)}
                          style={{
                            padding: "8px 16px",
                            border: `2px solid ${orientation === o ? "#ec3013" : "#201e1d"}`,
                            background: orientation === o ? "#ec3013" : "transparent",
                            color: orientation === o ? "#f3f2f2" : "#201e1d",
                            fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em",
                            fontFamily: "var(--font-archivo)", transition: "all 0.2s ease",
                          }}
                        >{o === "portrait" ? "Portrait" : "Landscape"}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image list */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={() => setDraggedIndex(i)}
                    onDragOver={(e) => { e.preventDefault(); if (draggedIndex !== null && draggedIndex !== i) moveImage(draggedIndex, i); setDraggedIndex(i); }}
                    onDragEnd={() => setDraggedIndex(null)}
                    style={{ border: "2px solid #201e1d", position: "relative", aspectRatio: "1", overflow: "hidden", cursor: "grab" }}
                  >
                    <img src={img.preview} alt={img.file.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", top: 4, left: 6, background: "#201e1d", color: "#f3f2f2", fontSize: 10, fontWeight: 800, padding: "2px 6px" }}>{i + 1}</div>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, background: "#ec3013", border: "none", color: "#f3f2f2", fontWeight: 800, fontSize: 14, lineHeight: 1, cursor: "pointer" }}
                    >×</button>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 12, opacity: 0.4, marginBottom: 20 }}>Drag thumbnails to reorder pages · {images.length} image{images.length !== 1 ? "s" : ""}</p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button type="button" onClick={generatePdf} disabled={isGenerating} className="btn btn-primary">
                  {isGenerating ? "Generating PDF…" : `Generate PDF (${images.length} page${images.length !== 1 ? "s" : ""})`}
                  {!isGenerating && <span className="btn-arrow">&darr;</span>}
                </button>
                <button type="button" onClick={() => { images.forEach((i) => URL.revokeObjectURL(i.preview)); setImages([]); }} className="btn">Clear all</button>
              </div>
            </div>
          )}
        </div>

        <ToolEditorial
          toolName="Image to PDF"
          {...toolEditorialData["image-to-pdf"]}
        />
      </section>

              <ToolAdRail />
      </div>

      <SiteFooter />
    </main>
  );
}
