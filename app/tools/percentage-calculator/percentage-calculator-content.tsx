"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolAdRail from "../../_components/tool-ad-rail";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

type Mode = "whatIsXofY" | "xIsWhatPctOfY" | "xIsYPctOfWhat" | "pctChange" | "pctDifference";

const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: "whatIsXofY",       label: "What is X% of Y?",         desc: "e.g. What is 20% of 150?" },
  { key: "xIsWhatPctOfY",    label: "X is what % of Y?",        desc: "e.g. 30 is what % of 150?" },
  { key: "xIsYPctOfWhat",    label: "X is Y% of what?",         desc: "e.g. 30 is 20% of what?" },
  { key: "pctChange",        label: "% change from X to Y",     desc: "e.g. from 80 to 100?" },
  { key: "pctDifference",    label: "% difference between X & Y", desc: "e.g. between 80 and 100?" },
];

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return (n / 1e6).toFixed(2) + "M";
  const s = parseFloat(n.toPrecision(10)).toString();
  return s;
}

function calculate(mode: Mode, a: number, b: number): { result: string; explanation: string } | null {
  if (isNaN(a) || isNaN(b)) return null;

  switch (mode) {
    case "whatIsXofY": {
      const r = (a / 100) * b;
      return { result: fmt(r), explanation: `${a}% of ${b} = ${fmt(r)}` };
    }
    case "xIsWhatPctOfY": {
      if (b === 0) return { result: "—", explanation: "Cannot divide by zero" };
      const r = (a / b) * 100;
      return { result: fmt(r) + "%", explanation: `${a} is ${fmt(r)}% of ${b}` };
    }
    case "xIsYPctOfWhat": {
      if (b === 0) return { result: "—", explanation: "Cannot divide by zero" };
      const r = (a / b) * 100;
      return { result: fmt(r), explanation: `${a} is ${b}% of ${fmt(r)}` };
    }
    case "pctChange": {
      if (a === 0) return { result: "—", explanation: "Cannot calculate % change from zero" };
      const r = ((b - a) / Math.abs(a)) * 100;
      const dir = r >= 0 ? "increase" : "decrease";
      return { result: (r >= 0 ? "+" : "") + fmt(r) + "%", explanation: `${a} → ${b} is a ${fmt(Math.abs(r))}% ${dir}` };
    }
    case "pctDifference": {
      const avg = (Math.abs(a) + Math.abs(b)) / 2;
      if (avg === 0) return { result: "—", explanation: "Cannot calculate when both values are zero" };
      const r = (Math.abs(a - b) / avg) * 100;
      return { result: fmt(r) + "%", explanation: `The % difference between ${a} and ${b} is ${fmt(r)}%` };
    }
  }
}

const LABEL_A: Record<Mode, string> = {
  whatIsXofY: "Percentage (%)",
  xIsWhatPctOfY: "Value (X)",
  xIsYPctOfWhat: "Value (X)",
  pctChange: "From value",
  pctDifference: "First value",
};

const LABEL_B: Record<Mode, string> = {
  whatIsXofY: "Of value",
  xIsWhatPctOfY: "Total value (Y)",
  xIsYPctOfWhat: "Percentage (%)",
  pctChange: "To value",
  pctDifference: "Second value",
};

export default function PercentageCalculatorContent() {
  const [mode, setMode] = useState<Mode>("whatIsXofY");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
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

  const result = calculate(mode, parseFloat(a), parseFloat(b));

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <Link href="/tools" className="ink-hover">All Tools</Link> / Calculators & Converters / Percentage Calculator
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Percentage Calculator</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Work out percentages without the mental math. Five calculation modes — results update instantly as you type.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }} className="fade-in-up">

          {/* Mode selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {MODES.map(({ key, label, desc }) => (
              <button
                key={key}
                type="button"
                onClick={() => { setMode(key); setA(""); setB(""); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 20px",
                  border: `2px solid ${mode === key ? "#201e1d" : "#c8c6c5"}`,
                  background: mode === key ? "#201e1d" : "transparent",
                  color: mode === key ? "#f3f2f2" : "#201e1d",
                  fontFamily: "var(--font-archivo)",
                  fontWeight: 700,
                  fontSize: "clamp(13px, 1.5vw, 15px)",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  opacity: mode === key ? 1 : 0.6,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <span>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.6 }}>{desc}</span>
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div style={{ border: "2px solid #201e1d", padding: "clamp(20px, 3vw, 28px)", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 8 }}>
                  {LABEL_A[mode]}
                </label>
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  placeholder="0"
                  style={{
                    width: "100%",
                    border: "2px solid #201e1d",
                    background: "transparent",
                    color: "#201e1d",
                    fontFamily: "var(--font-archivo)",
                    fontSize: 18,
                    fontWeight: 700,
                    padding: "14px 18px",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 8 }}>
                  {LABEL_B[mode]}
                </label>
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  placeholder="0"
                  style={{
                    width: "100%",
                    border: "2px solid #201e1d",
                    background: "transparent",
                    color: "#201e1d",
                    fontFamily: "var(--font-archivo)",
                    fontSize: 18,
                    fontWeight: 700,
                    padding: "14px 18px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Result */}
            {result && a && b && (
              <div style={{ borderTop: "2px solid #201e1d", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, marginBottom: 6 }}>Result</p>
                  <p style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#ec3013" }}>
                    {result.result}
                  </p>
                  <p style={{ fontSize: 14, opacity: 0.55, marginTop: 4 }}>{result.explanation}</p>
                </div>
                <button type="button" onClick={copy} className="btn btn-primary" style={{ fontSize: 13, padding: "10px 20px", flexShrink: 0 }}>
                  {copied ? "Copied!" : "Copy result"}
                </button>
              </div>
            )}
          </div>
        </div>

        <ToolEditorial
          toolName="Percentage Calculator"
          {...toolEditorialData["percentage-calculator"]}
        />
      </section>

              <ToolAdRail />
      </div>

      <SiteFooter />
    </main>
  );
}
