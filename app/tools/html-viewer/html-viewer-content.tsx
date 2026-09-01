"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FullScreenModal from "../../_components/full-screen-modal";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";

const SAMPLE = `<h1 style="font-family:sans-serif;color:#201e1d">Hello from the HTML Viewer</h1>
<p style="font-family:sans-serif;color:#555;line-height:1.6">Edit the code on the left to see your changes live on the right.</p>
<button style="background:#ec3013;color:#fff;border:none;padding:10px 22px;font-size:14px;font-weight:700;margin-top:12px;cursor:pointer">
  Try me
</button>`;

type View = "split" | "edit" | "preview";

export default function HtmlViewerContent() {
  const [html, setHtml] = useState(SAMPLE);
  const [view, setView] = useState<View>("split");
  const [maximizedPanel, setMaximizedPanel] = useState<"editor" | "preview" | null>(null);
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

  function copy() {
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const editorStyles: React.CSSProperties = {
    width: "100%",
    height: "100%",
    minHeight: 380,
    border: "none",
    background: "transparent",
    color: "#201e1d",
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 1.65,
    padding: 20,
    resize: "none",
    outline: "none",
  };

  const paneStyle: React.CSSProperties = {
    border: "2px solid #201e1d",
    flex: 1,
    minHeight: 380,
    overflow: "hidden",
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
          <Link href="/tools" className="ink-hover">All Tools</Link> / Developer Tools / HTML Viewer
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
            HTML Viewer
          </h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Paste or write HTML on the left and see it rendered live on the right. Great for quick prototypes and snippets.
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
              {copied ? "Copied!" : "Copy HTML"}
            </button>
            <button
              type="button"
              onClick={() => setHtml("")}
              className="ink-hover"
              style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.45, fontFamily: "inherit" }}
            >
              Clear
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              flexDirection: view === "split" && maximizedPanel === null ? "row" : "column",
              minHeight: 400,
            }}
          >
            {isEditorVisible && (
              <div style={paneStyle}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(32,30,29,0.12)", padding: "10px 20px 8px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, margin: 0 }}>
                    Editor
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
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  spellCheck={false}
                  style={{ ...editorStyles, height: "100%", minHeight: 380 }}
                  placeholder="Type or paste HTML here…"
                />
              </div>
            )}
            {isPreviewVisible && (
              <div style={{ ...paneStyle, background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(32,30,29,0.12)", padding: "10px 20px 8px" }}>
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
                <iframe
                  srcDoc={html}
                  sandbox="allow-scripts"
                  title="HTML Preview"
                  style={{ width: "100%", height: "calc(100% - 36px)", border: "none", minHeight: 344 }}
                />
              </div>
            )}
          </div>
        </div>

        {maximizedPanel && (
          <FullScreenModal
            title={maximizedPanel === "editor" ? "Editor" : "Preview"}
            onClose={() => setMaximizedPanel(null)}
          >
            {maximizedPanel === "editor" ? (
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                spellCheck={false}
                style={{ ...editorStyles, height: "100%", border: "none", background: "#f3f2f2", padding: 20 }}
                placeholder="Type or paste HTML here…"
              />
            ) : (
              <iframe
                srcDoc={html}
                sandbox="allow-scripts"
                title="HTML Preview Modal"
                style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
              />
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
            Your HTML is fed directly into an <code>iframe</code> using the <code>srcDoc</code> attribute — no server round-trip,
            no uploads. Scripts inside the preview run in a sandboxed context. Switch between Split, Edit, and Preview modes to focus on what you need.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
