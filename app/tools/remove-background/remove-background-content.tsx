"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";

const MAX_SIZE = 20 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

type Status = "idle" | "loading-model" | "processing" | "done" | "error";

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export default function RemoveBackgroundContent() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [view, setView] = useState<"result" | "original">("result");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-fast").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, []);

  function handleFile(f: File | null) {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setErrorMsg("Please choose a JPG, PNG, or WebP image.");
      setStatus("error");
      return;
    }
    if (f.size > MAX_SIZE) {
      setErrorMsg("Image must be under 20 MB.");
      setStatus("error");
      return;
    }
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(f);
    setOriginalUrl(URL.createObjectURL(f));
    setResultUrl(null);
    setStatus("idle");
    setErrorMsg("");
    setProgress("");
    setView("result");
  }

  async function process() {
    if (!file) return;
    setStatus("loading-model");
    setProgress("Downloading AI model… (first time only, ~50 MB)");
    setErrorMsg("");

    try {
      const { removeBackground } = await import("@imgly/background-removal");

      setStatus("processing");
      setProgress("Removing background…");

      const resultBlob = await removeBackground(file, {
        debug: false,
        progress: (key: string, current: number, total: number) => {
          if (key.includes("fetch") || key.includes("load")) {
            const pct = total > 0 ? Math.round((current / total) * 100) : 0;
            setProgress(`Loading model… ${pct}%`);
          } else if (key.includes("compute") || key.includes("inference")) {
            setProgress("Running AI inference…");
          }
        },
        output: {
          format: "image/png" as const,
          quality: 1,
        },
      });

      setResultUrl(URL.createObjectURL(resultBlob));
      setStatus("done");
      setProgress("");
    } catch (err) {
      console.error("[remove-bg]", err);
      setErrorMsg("Background removal failed. Try a different image.");
      setStatus("error");
      setProgress("");
    }
  }

  function reset() {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setStatus("idle");
    setErrorMsg("");
    setProgress("");
  }

  const isProcessing = status === "loading-model" || status === "processing";

  return (
    <main className="noise" style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}>
      <SiteHeader active="Tools" />

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}>
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Image Tools / Remove Background
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>AI runs in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Remove Background</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Instantly cut out any background using AI. Supports people, products, and objects. Nothing is uploaded — the AI model runs right in your browser.
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
              <div style={{ width: 56, height: 56, border: "2px solid #201e1d", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" }}>IMG</div>
              <p style={{ fontSize: "clamp(17px, 2.2vw, 22px)", fontWeight: 700, marginBottom: 8 }}>Drag & drop your image here</p>
              <p style={{ fontSize: 14, opacity: 0.55 }}>or click to browse — JPG, PNG, WebP · up to 20 MB</p>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            </div>
          )}

          {/* Image loaded — ready to process */}
          {file && originalUrl && status === "idle" && (
            <div className="fade-in-up">
              <div style={{ position: "relative", marginBottom: 20 }}>
                <img src={originalUrl} alt="Original" style={{ width: "100%", maxHeight: 480, objectFit: "contain", border: "2px solid #201e1d", display: "block" }} />
                <div style={{ position: "absolute", top: 10, left: 10, background: "#201e1d", color: "#f3f2f2", fontSize: 10, fontWeight: 800, padding: "4px 10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Original</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <button type="button" onClick={process} className="btn btn-primary">Remove Background</button>
                <button type="button" onClick={reset} className="ink-hover" style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.5, fontFamily: "inherit", cursor: "pointer" }}>Choose another</button>
              </div>
              <p style={{ marginTop: 10, fontSize: 13, opacity: 0.45 }}>{file.name} · {formatBytes(file.size)}</p>
            </div>
          )}

          {/* Processing */}
          {isProcessing && (
            <div className="fade-in-up">
              {originalUrl && (
                <img src={originalUrl} alt="Original" style={{ width: "100%", maxHeight: 480, objectFit: "contain", border: "2px solid #201e1d", display: "block", marginBottom: 20, opacity: 0.5 }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="pulse-dot" />
                <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.7 }}>{progress || "Processing…"}</span>
              </div>
              <p style={{ marginTop: 8, fontSize: 12, opacity: 0.4 }}>
                {status === "loading-model" ? "The AI model (~50 MB) is downloaded once and cached in your browser." : "This may take a few seconds depending on image size."}
              </p>
            </div>
          )}

          {/* Done */}
          {status === "done" && resultUrl && originalUrl && (
            <div className="fade-in-up">
              {/* Toggle tabs */}
              <div style={{ display: "flex", gap: 0, marginBottom: 0 }}>
                {(["result", "original"] as const).map((v) => (
                  <button
                    key={v} type="button" onClick={() => setView(v)}
                    style={{ padding: "10px 20px", border: "2px solid #201e1d", borderBottom: view === v ? `2px solid #f3f2f2` : "2px solid #201e1d", background: view === v ? "#201e1d" : "transparent", color: view === v ? "#f3f2f2" : "#201e1d", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-archivo)", marginBottom: view === v ? -2 : 0, position: "relative", zIndex: view === v ? 1 : 0, cursor: "pointer" }}
                  >{v === "result" ? "Result" : "Original"}</button>
                ))}
              </div>

              {/* Image display */}
              <div style={{ border: "2px solid #201e1d", borderTop: "none", position: "relative" }}>
                {view === "result" ? (
                  /* Checkerboard background to show transparency */
                  <div style={{
                    backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                    backgroundColor: "#fff",
                  }}>
                    <img src={resultUrl} alt="Background removed" style={{ width: "100%", maxHeight: 480, objectFit: "contain", display: "block" }} />
                  </div>
                ) : (
                  <img src={originalUrl} alt="Original" style={{ width: "100%", maxHeight: 480, objectFit: "contain", display: "block" }} />
                )}
              </div>

              <div style={{ marginTop: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a
                  href={resultUrl}
                  download={file?.name.replace(/\.[^.]+$/, "") + "_no_bg.png"}
                  className="btn btn-primary"
                >
                  Download PNG <span className="btn-arrow">&darr;</span>
                </a>
                <button type="button" onClick={reset} className="btn">Try another image</button>
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

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            The AI model (by img.ly) is downloaded once from a CDN and cached in your browser. After that, all processing happens locally using ONNX Runtime — your images never leave your device. The result is exported as a transparent PNG.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
