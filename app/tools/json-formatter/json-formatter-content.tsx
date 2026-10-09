"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

const SAMPLE = `{"name":"Daliy.Tools","type":"Toolbox","features":["JSON Formatter","Markdown Viewer","Image Compressor"],"active":true}`;

export default function JsonFormatterContent() {
  const [json, setJson] = useState(SAMPLE);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  function format() {
    try {
      setJson(JSON.stringify(JSON.parse(json), null, 2));
      setError(null);
    } catch {
      setError("Invalid JSON — check for missing commas, quotes, or brackets.");
    }
  }

  function minify() {
    try {
      setJson(JSON.stringify(JSON.parse(json)));
      setError(null);
    } catch {
      setError("Invalid JSON — check for missing commas, quotes, or brackets.");
    }
  }

  function copy() {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  function clear() {
    setJson("");
    setError(null);
  }

  return (
    <main
      className="noise"
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
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
          <Link href="/tools" className="ink-hover">All Tools</Link> / Developer Tools / JSON Formatter
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "var(--on-solid)", background: "var(--red)", padding: "6px 14px", textTransform: "uppercase" }}>
              Live
            </span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>
              Runs entirely in your browser
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            JSON Formatter
          </h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Paste raw JSON below and hit Format to beautify it, or Minify to compact it. Nothing leaves your browser.
          </p>
        </div>

        <div className="fade-in-up" style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <button type="button" onClick={format} className="btn btn-primary" style={{ padding: "10px 22px", fontSize: 13 }}>
              Format
            </button>
            <button type="button" onClick={minify} className="btn" style={{ padding: "10px 22px", fontSize: 13 }}>
              Minify
            </button>
            <button type="button" onClick={copy} className="btn" style={{ padding: "10px 22px", fontSize: 13 }}>
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              type="button"
              onClick={clear}
              className="ink-hover"
              style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.45, fontFamily: "inherit", marginLeft: "auto" }}
            >
              Clear
            </button>
          </div>

          {error && (
            <div style={{ borderLeft: "4px solid var(--red)", paddingLeft: 16, marginBottom: 12 }}>
              <p style={{ fontSize: 14, color: "var(--red)", fontWeight: 600 }}>{error}</p>
            </div>
          )}

          <p className="tool-output-note">Formatting parses and rewrites the data. Duplicate keys collapse and large integers can lose precision. Keep the original for signed payloads or exact numeric data. <Link href="/blogs/json-formatting-validation-and-data-loss">See examples and limitations</Link>.</p>
          <textarea
            value={json}
            onChange={(e) => { setJson(e.target.value); setError(null); }}
            spellCheck={false}
            style={{
              width: "100%",
              minHeight: 400,
              border: `2px solid ${error ? "var(--red)" : "var(--border)"}`,
              background: "transparent",
              color: "var(--ink)",
              fontFamily: "monospace",
              fontSize: 13,
              lineHeight: 1.65,
              padding: 20,
              resize: "vertical",
              outline: "none",
              transition: "border-color 0.2s ease",
            }}
            placeholder='Paste JSON here…'
          />
        </div>

        <ToolEditorial
          toolName="JSON Formatter"
          {...toolEditorialData["json-formatter"]}
        />
      </section>

      <SiteFooter />
    </main>
  );
}
