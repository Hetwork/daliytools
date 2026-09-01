"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";

const MAX_SIZE = 50 * 1024 * 1024;

type Status = "idle" | "compressing" | "done" | "error";
type Quality = "high" | "balanced" | "low";

const QUALITY_PRESETS: Record<
  Quality,
  { label: string; dpi: number; jpegQuality: number; hint: string }
> = {
  high: {
    label: "High",
    dpi: 200,
    jpegQuality: 0.85,
    hint: "Best fidelity, moderate size savings. Good for documents you'll print or zoom into.",
  },
  balanced: {
    label: "Balanced",
    dpi: 150,
    jpegQuality: 0.72,
    hint: "Good quality with solid size savings. Recommended for most files.",
  },
  low: {
    label: "Low",
    dpi: 100,
    jpegQuality: 0.5,
    hint: "Smallest file size. Text and images will look noticeably softer.",
  },
};

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024))
  );
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function canvasToJpegBytes(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to encode page as an image."));
          return;
        }
        blob
          .arrayBuffer()
          .then((buf) => resolve(new Uint8Array(buf)))
          .catch(reject);
      },
      "image/jpeg",
      quality
    );
  });
}

export default function CompressPdfContent() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [quality, setQuality] = useState<Quality>("balanced");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [animatedPercent, setAnimatedPercent] = useState(0);
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
    document
      .querySelectorAll(".reveal, .reveal-fast")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  useEffect(() => {
    if (status !== "done" || originalSize === 0) return;
    const reduction = Math.max(
      0,
      Math.round(((originalSize - compressedSize) / originalSize) * 100)
    );
    const duration = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(Math.round(eased * reduction));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, originalSize, compressedSize]);

  function resetAll() {
    setFile(null);
    setStatus("idle");
    setProgress({ current: 0, total: 0 });
    setOriginalSize(0);
    setCompressedSize(0);
    setDownloadUrl(null);
    setDownloadName("");
    setErrorMsg("");
    setAnimatedPercent(0);
  }

  function handleFile(selected: File | null) {
    if (!selected) return;
    const isPdf =
      selected.type === "application/pdf" ||
      selected.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setErrorMsg("That doesn't look like a PDF. Please choose a .pdf file.");
      setStatus("error");
      return;
    }
    if (selected.size > MAX_SIZE) {
      setErrorMsg(
        "That file is larger than 50MB. We only support smaller PDFs for now."
      );
      setStatus("error");
      return;
    }
    setFile(selected);
    setOriginalSize(selected.size);
    setStatus("idle");
    setErrorMsg("");
  }

  async function compress() {
    if (!file) return;
    setStatus("compressing");
    setProgress({ current: 0, total: 0 });
    await new Promise((resolve) =>
      requestAnimationFrame(() => setTimeout(resolve, 30))
    );

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      const { PDFDocument } = await import("pdf-lib");

      const sourceBytes = await file.arrayBuffer();
      const sourceDoc = await pdfjsLib.getDocument({
        data: sourceBytes,
        standardFontDataUrl: "/pdfjs/standard_fonts/",
        cMapUrl: "/pdfjs/cmaps/",
        cMapPacked: true,
      }).promise;
      const totalPages = sourceDoc.numPages;
      setProgress({ current: 0, total: totalPages });

      const preset = QUALITY_PRESETS[quality];
      const scale = preset.dpi / 72;

      const outDoc = await PDFDocument.create();
      outDoc.setTitle("");
      outDoc.setAuthor("");
      outDoc.setSubject("");
      outDoc.setKeywords([]);
      outDoc.setProducer("");
      outDoc.setCreator("");

      for (let i = 1; i <= totalPages; i++) {
        const page = await sourceDoc.getPage(i);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("This browser doesn't support canvas rendering.");
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const jpegBytes = await canvasToJpegBytes(canvas, preset.jpegQuality);

        const jpgImage = await outDoc.embedJpg(jpegBytes);
        const outPage = outDoc.addPage([
          baseViewport.width,
          baseViewport.height,
        ]);
        outPage.drawImage(jpgImage, {
          x: 0,
          y: 0,
          width: baseViewport.width,
          height: baseViewport.height,
        });

        canvas.width = 0;
        canvas.height = 0;
        setProgress({ current: i, total: totalPages });
        await new Promise((resolve) =>
          requestAnimationFrame(() => setTimeout(resolve, 0))
        );
      }

      const compressedBytes = await outDoc.save({ useObjectStreams: true });
      const blob = new Blob([new Uint8Array(compressedBytes)], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);

      setCompressedSize(compressedBytes.byteLength);
      setDownloadUrl(url);
      setDownloadName(file.name.replace(/\.pdf$/i, "") + "-compressed.pdf");
      setStatus("done");
    } catch {
      setErrorMsg(
        "We couldn't process that PDF. It may be corrupted or password-protected."
      );
      setStatus("error");
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  const showDropzone = !file && status !== "error";
  const compressionPct =
    originalSize > 0
      ? Math.min(100, Math.round((compressedSize / originalSize) * 100))
      : 0;
  const progressPct =
    progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

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
        {/* breadcrumb */}
        <p
          className="reveal-fast"
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: 0.45,
            marginBottom: 28,
          }}
        >
          <Link href="/tools" className="ink-hover">
            All Tools
          </Link>{" "}
          / PDF Tools / Compress PDF
        </p>

        {/* header */}
        <div className="reveal">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: "clamp(11px, 1.4vw, 13px)",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#f3f2f2",
                background: "#ec3013",
                padding: "6px 14px",
                textTransform: "uppercase",
              }}
            >
              Live
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "clamp(11px, 1.4vw, 13px)",
                fontWeight: 500,
                opacity: 0.5,
              }}
            >
              Runs entirely in your browser
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 6vw, 60px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Compress PDF
          </h1>
          <p
            style={{
              marginTop: 18,
              fontSize: "clamp(15px, 1.8vw, 19px)",
              lineHeight: 1.7,
              opacity: 0.7,
              maxWidth: 560,
            }}
          >
            Shrink your PDF&apos;s file size — great for scans and
            image-heavy documents. Nothing is uploaded, your file never
            leaves this browser tab.
          </p>
        </div>

        {/* tool body */}
        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          {showDropzone && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className="fade-in-up"
              style={{
                border: `2px dashed ${isDragging ? "#ec3013" : "#201e1d"}`,
                background: isDragging ? "rgba(236,48,19,0.05)" : "transparent",
                padding: "clamp(48px, 8vw, 80px) 24px",
                textAlign: "center",
                transition: "border-color 0.25s ease, background 0.25s ease",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  border: "2px solid #201e1d",
                  margin: "0 auto 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                PDF
              </div>
              <p
                style={{
                  fontSize: "clamp(17px, 2.2vw, 22px)",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Drag & drop your PDF here
              </p>
              <p
                style={{
                  fontSize: "clamp(13px, 1.5vw, 15px)",
                  opacity: 0.55,
                }}
              >
                or click to browse — up to 50MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          {file && (status === "idle" || status === "compressing") && (
            <div
              className="fade-in-up"
              style={{
                border: "2px solid #201e1d",
                padding: "clamp(24px, 4vw, 32px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    border: "2px solid #201e1d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  PDF
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "clamp(15px, 1.8vw, 18px)",
                      wordBreak: "break-all",
                    }}
                  >
                    {file.name}
                  </p>
                  <p style={{ opacity: 0.5, fontSize: 13, marginTop: 4 }}>
                    {formatBytes(originalSize)}
                  </p>
                </div>
              </div>

              {status === "idle" && (
                <>
                  <div style={{ marginTop: 28 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        opacity: 0.45,
                        marginBottom: 12,
                      }}
                    >
                      Quality
                    </p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {(Object.keys(QUALITY_PRESETS) as Quality[]).map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setQuality(q)}
                          style={{
                            padding: "10px 20px",
                            border: `2px solid ${quality === q ? "#ec3013" : "#201e1d"
                              }`,
                            background: quality === q ? "#ec3013" : "transparent",
                            color: quality === q ? "#f3f2f2" : "#201e1d",
                            fontWeight: 700,
                            fontSize: 13,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            fontFamily: "var(--font-archivo)",
                            transition:
                              "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                          }}
                        >
                          {QUALITY_PRESETS[q].label}
                        </button>
                      ))}
                    </div>
                    <p
                      style={{
                        marginTop: 12,
                        fontSize: 13,
                        lineHeight: 1.6,
                        opacity: 0.55,
                        maxWidth: 460,
                      }}
                    >
                      {QUALITY_PRESETS[quality].hint}
                    </p>
                  </div>

                  <p
                    style={{
                      marginTop: 18,
                      fontSize: 12,
                      lineHeight: 1.6,
                      opacity: 0.45,
                      maxWidth: 460,
                    }}
                  >
                    Compressing turns each page into an image — text won&apos;t
                    be selectable or searchable afterward.
                  </p>

                  <div
                    style={{
                      marginTop: 24,
                      display: "flex",
                      gap: 20,
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={resetAll}
                      className="ink-hover"
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: 13,
                        fontWeight: 600,
                        opacity: 0.5,
                        font: "inherit",
                      }}
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={compress}
                      className="btn btn-primary"
                    >
                      Compress PDF
                    </button>
                  </div>
                </>
              )}

              {status === "compressing" && (
                <div style={{ marginTop: 28, maxWidth: 360 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      opacity: 0.6,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span className="pulse-dot" />
                      Compressing&hellip;
                    </span>
                    <span>
                      {progress.total > 0
                        ? `${progress.current}/${progress.total}`
                        : ""}
                    </span>
                  </div>
                  <div style={{ height: 8, background: "#e2e0e0" }}>
                    <div
                      style={{
                        height: "100%",
                        background: "#ec3013",
                        width: `${progressPct}%`,
                        transition: "width 0.2s ease",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {status === "done" && (
            <div
              className="fade-in-up"
              style={{
                border: "2px solid #201e1d",
                padding: "clamp(32px, 5vw, 48px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                <p
                  style={{
                    fontSize: "clamp(11px, 1.3vw, 13px)",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    opacity: 0.45,
                  }}
                >
                  Done
                </p>
                <p
                  style={{
                    fontSize: "clamp(36px, 6vw, 60px)",
                    fontWeight: 800,
                    color: "#ec3013",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {animatedPercent}% smaller
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ opacity: 0.5 }}>Original</span>
                    <span>{formatBytes(originalSize)}</span>
                  </div>
                  <div style={{ height: 10, background: "#201e1d" }} />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ opacity: 0.5 }}>Compressed</span>
                    <span>{formatBytes(compressedSize)}</span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      background: "#ec3013",
                      width: `${compressionPct}%`,
                      transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                </div>
              </div>

              {compressedSize >= originalSize && (
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    opacity: 0.6,
                    marginBottom: 24,
                    maxWidth: 520,
                  }}
                >
                  This file didn&apos;t shrink much at this quality level —
                  try &ldquo;Low&rdquo; for a smaller result.
                </p>
              )}

              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  opacity: 0.5,
                  marginBottom: 24,
                  maxWidth: 520,
                }}
              >
                Text on compressed pages is no longer selectable or
                searchable — each page is now an image.
              </p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a
                  href={downloadUrl ?? undefined}
                  download={downloadName}
                  className="btn btn-primary"
                >
                  Download Compressed PDF
                  <span className="btn-arrow">&darr;</span>
                </a>
                <button type="button" onClick={resetAll} className="btn">
                  Compress another file
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div
              className="fade-in-up"
              style={{
                borderLeft: "4px solid #ec3013",
                paddingLeft: 24,
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(17px, 2vw, 20px)",
                  marginBottom: 8,
                }}
              >
                Something went wrong
              </p>
              <p
                style={{
                  opacity: 0.7,
                  fontSize: 15,
                  lineHeight: 1.6,
                  marginBottom: 20,
                  maxWidth: 480,
                }}
              >
                {errorMsg}
              </p>
              <button type="button" onClick={resetAll} className="btn">
                Try again
              </button>
            </div>
          )}
        </div>

        {/* ── RICH EDITORIAL & SEO CONTENT ── */}
        <div
          className="reveal"
          style={{
            marginTop: "clamp(56px, 8vw, 88px)",
            borderTop: "2px solid #201e1d",
            paddingTop: 40,
          }}
        >
          {/* How to compress steps */}
          <div style={{ marginBottom: 48 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#ec3013",
              }}
            >
              Step-by-Step Guide
            </span>
            <h2
              style={{
                fontSize: "clamp(22px, 3.2vw, 32px)",
                fontWeight: 800,
                marginTop: 8,
                marginBottom: 20,
              }}
            >
              How to Compress a PDF Online for Free
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              <div style={{ padding: "16px 20px", background: "#fff", border: "1.5px solid #201e1d" }}>
                <p style={{ fontWeight: 800, fontSize: 18, color: "#ec3013" }}>01</p>
                <p style={{ fontWeight: 700, fontSize: 15, margin: "6px 0" }}>Select or Drop PDF</p>
                <p style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.5 }}>
                  Choose any PDF document from your computer, tablet, or phone.
                </p>
              </div>
              <div style={{ padding: "16px 20px", background: "#fff", border: "1.5px solid #201e1d" }}>
                <p style={{ fontWeight: 800, fontSize: 18, color: "#ec3013" }}>02</p>
                <p style={{ fontWeight: 700, fontSize: 15, margin: "6px 0" }}>Pick Compression Level</p>
                <p style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.5 }}>
                  Choose High (best quality), Balanced (recommended), or Low (smallest size).
                </p>
              </div>
              <div style={{ padding: "16px 20px", background: "#fff", border: "1.5px solid #201e1d" }}>
                <p style={{ fontWeight: 800, fontSize: 18, color: "#ec3013" }}>03</p>
                <p style={{ fontWeight: 700, fontSize: 15, margin: "6px 0" }}>Download Instantly</p>
                <p style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.5 }}>
                  Get your optimized PDF immediately without waitlists, watermarks, or sign-ups.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Explanation / How it works */}
          <div style={{ marginBottom: 48, background: "#fff", border: "2px solid #201e1d", padding: "clamp(24px, 4vw, 36px)" }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#ec3013",
              }}
            >
              Under the Hood
            </span>
            <h2
              style={{
                fontSize: "clamp(20px, 2.6vw, 28px)",
                fontWeight: 800,
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              How Client-Side PDF Compression Works
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 1.5vw, 16px)",
                lineHeight: 1.75,
                opacity: 0.8,
                marginBottom: 14,
              }}
            >
              Unlike traditional PDF converters that transmit your private files over the internet to remote cloud servers, Daliy.Tools performs all rendering and compression operations directly inside your web browser using modern WebAssembly and HTML5 Canvas technology.
            </p>
            <p
              style={{
                fontSize: "clamp(14px, 1.5vw, 16px)",
                lineHeight: 1.75,
                opacity: 0.8,
              }}
            >
              Each page is analyzed and reconstructed into high-efficiency, compressed raster layers. This eliminates bloated embedded metadata, uncompressed color profiles, and oversized scanned images while preserving clean, legible text for email attachments, government portals, and web publishing.
            </p>
          </div>

          {/* Comprehensive FAQ Section */}
          <div style={{ marginBottom: 48 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#ec3013",
              }}
            >
              Answers to Common Questions
            </span>
            <h2
              style={{
                fontSize: "clamp(22px, 3.2vw, 32px)",
                fontWeight: 800,
                marginTop: 8,
                marginBottom: 24,
              }}
            >
              Frequently Asked Questions
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              <div style={{ padding: "20px 24px", background: "#fff", border: "1.5px solid #201e1d" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                  Will compressing my PDF reduce text quality?
                </h3>
                <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>
                  Our <strong>Balanced</strong> preset keeps text crisp while reducing large image sizes. If you are printing your document or need maximum sharpness, choose the <strong>High</strong> quality setting.
                </p>
              </div>

              <div style={{ padding: "20px 24px", background: "#fff", border: "1.5px solid #201e1d" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                  Is my PDF uploaded to any server?
                </h3>
                <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>
                  Never. All processing happens entirely inside your local web browser. Your confidential files, contracts, or tax documents never leave your computer or phone.
                </p>
              </div>

              <div style={{ padding: "20px 24px", background: "#fff", border: "1.5px solid #201e1d" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                  What is the maximum file size supported?
                </h3>
                <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>
                  You can compress PDFs up to 50MB directly in your browser. For optimal performance, modern browsers handle multi-page documents seamlessly within seconds.
                </p>
              </div>

              <div style={{ padding: "20px 24px", background: "#fff", border: "1.5px solid #201e1d" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                  Can I compress password-protected PDF files?
                </h3>
                <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>
                  If your PDF is encrypted with a password, please unlock it before dropping it here so the browser can read and compress its pages.
                </p>
              </div>
            </div>
          </div>

          {/* Related Daily Tools */}
          <div style={{ borderTop: "1.5px dashed #201e1d", paddingTop: 32 }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                opacity: 0.5,
                marginBottom: 16,
              }}
            >
              Related Daily Utilities
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/tools/merge-pdf" className="btn" style={{ fontSize: 13 }}>
                Merge PDF
              </Link>
              <Link href="/tools/split-pdf" className="btn" style={{ fontSize: 13 }}>
                Split PDF
              </Link>
              <Link href="/tools/image-to-pdf" className="btn" style={{ fontSize: 13 }}>
                Image to PDF
              </Link>
              <Link href="/tools/resize-image" className="btn" style={{ fontSize: 13 }}>
                Resize Image
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
