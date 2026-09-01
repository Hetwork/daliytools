"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

const MAX_SIZE = 100 * 1024 * 1024;

type Mode = "all" | "range";
type Status = "idle" | "splitting" | "done" | "error";

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

function parsePageRanges(input: string, total: number): number[][] | null {
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  const ranges: number[][] = [];
  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      const n = parseInt(part, 10);
      if (n < 1 || n > total) return null;
      ranges.push([n]);
    } else if (/^\d+-\d+$/.test(part)) {
      const [a, b] = part.split("-").map(Number);
      if (a < 1 || b > total || a > b) return null;
      const pages: number[] = [];
      for (let i = a; i <= b; i++) pages.push(i);
      ranges.push(pages);
    } else {
      return null;
    }
  }
  return ranges.length > 0 ? ranges : null;
}

export default function SplitPdfContent() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<Mode>("all");
  const [rangeInput, setRangeInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("");
  const [outputCount, setOutputCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-fast").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); }, [downloadUrl]);

  async function handleFile(f: File | null) {
    if (!f) return;
    if (!(f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) {
      setErrorMsg("Please choose a .pdf file."); setStatus("error"); return;
    }
    if (f.size > MAX_SIZE) {
      setErrorMsg("File exceeds 100 MB."); setStatus("error"); return;
    }
    setFile(f);
    setErrorMsg("");
    setStatus("idle");
    setDownloadUrl(null);
    // Count pages
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setPageCount(0);
    }
  }

  async function split() {
    if (!file) return;
    setStatus("splitting");
    setErrorMsg("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const JSZip = (await import("jszip")).default;

      const sourceBytes = await file.arrayBuffer();
      const sourceDoc = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
      const total = sourceDoc.getPageCount();
      const baseName = file.name.replace(/\.pdf$/i, "");

      if (mode === "all") {
        // One PDF per page → ZIP
        const zip = new JSZip();
        for (let i = 0; i < total; i++) {
          const out = await PDFDocument.create();
          const [page] = await out.copyPages(sourceDoc, [i]);
          out.addPage(page);
          const bytes = await out.save({ useObjectStreams: true });
          zip.file(`${baseName}_page_${String(i + 1).padStart(String(total).length, "0")}.pdf`, bytes);
        }
        const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(`${baseName}_split.zip`);
        setOutputCount(total);
        setStatus("done");
      } else {
        // Page range → single PDF
        const ranges = parsePageRanges(rangeInput, total);
        if (!ranges) {
          setErrorMsg(`Invalid range. Use format like: 1-3, 5, 7-9 (max page: ${total})`);
          setStatus("error");
          return;
        }
        const pageIndices = ranges.flat().map((n) => n - 1);
        const out = await PDFDocument.create();
        const pages = await out.copyPages(sourceDoc, pageIndices);
        pages.forEach((p) => out.addPage(p));
        const outBytes = await out.save({ useObjectStreams: true });
        const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(`${baseName}_pages_${rangeInput.replace(/\s/g, "")}.pdf`);
        setOutputCount(pageIndices.length);
        setStatus("done");
      }
    } catch {
      setErrorMsg("Failed to split the PDF. It may be corrupted or password-protected.");
      setStatus("error");
    }
  }

  function reset() {
    setFile(null);
    setPageCount(0);
    setStatus("idle");
    setDownloadUrl(null);
    setDownloadName("");
    setErrorMsg("");
    setRangeInput("");
    setOutputCount(0);
  }

  return (
    <main className="noise" style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}>
      <SiteHeader active="Tools" />
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}>
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / PDF Tools / Split PDF
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Split PDF</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Extract every page as its own PDF, or pull out a specific page range. Nothing is uploaded to any server.
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
              <div style={{ width: 48, height: 48, border: "2px solid #201e1d", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>PDF</div>
              <p style={{ fontSize: "clamp(17px, 2.2vw, 22px)", fontWeight: 700, marginBottom: 6 }}>Drag & drop your PDF here</p>
              <p style={{ fontSize: 14, opacity: 0.55 }}>or click to browse — up to 100 MB</p>
              <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            </div>
          )}

          {/* File loaded */}
          {file && (status === "idle" || status === "splitting") && (
            <div className="fade-in-up" style={{ border: "2px solid #201e1d", padding: "clamp(24px, 4vw, 32px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <div style={{ width: 48, height: 48, border: "2px solid #201e1d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>PDF</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "clamp(14px, 1.8vw, 17px)", wordBreak: "break-all" }}>{file.name}</p>
                  <p style={{ opacity: 0.5, fontSize: 13, marginTop: 2 }}>{formatBytes(file.size)} · {pageCount} page{pageCount !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Mode toggle */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 12 }}>Split mode</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {([["all", "All pages (ZIP)"], ["range", "Page range"]] as [Mode, string][]).map(([val, label]) => (
                    <button
                      key={val} type="button" onClick={() => setMode(val)}
                      style={{ padding: "10px 20px", border: `2px solid ${mode === val ? "#ec3013" : "#201e1d"}`, background: mode === val ? "#ec3013" : "transparent", color: mode === val ? "#f3f2f2" : "#201e1d", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "var(--font-archivo)", transition: "background 0.2s, border-color 0.2s, color 0.2s" }}
                    >{label}</button>
                  ))}
                </div>
              </div>

              {mode === "all" && (
                <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 20 }}>
                  Each of the {pageCount} pages will be saved as a separate PDF, bundled into a ZIP file.
                </p>
              )}

              {mode === "range" && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, display: "block", marginBottom: 8 }}>
                    Pages (1–{pageCount})
                  </label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder={`e.g. 1-3, 5, 7-${Math.min(9, pageCount)}`}
                    style={{ width: "100%", border: "2px solid #201e1d", background: "transparent", color: "#201e1d", fontFamily: "var(--font-archivo)", fontSize: 15, fontWeight: 500, padding: "12px 16px", outline: "none", boxSizing: "border-box" }}
                  />
                  <p style={{ fontSize: 12, opacity: 0.5, marginTop: 8 }}>Separate pages or ranges with commas. Example: 1-3, 5, 8-10</p>
                </div>
              )}

              {errorMsg && <p style={{ fontSize: 13, color: "#ec3013", fontWeight: 600, marginBottom: 16 }}>{errorMsg}</p>}

              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <button type="button" onClick={reset} className="ink-hover" style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.5, fontFamily: "inherit", cursor: "pointer" }}>Remove</button>
                <button type="button" onClick={split} disabled={status === "splitting" || (mode === "range" && !rangeInput.trim())} className="btn btn-primary">
                  {status === "splitting"
                    ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="pulse-dot" />Splitting…</span>
                    : mode === "all" ? `Split into ${pageCount} PDFs` : "Extract Pages"}
                </button>
              </div>
            </div>
          )}

          {status === "done" && downloadUrl && (
            <div className="fade-in-up" style={{ border: "2px solid #201e1d", padding: "clamp(32px, 5vw, 48px)" }}>
              <p style={{ fontSize: "clamp(11px, 1.3vw, 13px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.45, marginBottom: 8 }}>Done</p>
              <p style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 800, color: "#ec3013", lineHeight: 1, marginBottom: 24 }}>
                {outputCount} page{outputCount !== 1 ? "s" : ""} extracted
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a href={downloadUrl} download={downloadName} className="btn btn-primary">
                  Download {mode === "all" ? "ZIP" : "PDF"} <span className="btn-arrow">&darr;</span>
                </a>
                <button type="button" onClick={reset} className="btn">Split another file</button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="fade-in-up" style={{ borderLeft: "4px solid #ec3013", paddingLeft: 24 }}>
              <p style={{ fontWeight: 700, fontSize: "clamp(17px, 2vw, 20px)", marginBottom: 8 }}>Something went wrong</p>
              <p style={{ opacity: 0.7, fontSize: 15, lineHeight: 1.6, marginBottom: 20, maxWidth: 480 }}>{errorMsg}</p>
              <button type="button" onClick={reset} className="btn">Try again</button>
            </div>
          )}
        </div>

        <ToolEditorial
          toolName="Split PDF"
          {...toolEditorialData["split-pdf"]}
        />
      </section>
      <SiteFooter />
    </main>
  );
}
