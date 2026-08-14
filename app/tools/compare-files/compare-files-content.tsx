"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";

type DiffType = "equal" | "added" | "removed";
interface DiffLine { type: DiffType; text: string; leftNum: number | null; rightNum: number | null }

function computeDiff(left: string, right: string): DiffLine[] {
  const L = left.split("\n");
  const R = right.split("\n");
  const m = L.length;
  const n = R.length;

  // LCS dp
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = L[i] === R[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0, j = 0;
  let leftNum = 1, rightNum = 1;

  while (i < m || j < n) {
    if (i < m && j < n && L[i] === R[j]) {
      result.push({ type: "equal", text: L[i], leftNum: leftNum++, rightNum: rightNum++ });
      i++; j++;
    } else if (j < n && (i >= m || dp[i][j + 1] >= dp[i + 1][j])) {
      result.push({ type: "added", text: R[j], leftNum: null, rightNum: rightNum++ });
      j++;
    } else {
      result.push({ type: "removed", text: L[i], leftNum: leftNum++, rightNum: null });
      i++;
    }
  }
  return result;
}

const SAMPLE_LEFT = `The quick brown fox jumps over the lazy dog.
Pack my box with five dozen liquor jugs.
How vexingly quick daft zebras jump.
The five boxing wizards jump quickly.`;

const SAMPLE_RIGHT = `The quick brown fox leaps over the lazy dog.
Pack my box with five dozen liquor jugs.
How vexingly quick daft zebras jump!
A new line added here for comparison.
The five boxing wizards jump quickly.`;

const BG: Record<DiffType, string> = {
  equal:   "transparent",
  added:   "rgba(45, 138, 78, 0.10)",
  removed: "rgba(236, 48, 19, 0.10)",
};

const BORDER: Record<DiffType, string> = {
  equal:   "transparent",
  added:   "#2d8a4e",
  removed: "#ec3013",
};

const PREFIX: Record<DiffType, string> = {
  equal:   " ",
  added:   "+",
  removed: "−",
};

const COLOR: Record<DiffType, string> = {
  equal:   "inherit",
  added:   "#2d8a4e",
  removed: "#ec3013",
};

export default function CompareFilesContent() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [onlyChanges, setOnlyChanges] = useState(false);

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

  const diff = showDiff ? computeDiff(left, right) : [];
  const visibleLines = onlyChanges ? diff.filter((l) => l.type !== "equal") : diff;
  const added   = diff.filter((l) => l.type === "added").length;
  const removed = diff.filter((l) => l.type === "removed").length;

  function loadSample() {
    setLeft(SAMPLE_LEFT);
    setRight(SAMPLE_RIGHT);
    setShowDiff(false);
  }

  return (
    <main
      className="noise"
      style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}
    >
      <SiteHeader active="Tools" />

      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}
      >
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Text Tools / Compare Two Files
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Compare Two Files</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Spot the differences between two documents with line-by-line diff highlighting.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }} className="fade-in-up">

          {/* Input panes */}
          {!showDiff && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45 }}>
                      Original (A)
                    </label>
                    <span style={{ fontSize: 11, opacity: 0.35 }}>{left.split("\n").length} lines</span>
                  </div>
                  <textarea
                    value={left}
                    onChange={(e) => setLeft(e.target.value)}
                    placeholder="Paste original text here…"
                    rows={16}
                    style={{
                      width: "100%",
                      border: "2px solid #201e1d",
                      background: "transparent",
                      color: "#201e1d",
                      fontFamily: "monospace",
                      fontSize: 13,
                      lineHeight: 1.7,
                      padding: "14px 16px",
                      outline: "none",
                      resize: "vertical",
                      display: "block",
                    }}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45 }}>
                      Modified (B)
                    </label>
                    <span style={{ fontSize: 11, opacity: 0.35 }}>{right.split("\n").length} lines</span>
                  </div>
                  <textarea
                    value={right}
                    onChange={(e) => setRight(e.target.value)}
                    placeholder="Paste modified text here…"
                    rows={16}
                    style={{
                      width: "100%",
                      border: "2px solid #201e1d",
                      background: "transparent",
                      color: "#201e1d",
                      fontFamily: "monospace",
                      fontSize: 13,
                      lineHeight: 1.7,
                      padding: "14px 16px",
                      outline: "none",
                      resize: "vertical",
                      display: "block",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setShowDiff(true)}
                  disabled={!left && !right}
                  className="btn btn-primary"
                >
                  Compare →
                </button>
                <button
                  type="button"
                  onClick={loadSample}
                  style={{
                    padding: "10px 18px",
                    border: "2px solid #201e1d",
                    background: "transparent",
                    fontFamily: "var(--font-archivo)",
                    fontWeight: 700,
                    fontSize: 13,
                    transition: "background 0.15s ease, color 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#201e1d"; e.currentTarget.style.color = "#f3f2f2"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#201e1d"; }}
                >
                  Load sample
                </button>
              </div>
            </>
          )}

          {/* Diff output */}
          {showDiff && (
            <>
              {/* Summary bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#2d8a4e" }}>+{added} added</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#ec3013" }}>−{removed} removed</span>
                  {added === 0 && removed === 0 && (
                    <span style={{ fontSize: 13, fontWeight: 800, opacity: 0.5 }}>Files are identical</span>
                  )}
                </div>

                <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setOnlyChanges(!onlyChanges)}
                    style={{
                      padding: "7px 14px",
                      border: "2px solid #201e1d",
                      background: onlyChanges ? "#201e1d" : "transparent",
                      color: onlyChanges ? "#f3f2f2" : "#201e1d",
                      fontFamily: "var(--font-archivo)",
                      fontWeight: 700,
                      fontSize: 12,
                      transition: "all 0.15s ease",
                    }}
                  >
                    {onlyChanges ? "Showing changes only" : "Show all lines"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowDiff(false); setOnlyChanges(false); }}
                    style={{
                      padding: "7px 14px",
                      border: "2px solid #201e1d",
                      background: "transparent",
                      fontFamily: "var(--font-archivo)",
                      fontWeight: 700,
                      fontSize: 12,
                      transition: "background 0.15s ease, color 0.15s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#201e1d"; e.currentTarget.style.color = "#f3f2f2"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#201e1d"; }}
                  >
                    ← Edit
                  </button>
                </div>
              </div>

              {/* Column headers */}
              <div style={{ display: "grid", gridTemplateColumns: "40px 40px 1fr", gap: 0, borderBottom: "2px solid #201e1d", paddingBottom: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.06em" }}>A</span>
                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.06em" }}>B</span>
                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Content</span>
              </div>

              {/* Diff lines */}
              <div style={{ border: "2px solid #201e1d", overflow: "auto", maxHeight: 600 }}>
                {visibleLines.length === 0 && (
                  <p style={{ padding: "24px 20px", fontSize: 14, opacity: 0.5, fontStyle: "italic" }}>No changes to show.</p>
                )}
                {visibleLines.map((line, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "40px 40px 12px 1fr",
                      alignItems: "stretch",
                      background: BG[line.type],
                      borderLeft: `3px solid ${BORDER[line.type]}`,
                      borderBottom: "1px solid rgba(32,30,29,0.06)",
                      minHeight: 28,
                    }}
                  >
                    <span style={{ padding: "4px 8px", fontSize: 11, fontFamily: "monospace", opacity: 0.3, textAlign: "right", borderRight: "1px solid rgba(32,30,29,0.1)", userSelect: "none" }}>
                      {line.leftNum ?? ""}
                    </span>
                    <span style={{ padding: "4px 8px", fontSize: 11, fontFamily: "monospace", opacity: 0.3, textAlign: "right", borderRight: "1px solid rgba(32,30,29,0.1)", userSelect: "none" }}>
                      {line.rightNum ?? ""}
                    </span>
                    <span style={{ padding: "4px 4px", fontSize: 12, fontFamily: "monospace", fontWeight: 800, color: COLOR[line.type], display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none" }}>
                      {PREFIX[line.type]}
                    </span>
                    <span style={{ padding: "4px 12px 4px 6px", fontSize: 13, fontFamily: "monospace", color: COLOR[line.type], whiteSpace: "pre-wrap", wordBreak: "break-all", display: "flex", alignItems: "center" }}>
                      {line.text || " "}
                    </span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
                {[
                  { color: "#2d8a4e", bg: "rgba(45,138,78,0.10)", label: "+ Added in B" },
                  { color: "#ec3013", bg: "rgba(236,48,19,0.10)",  label: "− Removed from A" },
                  { color: "#201e1d", bg: "transparent",            label: "  Unchanged" },
                ].map(({ color, bg, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 24, height: 14, background: bg, border: `2px solid ${color}`, display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontFamily: "monospace", color, fontWeight: 600 }}>{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            The diff is computed using the Longest Common Subsequence (LCS) algorithm, the same approach used by Unix <code style={{ fontFamily: "monospace", background: "rgba(32,30,29,0.08)", padding: "1px 5px" }}>diff</code>. Lines present only in A are shown in red, lines present only in B are shown in green, and shared lines are shown as-is. Toggle &ldquo;Show changes only&rdquo; to hide unchanged lines. Nothing leaves your browser.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
