"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";

const WORDS_PER_MINUTE = 238;
const CHARS_PER_MINUTE = 1200;

function analyze(text: string) {
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.trim() === "" ? 0 : (text.match(/[.!?]+/g) ?? []).length;
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const lines = text === "" ? 0 : text.split("\n").length;
  const readTimeSec = Math.ceil((words / WORDS_PER_MINUTE) * 60);
  const speakTimeSec = Math.ceil((chars / CHARS_PER_MINUTE) * 60);

  // top words (exclude stop words)
  const STOP = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","is","it","as","be","was","are","were","that","this","has","have","had","not","from","he","she","they","we","you","i","do","did","so","if","up","about","into","than","then","there","their","when","which","who","will","would","can","could","should"]);
  const freq: Record<string, number> = {};
  text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).forEach((w) => {
    if (w.length > 2 && !STOP.has(w)) freq[w] = (freq[w] ?? 0) + 1;
  });
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return { words, chars, charsNoSpaces, sentences, paragraphs, lines, readTimeSec, speakTimeSec, topWords };
}

function fmtTime(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

const PLACEHOLDER = `Paste or type your text here…

Word Counter counts every word, character, sentence, and paragraph in real time. It also estimates how long it would take to read or speak the text aloud.`;

export default function WordCounterContent() {
  const [text, setText] = useState("");

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

  const stats = analyze(text);

  const MAIN_STATS = [
    { label: "Words",       value: stats.words.toLocaleString() },
    { label: "Characters",  value: stats.chars.toLocaleString() },
    { label: "No spaces",   value: stats.charsNoSpaces.toLocaleString() },
    { label: "Sentences",   value: stats.sentences.toLocaleString() },
    { label: "Paragraphs",  value: stats.paragraphs.toLocaleString() },
    { label: "Lines",       value: stats.lines.toLocaleString() },
  ];

  return (
    <main
      className="noise"
      style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}
    >
      <SiteHeader active="Tools" />

      <section
        style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}
      >
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Text Tools / Word Counter
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Word Counter</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Count words, characters, sentences, and reading time instantly. Stats update as you type.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }} className="fade-in-up">

          {/* Stats bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 2 }}>
            {MAIN_STATS.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  border: "2px solid #201e1d",
                  padding: "clamp(12px, 2vw, 18px) clamp(14px, 2.5vw, 22px)",
                  background: "#f3f2f2",
                }}
              >
                <p style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#ec3013" }}>{value}</p>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginTop: 2 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Reading / speaking time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 12 }}>
            {[
              { label: "Read time", value: fmtTime(stats.readTimeSec), sub: `@ ${WORDS_PER_MINUTE} wpm` },
              { label: "Speak time", value: fmtTime(stats.speakTimeSec), sub: `@ ${CHARS_PER_MINUTE} cpm` },
            ].map(({ label, value, sub }) => (
              <div key={label} style={{ border: "2px solid #201e1d", padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4 }}>{label}</p>
                  <p style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 800 }}>{value}</p>
                </div>
                <p style={{ fontSize: 11, opacity: 0.35, fontWeight: 600 }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={14}
            style={{
              width: "100%",
              border: "2px solid #201e1d",
              background: "transparent",
              color: "#201e1d",
              fontFamily: "var(--font-archivo)",
              fontSize: "clamp(14px, 1.6vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.75,
              padding: "clamp(16px, 2.5vw, 24px)",
              outline: "none",
              resize: "vertical",
              display: "block",
            }}
          />

          {/* Controls */}
          <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setText("")}
              disabled={!text}
              style={{
                padding: "9px 18px",
                border: "2px solid #201e1d",
                background: "transparent",
                fontFamily: "var(--font-archivo)",
                fontWeight: 700,
                fontSize: 13,
                opacity: text ? 1 : 0.35,
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => { if (text) { e.currentTarget.style.background = "#201e1d"; e.currentTarget.style.color = "#f3f2f2"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#201e1d"; }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(text)}
              disabled={!text}
              className="btn btn-primary"
              style={{ fontSize: 13, padding: "9px 18px", opacity: text ? 1 : 0.35 }}
            >
              Copy text
            </button>
          </div>

          {/* Top words */}
          {stats.topWords.length > 0 && (
            <div style={{ marginTop: 28, borderTop: "2px solid #201e1d", paddingTop: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, marginBottom: 14 }}>
                Most frequent words
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {stats.topWords.map(([word, count]) => (
                  <div
                    key={word}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      border: "2px solid #201e1d",
                      padding: "6px 14px",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{word}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#ec3013" }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            Words are counted by splitting on whitespace, sentences by matching terminal punctuation, and paragraphs by splitting on blank lines. Reading time uses the average adult silent reading speed of {WORDS_PER_MINUTE} words per minute; speaking time is based on {CHARS_PER_MINUTE} characters per minute. The top words list filters common stop words so only meaningful vocabulary appears. Everything runs in your browser — no text is ever sent anywhere.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
