"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";

const MAX_FILES = 20;
const MAX_SIZE = 50 * 1024 * 1024;

type Status = "idle" | "merging" | "done" | "error";

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export default function MergePdfContent() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState(0);
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

  useEffect(() => () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); }, [downloadUrl]);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const valid: File[] = [];
    for (const f of Array.from(incoming)) {
      if (!(f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) continue;
      if (f.size > MAX_SIZE) { setErrorMsg(`"${f.name}" exceeds 50 MB and was skipped.`); continue; }
      valid.push(f);
    }
    setFiles((prev) => {
      const combined = [...prev, ...valid].slice(0, MAX_FILES);
      return combined;
    });
    setStatus("idle");
    setDownloadUrl(null);
    setErrorMsg("");
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setStatus("idle");
    setDownloadUrl(null);
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    setFiles((prev) => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; });
  }

  function moveDown(idx: number) {
    setFiles((prev) => {
      if (idx >= prev.length - 1) return prev;
      const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a;
    });
  }

  async function merge() {
    if (files.length < 2) { setErrorMsg("Add at least 2 PDF files to merge."); return; }
    setStatus("merging");
    setErrorMsg("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const mergedBytes = await merged.save({ useObjectStreams: true });
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
      setMergedSize(mergedBytes.byteLength);
      setStatus("done");
    } catch {
      setErrorMsg("Failed to merge. One or more files may be corrupted or password-protected.");
      setStatus("error");
    }
  }

  function reset() {
    setFiles([]);
    setStatus("idle");
    setDownloadUrl(null);
    setMergedSize(0);
    setErrorMsg("");
  }

  const totalInputSize = files.reduce((s, f) => s + f.size, 0);

  return (
    <main className="noise" style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}>
      <SiteHeader active="Tools" />
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}>
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / PDF Tools / Merge PDF
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Merge PDF</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Combine multiple PDFs into a single file. Drag to reorder, then merge — nothing leaves your browser.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            className="fade-in-up"
            style={{ border: `2px dashed ${isDragging ? "#ec3013" : "#201e1d"}`, background: isDragging ? "rgba(236,48,19,0.05)" : "transparent", padding: "clamp(32px, 5vw, 56px) 24px", textAlign: "center", transition: "border-color 0.25s, background 0.25s", cursor: "pointer" }}
          >
            <div style={{ width: 48, height: 48, border: "2px solid #201e1d", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>PDF</div>
            <p style={{ fontSize: "clamp(15px, 2vw, 20px)", fontWeight: 700, marginBottom: 6 }}>Drag & drop PDFs here</p>
            <p style={{ fontSize: 14, opacity: 0.55 }}>or click to browse — up to {MAX_FILES} files, 50 MB each</p>
            <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" hidden multiple onChange={(e) => addFiles(e.target.files)} />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="fade-in-up" style={{ marginTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45 }}>{files.length} file{files.length > 1 ? "s" : ""} · {formatBytes(totalInputSize)}</p>
                <button type="button" onClick={reset} className="ink-hover" style={{ background: "none", border: "none", fontSize: 12, fontWeight: 600, opacity: 0.5, fontFamily: "inherit", cursor: "pointer" }}>Clear all</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, border: "2px solid #201e1d", padding: "12px 16px" }}>
                    <div style={{ width: 36, height: 36, border: "2px solid #201e1d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>PDF</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</p>
                      <p style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>{formatBytes(f.size)}</p>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <button type="button" onClick={() => moveUp(i)} disabled={i === 0} style={{ width: 28, height: 28, border: "1px solid #201e1d", background: "none", cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.3 : 1, fontFamily: "inherit", fontSize: 12 }}>↑</button>
                      <button type="button" onClick={() => moveDown(i)} disabled={i === files.length - 1} style={{ width: 28, height: 28, border: "1px solid #201e1d", background: "none", cursor: i === files.length - 1 ? "default" : "pointer", opacity: i === files.length - 1 ? 0.3 : 1, fontFamily: "inherit", fontSize: 12 }}>↓</button>
                      <button type="button" onClick={() => removeFile(i)} style={{ width: 28, height: 28, border: "1px solid #ec3013", background: "none", cursor: "pointer", color: "#ec3013", fontFamily: "inherit", fontSize: 14 }}>×</button>
                    </div>
                  </div>
                ))}
              </div>

              {errorMsg && <p style={{ marginTop: 10, fontSize: 13, color: "#ec3013", fontWeight: 600 }}>{errorMsg}</p>}

              {status !== "done" && (
                <div style={{ marginTop: 20, display: "flex", gap: 16, alignItems: "center" }}>
                  <button type="button" onClick={merge} disabled={status === "merging" || files.length < 2} className="btn btn-primary">
                    {status === "merging" ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="pulse-dot" />Merging…</span>
                    ) : `Merge ${files.length} PDF${files.length > 1 ? "s" : ""}`}
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="btn" style={{ opacity: files.length >= MAX_FILES ? 0.4 : 1 }} disabled={files.length >= MAX_FILES}>
                    Add more
                  </button>
                </div>
              )}

              {status === "done" && downloadUrl && (
                <div className="fade-in-up" style={{ marginTop: 24, border: "2px solid #201e1d", padding: "clamp(24px, 4vw, 32px)" }}>
                  <p style={{ fontSize: "clamp(11px, 1.3vw, 13px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.45, marginBottom: 8 }}>Done</p>
                  <p style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 800, color: "#ec3013", lineHeight: 1, marginBottom: 24 }}>
                    {files.length} files → {formatBytes(mergedSize)}
                  </p>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <a href={downloadUrl} download="merged.pdf" className="btn btn-primary">
                      Download Merged PDF <span className="btn-arrow">&darr;</span>
                    </a>
                    <button type="button" onClick={reset} className="btn">Merge another set</button>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div style={{ marginTop: 20, borderLeft: "4px solid #ec3013", paddingLeft: 20 }}>
                  <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Something went wrong</p>
                  <p style={{ opacity: 0.7, fontSize: 14, marginBottom: 14 }}>{errorMsg}</p>
                  <button type="button" onClick={reset} className="btn">Start over</button>
                </div>
              )}
            </div>
          )}

          {files.length === 0 && !errorMsg && (
            <p className="fade-in-up" style={{ marginTop: 16, fontSize: 13, opacity: 0.5 }}>Add at least 2 PDFs to get started.</p>
          )}
          {files.length === 0 && errorMsg && (
            <p style={{ marginTop: 12, fontSize: 13, color: "#ec3013", fontWeight: 600 }}>{errorMsg}</p>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            Each PDF is read in your browser using pdf-lib, then every page is copied — in the order you set — into a single new document. Nothing is uploaded to any server.
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
