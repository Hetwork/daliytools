"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

const MAX_SIZE = 100 * 1024 * 1024;
const RENDER_SCALE = 2;
type Status = "idle" | "unlocking" | "done" | "error";

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, index)).toFixed(index > 0 ? 1 : 0)} ${units[index]}`;
}

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("This browser could not create a page image."));
        return;
      }
      blob.arrayBuffer().then((buffer) => resolve(new Uint8Array(buffer))).catch(reject);
    }, "image/jpeg", 0.94);
  });
}

export default function UnlockPdfContent() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("");
  const [outputSize, setOutputSize] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-fast").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  }, [downloadUrl]);

  function reset() {
    setFile(null);
    setPassword("");
    setStatus("idle");
    setProgress({ current: 0, total: 0 });
    setDownloadUrl(null);
    setDownloadName("");
    setOutputSize(0);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFile(selected: File | null) {
    if (!selected) return;
    if (!(selected.type === "application/pdf" || selected.name.toLowerCase().endsWith(".pdf"))) {
      setErrorMsg("Please choose a .pdf file.");
      setStatus("error");
      return;
    }
    if (selected.size > MAX_SIZE) {
      setErrorMsg("That file is larger than 100 MB. Please choose a smaller PDF.");
      setStatus("error");
      return;
    }
    setFile(selected);
    setStatus("idle");
    setErrorMsg("");
    setDownloadUrl(null);
  }

  async function unlock() {
    if (!file || !password) {
      setErrorMsg("Enter the PDF password to continue.");
      setStatus("error");
      return;
    }
    setStatus("unlocking");
    setErrorMsg("");
    setProgress({ current: 0, total: 0 });

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      const { PDFDocument } = await import("pdf-lib");
      const sourceBytes = await file.arrayBuffer();
      const source = await pdfjsLib.getDocument({
        data: sourceBytes,
        password,
        standardFontDataUrl: "/pdfjs/standard_fonts/",
        cMapUrl: "/pdfjs/cmaps/",
        cMapPacked: true,
      }).promise;
      const output = await PDFDocument.create();
      const totalPages = source.numPages;
      setProgress({ current: 0, total: totalPages });

      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        const page = await source.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: RENDER_SCALE });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("This browser does not support canvas rendering.");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        const image = await canvasToJpeg(canvas);
        const embedded = await output.embedJpg(image);
        const outputPage = output.addPage([baseViewport.width, baseViewport.height]);
        outputPage.drawImage(embedded, {
          x: 0,
          y: 0,
          width: baseViewport.width,
          height: baseViewport.height,
        });
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
        setProgress({ current: pageNumber, total: totalPages });
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }

      const bytes = await output.save({ useObjectStreams: true });
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName(file.name.replace(/\.pdf$/i, "") + "-unlocked.pdf");
      setOutputSize(bytes.byteLength);
      setStatus("done");
    } catch (error) {
      const message = error instanceof Error ? error.message.toLowerCase() : "";
      setErrorMsg(
        message.includes("password") || message.includes("encrypted")
          ? "That password did not unlock this PDF. Check it and try again."
          : "We could not process this PDF. It may be corrupted or use unsupported protection."
      );
      setStatus("error");
    }
  }

  const progressPercent = progress.total ? Math.round((progress.current / progress.total) * 100) : 0;
  const showDropzone = !file && status !== "error";

  return (
    <main className="noise" style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}>
      <SiteHeader active="Tools" />
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}>
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / PDF Tools / Unlock PDF
        </p>
        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: "var(--on-solid)", background: "var(--red)", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Unlock PDF</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 600 }}>
            Remove password protection from a PDF you can open. Your file and password never leave this browser.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          {showDropzone && (
            <div role="button" tabIndex={0} onClick={() => fileInputRef.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fileInputRef.current?.click(); } }} onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFile(event.dataTransfer.files?.[0] ?? null); }} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} className="fade-in-up" style={{ border: `2px dashed ${isDragging ? "var(--red)" : "var(--border)"}`, background: isDragging ? "rgba(var(--accent-rgb), 0.05)" : "transparent", padding: "clamp(48px, 8vw, 80px) 24px", textAlign: "center", transition: "border-color 0.25s ease, background 0.25s ease" }}>
              <div style={{ width: 56, height: 56, border: "2px solid var(--border)", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>PDF</div>
              <p style={{ fontSize: "clamp(17px, 2.2vw, 22px)", fontWeight: 700, marginBottom: 8 }}>Drag & drop your protected PDF here</p>
              <p style={{ fontSize: 14, opacity: 0.55 }}>or click to browse — up to 100MB</p>
              <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(event) => handleFile(event.target.files?.[0] ?? null)} />
            </div>
          )}

          {file && status !== "done" && (
            <div className="fade-in-up" style={{ border: "2px solid var(--border)", padding: "clamp(24px, 4vw, 32px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>PDF</div>
                <div style={{ minWidth: 0 }}><p style={{ fontWeight: 700, fontSize: 18, wordBreak: "break-all" }}>{file.name}</p><p style={{ opacity: 0.5, fontSize: 13, marginTop: 4 }}>{formatBytes(file.size)}</p></div>
              </div>
              <label style={{ display: "block", marginTop: 28, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.55 }}>
                PDF password
                <span style={{ display: "block", position: "relative", maxWidth: 460, marginTop: 10 }}>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setErrorMsg(""); }} placeholder="Enter the password you know" autoComplete="off" style={{ display: "block", width: "100%", padding: "14px 52px 14px 16px", border: "2px solid var(--border)", background: "transparent", color: "var(--ink)", font: "inherit", fontSize: 16 }} />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"} style={{ position: "absolute", top: "50%", right: 8, width: 36, height: 36, transform: "translateY(-50%)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "transparent", color: "var(--ink)", padding: 0 }}>
                    {showPassword ? (
                      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.7 4 10 8a11.7 11.7 0 0 1-2.1 3.7" /><path d="M6.6 6.6C4.7 7.8 3.4 9.8 2 12c1.3 3.3 4.8 7 10 7 1.4 0 2.7-.3 3.8-.8" /></svg>
                    ) : (
                      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </span>
              </label>
              <p style={{ marginTop: 14, fontSize: 13, lineHeight: 1.6, opacity: 0.55, maxWidth: 560 }}>The new PDF is rendered page by page, so text selection, forms, bookmarks, and links will not carry over.</p>
              {errorMsg && <p style={{ marginTop: 16, color: "var(--red)", fontSize: 13, fontWeight: 600 }}>{errorMsg}</p>}
              {status === "unlocking" && <div style={{ marginTop: 24 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 10 }}><span><span className="pulse-dot" /> Unlocking&hellip;</span><span>{progressPercent}%</span></div><div style={{ height: 8, background: "#e2e0e0" }}><div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--red)", transition: "width 0.2s ease" }} /></div></div>}
              {status !== "unlocking" && <div style={{ marginTop: 24, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}><button type="button" onClick={reset} className="ink-hover" style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.5, font: "inherit" }}>Remove</button><button type="button" onClick={unlock} className="btn btn-primary">Create Unlocked PDF <span className="btn-arrow">&rarr;</span></button></div>}
            </div>
          )}

          {status === "done" && downloadUrl && (
            <div className="fade-in-up" style={{ border: "2px solid var(--border)", padding: "clamp(24px, 4vw, 32px)" }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.45, marginBottom: 8 }}>Ready to download</p>
              <p style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 800, color: "var(--red)", lineHeight: 1, marginBottom: 24 }}>{formatBytes(outputSize)} · No password</p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}><a href={downloadUrl} download={downloadName} className="btn btn-primary">Download Unlocked PDF <span className="btn-arrow">&darr;</span></a><button type="button" onClick={reset} className="btn">Unlock another PDF</button></div>
            </div>
          )}

          {status === "error" && !file && <div style={{ marginTop: 20, borderLeft: "4px solid var(--red)", paddingLeft: 20 }}><p style={{ color: "var(--red)", fontSize: 13, fontWeight: 600 }}>{errorMsg}</p><button type="button" onClick={reset} className="btn" style={{ marginTop: 16 }}>Start over</button></div>}
        </div>
        <ToolEditorial toolName="Unlock PDF" {...toolEditorialData["unlock-pdf"]} />
      </section>
      <SiteFooter />
    </main>
  );
}
