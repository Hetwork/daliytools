"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolAdRail from "../../_components/tool-ad-rail";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "screaming_snake"
  | "kebab"
  | "dot"
  | "alternating"
  | "inverse";

function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[-_./]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function convert(text: string, type: CaseType): string {
  if (!text) return "";

  switch (type) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text
        .toLowerCase()
        .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
    case "camel": {
      const words = toWords(text.toLowerCase());
      return words[0] + words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
    }
    case "pascal":
      return toWords(text.toLowerCase()).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
    case "snake":
      return toWords(text).join("_").toLowerCase();
    case "screaming_snake":
      return toWords(text).join("_").toUpperCase();
    case "kebab":
      return toWords(text).join("-").toLowerCase();
    case "dot":
      return toWords(text).join(".").toLowerCase();
    case "alternating":
      return text.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("");
    case "inverse":
      return text.split("").map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
  }
}

const CASES: { key: CaseType; label: string; example: string }[] = [
  { key: "upper",          label: "UPPERCASE",       example: "HELLO WORLD" },
  { key: "lower",          label: "lowercase",       example: "hello world" },
  { key: "title",          label: "Title Case",      example: "Hello World" },
  { key: "sentence",       label: "Sentence case",   example: "Hello world" },
  { key: "camel",          label: "camelCase",       example: "helloWorld" },
  { key: "pascal",         label: "PascalCase",      example: "HelloWorld" },
  { key: "snake",          label: "snake_case",      example: "hello_world" },
  { key: "screaming_snake",label: "SCREAMING_SNAKE", example: "HELLO_WORLD" },
  { key: "kebab",          label: "kebab-case",      example: "hello-world" },
  { key: "dot",            label: "dot.case",        example: "hello.world" },
  { key: "alternating",    label: "aLtErNaTiNg",     example: "hElLo wOrLd" },
  { key: "inverse",        label: "iNVERSE",         example: "HELLO WORLD → hELLO wORLD" },
];

export default function CaseConverterContent() {
  const [input, setInput] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>("upper");
  const [copied, setCopied] = useState<CaseType | null>(null);

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

  const output = convert(input, activeCase);

  async function copyResult(key: CaseType) {
    const result = convert(input, key);
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
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
          <Link href="/tools" className="ink-hover">All Tools</Link> / Text Tools / Case Converter
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Case Converter</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Flip text between UPPER, lower, Title Case, camelCase, snake_case, and more — click any format to convert and copy instantly.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }} className="fade-in-up">

          {/* Input */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 8 }}>
              Your text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste text here…"
              rows={6}
              style={{
                width: "100%",
                border: "2px solid #201e1d",
                background: "transparent",
                color: "#201e1d",
                fontFamily: "var(--font-archivo)",
                fontSize: "clamp(14px, 1.6vw, 16px)",
                fontWeight: 400,
                lineHeight: 1.75,
                padding: "clamp(14px, 2vw, 20px)",
                outline: "none",
                resize: "vertical",
                display: "block",
              }}
            />
          </div>

          {/* Case buttons grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
            {CASES.map(({ key, label, example }) => {
              const isActive = activeCase === key;
              const result = convert(input, key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveCase(key);
                    if (input) copyResult(key);
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 4,
                    padding: "14px 16px",
                    border: `2px solid ${isActive ? "#201e1d" : "#c8c6c5"}`,
                    background: isActive ? "#201e1d" : "transparent",
                    color: isActive ? "#f3f2f2" : "#201e1d",
                    fontFamily: "var(--font-archivo)",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "#201e1d"; e.currentTarget.style.background = "rgba(32,30,29,0.05)"; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "#c8c6c5"; e.currentTarget.style.background = "transparent"; } }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.55 }}>{label}</span>
                  <span style={{
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: input ? "var(--font-archivo)" : "monospace",
                    wordBreak: "break-all",
                    opacity: input ? 1 : 0.35,
                  }}>
                    {input ? (result.length > 60 ? result.slice(0, 60) + "…" : result) : example}
                  </span>
                  {copied === key && (
                    <span style={{
                      position: "absolute",
                      top: 8,
                      right: 10,
                      fontSize: 11,
                      fontWeight: 800,
                      color: isActive ? "#f3f2f2" : "#ec3013",
                      letterSpacing: "0.06em",
                    }}>
                      COPIED
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Output preview */}
          {input && output && (
            <div style={{ marginTop: 20, border: "2px solid #201e1d", padding: "clamp(16px, 2.5vw, 24px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4 }}>
                  {CASES.find((c) => c.key === activeCase)?.label} — full output
                </p>
                <button
                  type="button"
                  onClick={() => copyResult(activeCase)}
                  className="btn btn-primary"
                  style={{ fontSize: 12, padding: "8px 16px" }}
                >
                  {copied === activeCase ? "Copied!" : "Copy"}
                </button>
              </div>
              <p style={{
                fontSize: "clamp(14px, 1.6vw, 16px)",
                lineHeight: 1.75,
                wordBreak: "break-all",
                fontFamily: ["camel","pascal","snake","screaming_snake","kebab","dot"].includes(activeCase) ? "monospace" : "inherit",
              }}>
                {output}
              </p>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            Each case conversion first tokenises your input into words — splitting on spaces, hyphens, underscores, dots, and camelCase boundaries — then joins them with the appropriate separator and applies capitalisation rules. Click any format card to select it and instantly copy the converted result to your clipboard. Everything runs in your browser.
          </p>
        </div>
        <ToolEditorial toolName="Case Converter" {...toolEditorialData["case-converter"]} />
      </section>

              <ToolAdRail />
      </div>

      <SiteFooter />
    </main>
  );
}
