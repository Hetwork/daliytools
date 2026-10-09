"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

function normalizeHex(value: string): string {
  const clean = value.trim().replace("#", "").toLowerCase();
  if (/^[0-9a-f]{3}$/.test(clean)) {
    return `#${clean[0]}${clean[0]}${clean[1]}${clean[1]}${clean[2]}${clean[2]}`;
  }
  if (/^[0-9a-f]{6}$/.test(clean)) return `#${clean}`;
  return "";
}

function hexToRgb(hex: string): [number, number, number] | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  return [
    parseInt(normalized.slice(1, 3), 16),
    parseInt(normalized.slice(3, 5), 16),
    parseInt(normalized.slice(5, 7), 16),
  ];
}

function luminance([r, g, b]: [number, number, number]): number {
  const toLinear = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(foreground: [number, number, number], background: [number, number, number]): number {
  const l1 = luminance(foreground);
  const l2 = luminance(background);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

function passBadge(pass: boolean): string {
  return pass ? "PASS" : "FAIL";
}

export default function ContrastCheckerContent() {
  const [foreground, setForeground] = useState("#201e1d");
  const [background, setBackground] = useState("#f3f2f2");
  const [previewText, setPreviewText] = useState("Design for readability.");

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

  const analysis = useMemo(() => {
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);
    if (!fg || !bg) {
      return { valid: false, ratio: 1, aaNormal: false, aaLarge: false, aaaNormal: false, aaaLarge: false };
    }

    const ratio = contrastRatio(fg, bg);
    return {
      valid: true,
      ratio,
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaNormal: ratio >= 7,
      aaaLarge: ratio >= 4.5,
    };
  }, [foreground, background]);

  return (
    <main className="noise" style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}>
      <SiteHeader active="Tools" />

      <section style={{ maxWidth: 980, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}>
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Developer Tools / WCAG Contrast Checker
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "var(--on-solid)", background: "var(--red)", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>WCAG 2.1 AA and AAA checks</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>WCAG Contrast Checker</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 700 }}>
            Check foreground and background color combinations for readability standards across normal and large text.
          </p>
        </div>

        <div className="fade-in-up" style={{ marginTop: "clamp(36px, 6vw, 56px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          <div style={{ border: "2px solid var(--border)", padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Foreground</p>
            <div style={{ display: "flex", gap: 10 }}>
              <input type="color" value={normalizeHex(foreground) || "#000000"} onChange={(event) => setForeground(event.target.value)} style={{ width: 56, height: 44, border: "2px solid var(--border)", background: "none" }} />
              <input value={foreground} onChange={(event) => setForeground(event.target.value)} placeholder="#201e1d" style={{ flex: 1, border: "2px solid var(--border)", background: "transparent", color: "var(--ink)", padding: "10px 12px", fontFamily: "monospace", fontSize: 13 }} />
            </div>
          </div>

          <div style={{ border: "2px solid var(--border)", padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Background</p>
            <div style={{ display: "flex", gap: 10 }}>
              <input type="color" value={normalizeHex(background) || "#ffffff"} onChange={(event) => setBackground(event.target.value)} style={{ width: 56, height: 44, border: "2px solid var(--border)", background: "none" }} />
              <input value={background} onChange={(event) => setBackground(event.target.value)} placeholder="#f3f2f2" style={{ flex: 1, border: "2px solid var(--border)", background: "transparent", color: "var(--ink)", padding: "10px 12px", fontFamily: "monospace", fontSize: 13 }} />
            </div>
          </div>
        </div>

        <div className="fade-in-up" style={{ marginTop: 16, border: "2px solid var(--border)", background: normalizeHex(background) || "var(--bg)", padding: "clamp(20px, 3vw, 30px)" }}>
          <textarea
            value={previewText}
            onChange={(event) => setPreviewText(event.target.value)}
            style={{ width: "100%", minHeight: 100, border: "2px solid var(--border)", background: "transparent", color: normalizeHex(foreground) || "var(--ink)", padding: 14, fontFamily: "inherit", fontSize: 20, lineHeight: 1.45 }}
          />
          <p style={{ marginTop: 10, color: normalizeHex(foreground) || "var(--ink)", opacity: 0.75 }}>
            Large text preview 18px+ with your selected pair.
          </p>
        </div>

        <div className="fade-in-up" style={{ marginTop: 16, border: "2px solid var(--border)", padding: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 12 }}>Results</p>
          {analysis.valid ? (
            <>
              <p style={{ fontSize: 20, fontWeight: 800, marginBottom: 14 }}>Contrast Ratio: {analysis.ratio.toFixed(2)}:1</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                <div style={{ border: "1px solid var(--border)", padding: 10 }}><strong>AA Normal</strong>: {passBadge(analysis.aaNormal)}</div>
                <div style={{ border: "1px solid var(--border)", padding: 10 }}><strong>AA Large</strong>: {passBadge(analysis.aaLarge)}</div>
                <div style={{ border: "1px solid var(--border)", padding: 10 }}><strong>AAA Normal</strong>: {passBadge(analysis.aaaNormal)}</div>
                <div style={{ border: "1px solid var(--border)", padding: 10 }}><strong>AAA Large</strong>: {passBadge(analysis.aaaLarge)}</div>
              </div>
            </>
          ) : (
            <p style={{ color: "var(--red)", fontWeight: 600 }}>Enter valid HEX colors, for example #111111 and #ffffff.</p>
          )}
        </div>
        <ToolEditorial toolName="WCAG Contrast Checker" {...toolEditorialData["contrast-checker"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
