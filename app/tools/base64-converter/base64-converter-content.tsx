"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

type Tab = "base64" | "url" | "html";

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64(base64: string): string {
  const binary = atob(base64.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function htmlEncode(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlDecode(value: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(value, "text/html");
  return doc.documentElement.textContent ?? "";
}

export default function Base64ConverterContent() {
  const [tab, setTab] = useState<Tab>("base64");
  const [input, setInput] = useState("Hello from Daliy.Tools");
  const [output, setOutput] = useState("");
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

  const tabDescription = useMemo(() => {
    if (tab === "base64") return "Convert plain text to Base64 and back.";
    if (tab === "url") return "Encode or decode URL-safe strings.";
    return "Encode or decode HTML entities.";
  }, [tab]);

  function runEncode() {
    try {
      setError(null);
      if (tab === "base64") setOutput(encodeBase64(input));
      if (tab === "url") setOutput(encodeURIComponent(input));
      if (tab === "html") setOutput(htmlEncode(input));
    } catch {
      setError("Could not encode input.");
    }
  }

  function runDecode() {
    try {
      setError(null);
      if (tab === "base64") setOutput(decodeBase64(input));
      if (tab === "url") setOutput(decodeURIComponent(input));
      if (tab === "html") setOutput(htmlDecode(input));
    } catch {
      setError("Could not decode input. Check the source format.");
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <main className="noise" style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}>
      <SiteHeader active="Tools" />

      <section style={{ maxWidth: 980, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}>
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Developer Tools / Base64 Converter
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "var(--on-solid)", background: "var(--red)", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Base64, URL, and HTML entities</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Base64 / URL / HTML Converter</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 700 }}>{tabDescription}</p>
        </div>

        <div className="fade-in-up" style={{ marginTop: "clamp(36px, 6vw, 56px)" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <button className={tab === "base64" ? "btn btn-primary" : "btn"} onClick={() => { setTab("base64"); setError(null); }} type="button">Base64</button>
            <button className={tab === "url" ? "btn btn-primary" : "btn"} onClick={() => { setTab("url"); setError(null); }} type="button">URL</button>
            <button className={tab === "html" ? "btn btn-primary" : "btn"} onClick={() => { setTab("html"); setError(null); }} type="button">HTML</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} placeholder="Input" style={{ width: "100%", minHeight: 150, border: "2px solid var(--border)", background: "transparent", color: "var(--ink)", fontFamily: "monospace", fontSize: 13, lineHeight: 1.65, padding: 16, resize: "vertical", outline: "none" }} />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" onClick={runEncode} className="btn btn-primary">Encode</button>
              <button type="button" onClick={runDecode} className="btn">Decode</button>
              <button type="button" onClick={() => { setInput(""); setOutput(""); setError(null); }} className="btn">Clear</button>
              <button type="button" onClick={copyOutput} className="btn" disabled={!output}>{copied ? "Copied" : "Copy output"}</button>
            </div>

            {error && <p style={{ color: "var(--red)", fontWeight: 600, fontSize: 13 }}>{error}</p>}

            <textarea value={output} onChange={(event) => setOutput(event.target.value)} spellCheck={false} placeholder="Output" style={{ width: "100%", minHeight: 150, border: "2px solid var(--border)", background: "transparent", color: "var(--ink)", fontFamily: "monospace", fontSize: 13, lineHeight: 1.65, padding: 16, resize: "vertical", outline: "none" }} />
          </div>
        </div>
        <ToolEditorial toolName="Base64 / URL / HTML Converter" {...toolEditorialData["base64-converter"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
