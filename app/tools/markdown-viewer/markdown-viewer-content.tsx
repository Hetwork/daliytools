"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import FullScreenModal from "../../_components/full-screen-modal";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
const remarkGfm = dynamic(() => import("remark-gfm").then((m) => m.default), { ssr: false });

const SAMPLE = `# Markdown Preview

## Welcome

Edit on the **left** and see a live preview on the _right_.

- Bullet lists work
- So do **bold** and _italic_
- And \`inline code\`

| Column A | Column B |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

\`\`\`javascript
console.log("Hello from Daliy.Tools!");
\`\`\`

> Blockquotes are supported too.
`;

type View = "split" | "edit" | "preview";

export default function MarkdownViewerContent() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [view, setView] = useState<View>("split");
  const [maximizedPanel, setMaximizedPanel] = useState<"editor" | "preview" | null>(null);
  const [copied, setCopied] = useState(false);
  const [plugins, setPlugins] = useState<any[]>([]);

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

  useEffect(() => {
    import("remark-gfm").then((m) => setPlugins([m.default]));
  }, []);

  function copy() {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const paneStyle: React.CSSProperties = {
    border: "2px solid #201e1d",
    flex: 1,
    minHeight: 420,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const isEditorVisible = view !== "preview" && (maximizedPanel === null || maximizedPanel === "editor");
  const isPreviewVisible = view !== "edit" && (maximizedPanel === null || maximizedPanel === "preview");

  return (
    <main
      className="noise"
      style={{
        background: "#f3f2f2",
        color: "#201e1d",
        fontFamily: "var(--font-archivo), sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <SiteHeader active="Tools" />

      <section
        style={{
          maxWidth: 1100,
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
          style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}
        >
          <Link href="/tools" className="ink-hover">All Tools</Link> / Developer Tools / Markdown Viewer
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>
              Live
            </span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>
              Runs entirely in your browser
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            Markdown Viewer
          </h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Write or paste Markdown on the left — the rendered preview updates live on the right. Supports GFM tables, task lists, and code blocks.
          </p>
        </div>

        <div className="fade-in-up" style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
            {(["split", "edit", "preview"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                style={{
                  padding: "8px 18px",
                  border: `2px solid ${view === v ? "#ec3013" : "#201e1d"}`,
                  background: view === v ? "#ec3013" : "transparent",
                  color: view === v ? "#f3f2f2" : "#201e1d",
                  fontWeight: 700,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-archivo)",
                  transition: "all 0.2s ease",
                }}
              >
                {v === "split" ? "Split" : v === "edit" ? "Edit" : "Preview"}
              </button>
            ))}
            <button
              type="button"
              onClick={copy}
              style={{ padding: "8px 18px", border: "2px solid #201e1d", background: "transparent", color: "#201e1d", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-archivo)", marginLeft: "auto" }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => setMarkdown("")}
              className="ink-hover"
              style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.45, fontFamily: "inherit" }}
            >
              Clear
            </button>
          </div>

          <div style={{ display: "flex", gap: 16, flexDirection: view === "split" && maximizedPanel === null ? "row" : "column", minHeight: 420 }}>
            {isEditorVisible && (
              <div style={paneStyle}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(32,30,29,0.12)", padding: "10px 20px 8px", flexShrink: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, margin: 0 }}>
                    Markdown
                  </p>
                  <button
                    type="button"
                    onClick={() => setMaximizedPanel((current) => current === "editor" ? null : "editor")}
                    style={{ background: "transparent", border: "1px solid #201e1d", color: "#201e1d", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 8px", cursor: "pointer" }}
                  >
                    Full Screen
                  </button>
                </div>
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  spellCheck={false}
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    color: "#201e1d",
                    fontFamily: "monospace",
                    fontSize: 13,
                    lineHeight: 1.65,
                    padding: 20,
                    resize: "none",
                    outline: "none",
                    minHeight: 380,
                  }}
                  placeholder="Type Markdown here…"
                />
              </div>
            )}
            {isPreviewVisible && (
              <div style={{ ...paneStyle, background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(32,30,29,0.12)", padding: "10px 20px 8px", flexShrink: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, margin: 0 }}>
                    Preview
                  </p>
                  <button
                    type="button"
                    onClick={() => setMaximizedPanel((current) => current === "preview" ? null : "preview")}
                    style={{ background: "transparent", border: "1px solid #201e1d", color: "#201e1d", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 8px", cursor: "pointer" }}
                  >
                    Full Screen
                  </button>
                </div>
                <div
                  style={{ flex: 1, padding: "20px 24px", overflowY: "auto", fontSize: 15, lineHeight: 1.7, color: "#201e1d" }}
                  className="md-preview"
                >
                  <ReactMarkdown remarkPlugins={plugins}>{markdown}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>

        {maximizedPanel && (
          <FullScreenModal
            title={maximizedPanel === "editor" ? "Markdown" : "Preview"}
            onClose={() => setMaximizedPanel(null)}
          >
            {maximizedPanel === "editor" ? (
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                spellCheck={false}
                style={{
                  flex: 1,
                  border: "none",
                  background: "#f3f2f2",
                  color: "#201e1d",
                  fontFamily: "monospace",
                  fontSize: 13,
                  lineHeight: 1.65,
                  padding: 20,
                  resize: "none",
                  outline: "none",
                  width: "100%",
                  height: "100%",
                }}
                placeholder="Type Markdown here…"
              />
            ) : (
              <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto", fontSize: 15, lineHeight: 1.7, color: "#201e1d", background: "#fff" }} className="md-preview">
                <ReactMarkdown remarkPlugins={plugins}>{markdown}</ReactMarkdown>
              </div>
            )}
          </FullScreenModal>
        )}

        <div
          className="reveal"
          style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}
        >
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>
            How It Works
          </p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            Your Markdown is parsed client-side using <code>react-markdown</code> with the GFM plugin, which adds support for tables,
            strikethrough, and task lists. All rendering happens in your browser — nothing is sent to a server.
          </p>
        </div>
      <style>{`
        .md-preview h1,.md-preview h2,.md-preview h3 { font-weight:800; margin:16px 0 8px; letter-spacing:-0.02em; }
        .md-preview h1 { font-size:1.8em; }
        .md-preview h2 { font-size:1.4em; }
        .md-preview h3 { font-size:1.1em; }
        .md-preview p { margin:0 0 12px; }
        .md-preview ul,.md-preview ol { padding-left:20px; margin-bottom:12px; }
        .md-preview li { margin-bottom:4px; }
        .md-preview code { background:rgba(32,30,29,0.08); padding:2px 6px; font-family:monospace; font-size:0.9em; }
        .md-preview pre { background:rgba(32,30,29,0.06); padding:16px; margin-bottom:12px; overflow:auto; }
        .md-preview pre code { background:none; padding:0; }
        .md-preview blockquote { border-left:4px solid #ec3013; padding-left:16px; opacity:0.7; margin:0 0 12px; }
        .md-preview table { border-collapse:collapse; width:100%; margin-bottom:12px; }
        .md-preview th,.md-preview td { border:1px solid rgba(32,30,29,0.2); padding:8px 12px; text-align:left; }
        .md-preview th { font-weight:700; background:rgba(32,30,29,0.05); }
        .md-preview a { color:#ec3013; text-decoration:underline; }
        .md-preview strong { font-weight:800; }
      `}</style>

        <ToolEditorial toolName="Markdown Viewer" {...toolEditorialData["markdown-viewer"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
