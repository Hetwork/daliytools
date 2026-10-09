"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

type Position = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
type Status = "idle" | "stamping" | "done" | "error";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function NumberPdfContent() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [fontSize, setFontSize] = useState(12);
  const [opacity, setOpacity] = useState(0.75);
  const [prefix, setPrefix] = useState("Page");
  const [customText, setCustomText] = useState("");
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-fast").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); }, [downloadUrl]);

  async function handleFile(selected: File | null) {
    if (!selected) return;
    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please choose a PDF file."); setStatus("error"); return;
    }
    setFile(selected); setErrorMsg(""); setStatus("idle");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const document = await PDFDocument.load(await selected.arrayBuffer(), { ignoreEncryption: true });
      setPageCount(document.getPageCount());
    } catch { setPageCount(0); setErrorMsg("We could not read that PDF. It may be corrupted or password-protected."); setStatus("error"); }
  }

  async function stampPdf() {
    if (!file) return;
    setStatus("stamping"); setErrorMsg("");
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const document = await PDFDocument.load(await file.arrayBuffer());
      const font = await document.embedFont(StandardFonts.Helvetica);
      const pages = document.getPages();
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const number = includeNumbers ? `${prefix} ${index + 1} of ${pages.length}` : "";
        const text = [customText.trim(), number].filter(Boolean).join(" · ");
        if (!text) return;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const margin = 28;
        const x = position.endsWith("left") ? margin : position.endsWith("right") ? width - margin - textWidth : (width - textWidth) / 2;
        const y = position.startsWith("top") ? height - margin - fontSize : margin;
        page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.12, 0.12, 0.11), opacity });
      });
      const bytes = await document.save({ useObjectStreams: true });
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" })));
      setStatus("done");
    } catch { setErrorMsg("We could not stamp that PDF. It may be encrypted or corrupted."); setStatus("error"); }
  }

  function reset() {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setPageCount(0); setDownloadUrl(null); setStatus("idle"); setErrorMsg("");
  }

  return (
    <main className="noise" style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh" }}>
      <SiteHeader active="Tools" />
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)" }}>
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}><Link href="/tools" className="ink-hover">All Tools</Link> / PDF Tools / Number PDF</p>
        <div className="reveal"><div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: "var(--on-solid)", background: "var(--red)", padding: "6px 14px" }}>Live</span><span style={{ fontSize: 13, opacity: 0.5 }}>Runs entirely in your browser</span></div><h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05 }}>Number & Stamp PDF</h1><p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 620 }}>Add page numbers, headers, footers, or a custom stamp to every page of a PDF privately in your browser.</p></div>
        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          <div role="button" tabIndex={0} onClick={() => fileInputRef.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click(); }} onDrop={(event) => { event.preventDefault(); handleFile(event.dataTransfer.files?.[0] ?? null); }} onDragOver={(event) => event.preventDefault()} className="fade-in-up" style={{ border: "2px dashed var(--border)", padding: "clamp(40px, 7vw, 72px) 24px", textAlign: "center" }}><div style={{ width: 56, height: 56, border: "2px solid var(--border)", margin: "0 auto 20px", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800 }}>PDF</div><p style={{ fontSize: 20, fontWeight: 700 }}>Drag & drop your PDF here</p><p style={{ fontSize: 14, opacity: 0.55, marginTop: 8 }}>or click to browse</p><input ref={fileInputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(event) => handleFile(event.target.files?.[0] ?? null)} /></div>
          {file && <div className="fade-in-up" style={{ marginTop: 20, border: "2px solid var(--border)", padding: "clamp(20px, 3vw, 28px)" }}><p style={{ fontWeight: 700, wordBreak: "break-all" }}>{file.name}</p><p style={{ opacity: 0.55, fontSize: 13, marginTop: 5 }}>{formatBytes(file.size)} · {pageCount} page{pageCount === 1 ? "" : "s"}</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginTop: 24 }}><label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Position<select value={position} onChange={(event) => setPosition(event.target.value as Position)} style={{ display: "block", width: "100%", marginTop: 8, padding: "12px", border: "2px solid var(--border)", background: "var(--bg)", font: "inherit" }}><option value="top-left">Top left</option><option value="top-center">Top center</option><option value="top-right">Top right</option><option value="bottom-left">Bottom left</option><option value="bottom-center">Bottom center</option><option value="bottom-right">Bottom right</option></select></label><label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Page label<input value={prefix} onChange={(event) => setPrefix(event.target.value)} disabled={!includeNumbers} style={{ display: "block", width: "100%", marginTop: 8, padding: "12px", border: "2px solid var(--border)", background: "transparent", font: "inherit" }} /></label><label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Custom text<input value={customText} onChange={(event) => setCustomText(event.target.value)} placeholder="Optional" style={{ display: "block", width: "100%", marginTop: 8, padding: "12px", border: "2px solid var(--border)", background: "transparent", font: "inherit" }} /></label></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}><label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Font size: {fontSize} pt<input type="range" min="8" max="28" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} style={{ display: "block", width: "100%", marginTop: 10 }} /></label><label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Opacity: {Math.round(opacity * 100)}%<input type="range" min="0.2" max="1" step="0.05" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} style={{ display: "block", width: "100%", marginTop: 10 }} /></label></div><label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, fontSize: 13, fontWeight: 600 }}><input type="checkbox" checked={includeNumbers} onChange={(event) => setIncludeNumbers(event.target.checked)} /> Add page numbers</label><div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 24 }}><button type="button" className="btn btn-primary" onClick={stampPdf} disabled={status === "stamping" || !pageCount}>{status === "stamping" ? "Creating PDF…" : "Create stamped PDF"} {status !== "stamping" && <span className="btn-arrow">&darr;</span>}</button><button type="button" className="btn" onClick={reset}>Clear</button></div>{errorMsg && <p style={{ color: "var(--red)", fontSize: 13, fontWeight: 600, marginTop: 16 }}>{errorMsg}</p>}</div>}
          {status === "done" && downloadUrl && <div className="fade-in-up" style={{ marginTop: 24, border: "2px solid var(--border)", padding: "24px" }}><p style={{ fontWeight: 700 }}>Your stamped PDF is ready.</p><a href={downloadUrl} download={`${file?.name.replace(/\.pdf$/i, "") || "document"}_stamped.pdf`} className="btn btn-primary" style={{ display: "inline-block", marginTop: 16 }}>Download PDF <span className="btn-arrow">&darr;</span></a></div>}
        </div>
        <ToolEditorial toolName="Number & Stamp PDF" {...toolEditorialData["number-pdf"]} />
      </section>
      <SiteFooter />
    </main>
  );
}
