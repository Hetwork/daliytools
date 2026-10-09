"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

const WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do",
  "eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim",
  "ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi",
  "aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit",
  "voluptate","velit","esse","cillum","eu","fugiat","nulla","pariatur","excepteur","sint",
  "occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit",
  "anim","id","est","laborum","at","vero","eos","accusamus","iusto","odio","dignissimos",
  "ducimus","blanditiis","praesentium","voluptatum","deleniti","atque","corrupti","quos",
  "dolores","quas","molestias","excepturi","similique","sint","occaecati","cupiditate",
  "provident","similique","possimus","omnis","voluptas","assumenda","repudiandae",
  "recusandae","itaque","earum","rerum","hic","tenetur","sapiente","delectus","reiciendis",
];

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function randomWord() { return WORDS[Math.floor(Math.random() * WORDS.length)]; }

function generateSentence(): string {
  const wordCount = 8 + Math.floor(Math.random() * 10);
  const words = Array.from({ length: wordCount }, randomWord);
  return capitalize(words.join(" ")) + ".";
}

function generateParagraph(): string {
  const sentenceCount = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: sentenceCount }, generateSentence).join(" ");
}

function generateWords(count: number): string {
  return capitalize(Array.from({ length: count }, randomWord).join(" ")) + ".";
}

const CLASSIC_OPENING = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

type OutputType = "paragraphs" | "sentences" | "words";

export default function LoremIpsumGeneratorContent() {
  const [outputType, setOutputType] = useState<OutputType>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
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

  function generate() {
    let text = "";

    if (outputType === "paragraphs") {
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          const extra = generateParagraph();
          paras.push(CLASSIC_OPENING + " " + extra);
        } else {
          paras.push(generateParagraph());
        }
      }
      text = paras.join("\n\n");
    } else if (outputType === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          sentences.push(CLASSIC_OPENING);
        } else {
          sentences.push(generateSentence());
        }
      }
      text = sentences.join(" ");
    } else {
      text = startWithLorem
        ? CLASSIC_OPENING.split(" ").slice(0, Math.min(count, 8)).join(" ") +
          (count > 8 ? " " + generateWords(count - 8) : "")
        : generateWords(count);
    }

    setOutput(text);
    setCopied(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const maxCount = outputType === "words" ? 500 : outputType === "sentences" ? 20 : 10;
  const unitLabel = outputType === "paragraphs" ? "paragraphs" : outputType === "sentences" ? "sentences" : "words";

  return (
    <main
      className="noise"
      style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}
    >
      <SiteHeader active="Tools" />

      <section
        style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}
      >
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Generators / Lorem Ipsum Generator
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "var(--on-solid)", background: "var(--red)", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Lorem Ipsum Generator</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Generate placeholder text for mockups and prototypes. Choose paragraphs, sentences, or word count.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }} className="fade-in-up">

          {/* Controls */}
          <div style={{ border: "2px solid var(--border)", padding: "clamp(20px, 3vw, 28px)", marginBottom: 20, display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Output type */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 12 }}>Output Type</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(["paragraphs", "sentences", "words"] as OutputType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setOutputType(type); setCount(type === "words" ? 50 : type === "sentences" ? 5 : 3); }}
                    style={{
                      padding: "10px 20px",
                      border: "2px solid var(--border)",
                      background: outputType === type ? "var(--solid)" : "transparent",
                      color: outputType === type ? "var(--on-solid)" : "var(--ink)",
                      fontFamily: "var(--font-archivo)",
                      fontWeight: 700,
                      fontSize: 13,
                      textTransform: "capitalize",
                      transition: "background 0.15s ease, color 0.15s ease",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Count slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45 }}>
                  Number of {unitLabel}
                </label>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--red)" }}>{count}</span>
              </div>
              <input
                type="range" min={1} max={maxCount} step={1} value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--red)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.4, marginTop: 4 }}>
                <span>1</span><span>{maxCount}</span>
              </div>
            </div>

            {/* Options */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                type="button"
                onClick={() => setStartWithLorem(!startWithLorem)}
                style={{
                  width: 40,
                  height: 22,
                  background: startWithLorem ? "var(--red)" : "#c8c6c5",
                  border: "none",
                  borderRadius: 11,
                  position: "relative",
                  transition: "background 0.2s ease",
                  flexShrink: 0,
                }}
                aria-pressed={startWithLorem}
              >
                <span style={{
                  position: "absolute",
                  top: 2,
                  left: startWithLorem ? 20 : 2,
                  width: 18,
                  height: 18,
                  background: "var(--bg)",
                  borderRadius: "50%",
                  transition: "left 0.2s ease",
                }} />
              </button>
              <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.7 }}>Start with classic Lorem ipsum opening</span>
            </div>

            <button type="button" onClick={generate} className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
              Generate Text
            </button>
          </div>

          {/* Output */}
          {output && (
            <div style={{ border: "2px solid var(--border)", padding: "clamp(20px, 3vw, 28px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.4 }}>
                  {output.split(/\s+/).length} words · {output.length} characters
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={copy} className="btn btn-primary" style={{ fontSize: 12, padding: "8px 16px" }}>
                    {copied ? "Copied!" : "Copy All"}
                  </button>
                  <button
                    type="button"
                    onClick={generate}
                    style={{
                      padding: "8px 16px",
                      border: "2px solid var(--border)",
                      background: "transparent",
                      fontFamily: "var(--font-archivo)",
                      fontWeight: 700,
                      fontSize: 12,
                      transition: "background 0.15s ease, color 0.15s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--solid)"; e.currentTarget.style.color = "var(--on-solid)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; }}
                  >
                    Regenerate ↺
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {output.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    style={{ fontSize: "clamp(14px, 1.7vw, 17px)", lineHeight: 1.8, opacity: 0.75 }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid var(--border)", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            Text is assembled from a bank of classic Lorem Ipsum vocabulary shuffled into random sentences and paragraphs.
            The first block optionally opens with the traditional <em>"Lorem ipsum dolor sit amet..."</em> passage — a corrupted excerpt from Cicero&apos;s <em>de Finibus Bonorum et Malorum</em>, used by designers since the 1960s.
            Everything runs in your browser with no network requests.
          </p>
        </div>
        <ToolEditorial toolName="Lorem Ipsum Generator" {...toolEditorialData["lorem-ipsum-generator"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
