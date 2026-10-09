"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

type OutputFormat = "png" | "jpeg" | "webp";
type Status = "idle" | "rendering" | "done" | "error";
type RenderedPage = { page: number; url: string; name: string };

function parsePages(input: string, total: number): number[] | null {
  if (!input.trim()) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = new Set<number>();
  for (const part of input.split(",").map((value) => value.trim()).filter(Boolean)) {
    if (/^\d+$/.test(part)) {
      const page = Number(part);
      if (page < 1 || page > total) return null;
      pages.add(page);
    } else if (/^\d+\s*-\s*\d+$/.test(part)) {
      const [start, end] = part.split("-").map((value) => Number(value.trim()));
      if (start < 1 || end > total || start > end) return null;
      for (let page = start; page <= end; page += 1) pages.add(page);
    } else return null;
  }
  return pages.size ? [...pages].sort((a, b) => a - b) : null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function PdfToImageContent() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageInput, setPageInput] = useState("");
  const [format, setFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(0.9);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [outputs, setOutputs] = useState<RenderedPage[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-fast").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => outputs.forEach((output) => URL.revokeObjectURL(output.url)), [outputs]);

  async function handleFile(selected: File | null) {
    if (!selected) return;
    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please choose a PDF file."); setStatus("error"); return;
    }
    setFile(selected); setErrorMsg(""); setStatus("idle"); setOutputs([]);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      const document = await pdfjsLib.getDocument({ data: await selected.arrayBuffer(), standardFontDataUrl: "/pdfjs/standard_fonts/", cMapUrl: "/pdfjs/cmaps/", cMapPacked: true }).promise;
      setPageCount(document.numPages);
    } catch {
      setPageCount(0); setErrorMsg("We could not read that PDF. It may be corrupted or password-protected."); setStatus("error");
    }
  }

  async function renderPages() {
    if (!file || !pageCount) return;
    const pages = parsePages(pageInput, pageCount);
    if (!pages) { setErrorMsg(`Invalid pages. Use a format like 1-3, 5 (max page: ${pageCount}).`); setStatus("error"); return; }
    setStatus("rendering"); setErrorMsg(""); setProgress(0);
    outputs.forEach((output) => URL.revokeObjectURL(output.url)); setOutputs([]);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      const document = await pdfjsLib.getDocument({ data: await file.arrayBuffer(), standardFontDataUrl: "/pdfjs/standard_fonts/", cMapUrl: "/pdfjs/cmaps/", cMapPacked: true }).promise;
      const mime = `image/${format}`;
      const rendered: RenderedPage[] = [];
      for (let index = 0; index < pages.length; index += 1) {
        const pageNumber = pages[index];
        const page = await document.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = window.document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas is not supported in this browser.");
        if (format !== "png") { context.fillStyle = "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height); }
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Could not encode image.")), mime, quality));
        const extension = format === "jpeg" ? "jpg" : format;
        rendered.push({ page: pageNumber, url: URL.createObjectURL(blob), name: `${file.name.replace(/\.pdf$/i, "")}_page_${pageNumber}.${extension}` });
        setProgress(Math.round(((index + 1) / pages.length) * 100));
        canvas.width = 0; canvas.height = 0;
      }
      setOutputs(rendered); setStatus("done");
    } catch { setErrorMsg("We could not render that PDF. Try a smaller document or fewer pages."); setStatus("error"); }
  }

  async function downloadZip() {
    if (!outputs.length) return;
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const output of outputs) zip.file(output.name, await (await fetch(output.url)).blob());
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
    const url = URL.createObjectURL(blob); const link = window.document.createElement("a");
    link.href = url; link.download = `${file?.name.replace(/\.pdf$/i, "") || "pdf"}_images.zip`; link.click(); URL.revokeObjectURL(url);
  }

  function reset() {
    outputs.forEach((output) => URL.revokeObjectURL(output.url));
    setFile(null); setPageCount(0); setPageInput(""); setOutputs([]); setStatus("idle"); setProgress(0); setErrorMsg("");
  }

  return (
    <main className="noise" style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh" }}>
      <SiteHeader active="Tools" />
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)" }}>
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}><Link href="/tools" className="ink-hover">All Tools</Link> / PDF Tools / PDF to Image</p>
        <div className="reveal"><div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: "var(--on-solid)", background: "var(--red)", padding: "6px 14px" }}>Live</span><span style={{ fontSize: 13, opacity: 0.5 }}>Runs entirely in your browser</span></div><h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05 }}>PDF to Image</h1><p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 600 }}>Turn PDF pages into crisp PNG, JPG, or WebP images without uploading your document.</p></div>
        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          <div role="button" tabIndex={0} onClick={() => fileInputRef.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click(); }} onDrop={(event) => { event.preventDefault(); handleFile(event.dataTransfer.files?.[0] ?? null); }} onDragOver={(event) => event.preventDefault()} className="fade-in-up" style={{ border: "2px dashed var(--border)", padding: "clamp(40px, 7vw, 72px) 24px", textAlign: "center" }}><div style={{ width: 56, height: 56, border: "2px solid var(--border)", margin: "0 auto 20px", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800 }}>PDF</div><p style={{ fontSize: 20, fontWeight: 700 }}>Drag & drop your PDF here</p><p style={{ fontSize: 14, opacity: 0.55, marginTop: 8 }}>or click to browse</p><input ref={fileInputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(event) => handleFile(event.target.files?.[0] ?? null)} /></div>
          {file && <div className="fade-in-up" style={{ marginTop: 20, border: "2px solid var(--border)", padding: "clamp(20px, 3vw, 28px)" }}><p style={{ fontWeight: 700, wordBreak: "break-all" }}>{file.name}</p><p style={{ opacity: 0.55, fontSize: 13, marginTop: 5 }}>{formatBytes(file.size)} · {pageCount} page{pageCount === 1 ? "" : "s"}</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginTop: 24 }}><label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Pages<input value={pageInput} onChange={(event) => setPageInput(event.target.value)} placeholder={`All pages or 1-3, 5`} style={{ display: "block", width: "100%", marginTop: 8, padding: "12px", border: "2px solid var(--border)", background: "transparent", font: "inherit" }} /></label><label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Format<select value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)} style={{ display: "block", width: "100%", marginTop: 8, padding: "12px", border: "2px solid var(--border)", background: "var(--bg)", font: "inherit" }}><option value="png">PNG</option><option value="jpeg">JPG</option><option value="webp">WebP</option></select></label></div>{format !== "png" && <label style={{ display: "block", marginTop: 20, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Quality: {Math.round(quality * 100)}%<input type="range" min="0.4" max="1" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} style={{ display: "block", width: "100%", marginTop: 10 }} /></label>}<div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 24 }}><button type="button" className="btn btn-primary" onClick={renderPages} disabled={status === "rendering"}>{status === "rendering" ? `Rendering ${progress}%` : `Convert ${pageInput.trim() ? "selected" : "all"} pages`} {!(!file || status === "rendering") && <span className="btn-arrow">&darr;</span>}</button><button type="button" className="btn" onClick={reset}>Clear</button></div>{errorMsg && <p style={{ color: "var(--red)", fontSize: 13, fontWeight: 600, marginTop: 16 }}>{errorMsg}</p>}</div>}
          {status === "done" && outputs.length > 0 && <div className="fade-in-up" style={{ marginTop: 24 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}><p style={{ fontWeight: 700 }}>{outputs.length} image{outputs.length === 1 ? "" : "s"} ready</p><button type="button" className="btn btn-primary" onClick={downloadZip}>Download ZIP <span className="btn-arrow">&darr;</span></button></div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>{outputs.map((output) => <div key={output.page} style={{ border: "2px solid var(--border)", background: "var(--surface)" }}><img src={output.url} alt={`Page ${output.page}`} style={{ width: "100%", aspectRatio: "0.72", objectFit: "contain", display: "block" }} /><div style={{ padding: 10, fontSize: 12, fontWeight: 700 }}>Page {output.page}<a href={output.url} download={output.name} className="ink-hover" style={{ display: "block", marginTop: 6, fontWeight: 500 }}>Download image</a></div></div>)}</div></div>}
        </div>
        <ToolEditorial toolName="PDF to Image" {...toolEditorialData["pdf-to-image"]} />
      </section>
      <SiteFooter />
    </main>
  );
}
