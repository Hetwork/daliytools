"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMS = "0123456789";
const SYMS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

function generatePassword(length: number, upper: boolean, lower: boolean, numbers: boolean, symbols: boolean): string {
  let charset = "";
  const required: string[] = [];

  if (upper) { charset += UPPER; required.push(UPPER[Math.floor(Math.random() * UPPER.length)]); }
  if (lower) { charset += LOWER; required.push(LOWER[Math.floor(Math.random() * LOWER.length)]); }
  if (numbers) { charset += NUMS; required.push(NUMS[Math.floor(Math.random() * NUMS.length)]); }
  if (symbols) { charset += SYMS; required.push(SYMS[Math.floor(Math.random() * SYMS.length)]); }

  if (!charset) return "";

  const rest = Array.from({ length: length - required.length }, () =>
    charset[Math.floor(Math.random() * charset.length)]
  );

  const all = [...required, ...rest];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.join("");
}

function getStrength(pwd: string): { label: string; score: number; color: string } {
  if (!pwd) return { label: "", score: 0, color: "#e2e0e0" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return { label: "Weak", score: score / 7, color: "#ec3013" };
  if (score <= 4) return { label: "Fair", score: score / 7, color: "#e87c00" };
  if (score <= 5) return { label: "Good", score: score / 7, color: "#9a9a00" };
  return { label: "Strong", score: score / 7, color: "#2d8a4e" };
}

export default function PasswordGeneratorContent() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

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

  const generate = useCallback(() => {
    if (!upper && !lower && !numbers && !symbols) return;
    const pwd = generatePassword(length, upper, lower, numbers, symbols);
    setPassword(pwd);
    setCopied(false);
    setHistory((prev) => [pwd, ...prev.slice(0, 4)]);
  }, [length, upper, lower, numbers, symbols]);

  useEffect(() => { generate(); }, []);

  async function copy(pwd: string) {
    await navigator.clipboard.writeText(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const strength = getStrength(password);
  const noneSelected = !upper && !lower && !numbers && !symbols;

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
          <Link href="/tools" className="ink-hover">All Tools</Link> / Generators / Password Generator
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "var(--on-solid)", background: "var(--red)", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Password Generator</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Create strong, random passwords in one click. Customize length and character sets. Nothing leaves your device.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }} className="fade-in-up">

          {/* Password display */}
          <div style={{ border: "2px solid var(--border)", padding: "clamp(20px, 3vw, 28px)", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <p
                style={{
                  flex: 1,
                  fontSize: "clamp(15px, 2vw, 20px)",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  letterSpacing: "0.05em",
                  wordBreak: "break-all",
                  minWidth: 0,
                  opacity: password ? 1 : 0.3,
                }}
              >
                {password || "No character set selected"}
              </p>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => copy(password)}
                  disabled={!password}
                  className="btn btn-primary"
                  style={{ fontSize: 13, padding: "10px 18px" }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={generate}
                  disabled={noneSelected}
                  style={{
                    padding: "10px 18px",
                    border: "2px solid var(--border)",
                    background: "transparent",
                    fontFamily: "var(--font-archivo)",
                    fontWeight: 700,
                    fontSize: 13,
                    transition: "background 0.15s ease, color 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--solid)"; e.currentTarget.style.color = "var(--on-solid)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; }}
                >
                  Regenerate ↺
                </button>
              </div>
            </div>

            {/* Strength bar */}
            {password && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                  <span style={{ opacity: 0.45, textTransform: "uppercase", letterSpacing: "0.08em" }}>Strength</span>
                  <span style={{ color: strength.color }}>{strength.label}</span>
                </div>
                <div style={{ height: 6, background: "#e2e0e0" }}>
                  <div style={{ height: "100%", background: strength.color, width: `${strength.score * 100}%`, transition: "width 0.3s ease, background 0.3s ease" }} />
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div style={{ border: "2px solid var(--border)", padding: "clamp(20px, 3vw, 28px)", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Length */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45 }}>Length</label>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--red)" }}>{length}</span>
              </div>
              <input
                type="range" min={6} max={64} step={1} value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--red)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.4, marginTop: 4 }}>
                <span>6</span><span>64</span>
              </div>
            </div>

            {/* Character sets */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 14 }}>Character Sets</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                {[
                  { label: "Uppercase (A–Z)", value: upper, set: setUpper, example: "ABC" },
                  { label: "Lowercase (a–z)", value: lower, set: setLower, example: "abc" },
                  { label: "Numbers (0–9)", value: numbers, set: setNumbers, example: "123" },
                  { label: "Symbols (!@#)", value: symbols, set: setSymbols, example: "!@#" },
                ].map(({ label, value, set, example }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => set(!value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      border: `2px solid ${value ? "var(--border)" : "#c8c6c5"}`,
                      background: value ? "var(--solid)" : "transparent",
                      color: value ? "var(--on-solid)" : "var(--ink)",
                      fontFamily: "var(--font-archivo)",
                      fontWeight: 600,
                      fontSize: 13,
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      opacity: value ? 1 : 0.55,
                    }}
                  >
                    <span>{label}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 12, opacity: 0.6 }}>{example}</span>
                  </button>
                ))}
              </div>
              {noneSelected && (
                <p style={{ marginTop: 10, fontSize: 13, color: "var(--red)", fontWeight: 600 }}>Select at least one character set.</p>
              )}
            </div>
          </div>

          {/* History */}
          {history.length > 1 && (
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, marginBottom: 12 }}>Recent Passwords</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {history.slice(1).map((pwd, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 16px", border: "1px solid #c8c6c5" }}
                  >
                    <span style={{ fontFamily: "monospace", fontSize: 13, opacity: 0.6, wordBreak: "break-all" }}>{pwd}</span>
                    <button
                      type="button"
                      onClick={() => copy(pwd)}
                      className="ink-hover"
                      style={{ flexShrink: 0, background: "none", border: "none", fontSize: 12, fontWeight: 700, opacity: 0.45, fontFamily: "inherit" }}
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid var(--border)", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            Passwords are generated using <code style={{ fontFamily: "monospace", background: "rgba(var(--ink-rgb), 0.08)", padding: "1px 5px" }}>Math.random()</code> to sample characters from your selected sets, with a guaranteed character from each active set shuffled into the final result.
            Every password is created locally in your browser — nothing is ever transmitted.
          </p>
        </div>
        <ToolEditorial toolName="Password Generator" {...toolEditorialData["password-generator"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
