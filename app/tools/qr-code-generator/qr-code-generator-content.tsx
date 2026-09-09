"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolAdRail from "../../_components/tool-ad-rail";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

const ERROR_LEVELS = ["L", "M", "Q", "H"] as const;
type ECC = (typeof ERROR_LEVELS)[number];

export default function QrCodeGeneratorContent() {
  const [text, setText] = useState("https://daliy.tools");
  const [size, setSize] = useState(256);
  const [ecc, setEcc] = useState<ECC>("M");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  async function generate() {
    if (!text.trim() || !canvasRef.current) return;
    const QRCode = (await import("qrcode")).default;
    await QRCode.toCanvas(canvasRef.current, text.trim(), {
      width: size,
      margin: 2,
      errorCorrectionLevel: ecc,
      color: { dark: "#201e1d", light: "#f3f2f2" },
    });
    setGenerated(true);
  }

  function download() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/png");
    link.download = "qrcode.png";
    link.click();
  }

  async function copyImage() {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
          <Link href="/tools" className="ink-hover">All Tools</Link> / Generators / QR Code Generator
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>QR Code Generator</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Turn any link or text into a scannable QR code. Customize the size and error correction, then download as PNG.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "start", flexWrap: "wrap" }}
          className="fade-in-up">

          {/* Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>
                URL or Text
              </label>
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setGenerated(false); }}
                rows={4}
                placeholder="https://example.com"
                style={{
                  width: "100%",
                  border: "2px solid #201e1d",
                  background: "transparent",
                  color: "#201e1d",
                  fontFamily: "var(--font-archivo)",
                  fontSize: 15,
                  fontWeight: 500,
                  padding: "14px 18px",
                  outline: "none",
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45 }}>Size</label>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#ec3013" }}>{size}px</span>
                </div>
                <input
                  type="range" min={128} max={512} step={32} value={size}
                  onChange={(e) => { setSize(Number(e.target.value)); setGenerated(false); }}
                  style={{ width: "100%", accentColor: "#ec3013" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.4, marginTop: 4 }}>
                  <span>128px</span><span>512px</span>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 8 }}>
                  Error Correction
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                  {ERROR_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => { setEcc(level); setGenerated(false); }}
                      style={{
                        padding: "8px 4px",
                        border: "2px solid #201e1d",
                        background: ecc === level ? "#201e1d" : "transparent",
                        color: ecc === level ? "#f3f2f2" : "#201e1d",
                        fontFamily: "var(--font-archivo)",
                        fontWeight: 700,
                        fontSize: 12,
                        transition: "background 0.15s ease, color 0.15s ease",
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 11, opacity: 0.4, marginTop: 6 }}>L=Low · M=Med · Q=High · H=Max</p>
              </div>
            </div>

            <button
              type="button"
              onClick={generate}
              disabled={!text.trim()}
              className="btn btn-primary"
              style={{ alignSelf: "flex-start" }}
            >
              Generate QR Code
            </button>
          </div>

          {/* Preview */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, minWidth: 220 }}>
            <div
              style={{
                border: "2px solid #201e1d",
                padding: 12,
                background: "#f3f2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 200,
                minHeight: 200,
              }}
            >
              {!generated && (
                <p style={{ fontSize: 12, opacity: 0.35, fontWeight: 600, textAlign: "center", padding: "32px 16px" }}>
                  Your QR code<br />will appear here
                </p>
              )}
              <canvas ref={canvasRef} style={{ display: generated ? "block" : "none", maxWidth: "100%" }} />
            </div>

            {generated && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <button type="button" onClick={download} className="btn btn-primary" style={{ fontSize: 12, padding: "10px 16px" }}>
                  Download PNG &darr;
                </button>
                <button
                  type="button"
                  onClick={copyImage}
                  className="ink-hover"
                  style={{ fontSize: 12, fontWeight: 700, padding: "10px 16px", border: "2px solid #201e1d", background: "transparent", fontFamily: "inherit" }}
                >
                  {copied ? "Copied!" : "Copy Image"}
                </button>
              </div>
            )}
          </div>
        </div>

        <ToolEditorial
          toolName="QR Code Generator"
          {...toolEditorialData["qr-code-generator"]}
        />
      </section>

              <ToolAdRail />
      </div>

      <SiteFooter />
    </main>
  );
}
