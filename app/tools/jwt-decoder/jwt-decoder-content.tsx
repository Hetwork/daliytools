"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

const SAMPLE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRhbGl5IFRvb2xzIiwiaWF0IjoxNzUxMzMzMDAwLCJleHAiOjE5MDkwOTQ0MDB9.signature";

type DecodedPart = Record<string, unknown> | null;

function base64UrlToUtf8(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(padLength);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseJwtPart(part: string): DecodedPart {
  try {
    const text = base64UrlToUtf8(part);
    const parsed = JSON.parse(text) as Record<string, unknown>;
    return parsed;
  } catch {
    return null;
  }
}

function formatUnixDate(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.toLocaleString()} (${date.toISOString()})`;
}

export default function JwtDecoderContent() {
  const [token, setToken] = useState(SAMPLE_TOKEN);
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

  const result = useMemo(() => {
    const trimmed = token.trim();
    if (!trimmed) {
      return {
        error: "Paste a JWT token to decode.",
        header: null as DecodedPart,
        payload: null as DecodedPart,
        signature: "",
      };
    }

    const parts = trimmed.split(".");
    if (parts.length < 2) {
      return {
        error: "A JWT must contain at least header.payload.",
        header: null as DecodedPart,
        payload: null as DecodedPart,
        signature: "",
      };
    }

    const header = parseJwtPart(parts[0] ?? "");
    const payload = parseJwtPart(parts[1] ?? "");

    if (!header || !payload) {
      return {
        error: "Header or payload is not valid Base64URL JSON.",
        header,
        payload,
        signature: parts[2] ?? "",
      };
    }

    return {
      error: null as string | null,
      header,
      payload,
      signature: parts[2] ?? "",
    };
  }, [token]);

  const payloadDates = useMemo(() => {
    if (!result.payload) return [] as Array<{ key: string; value: string }>;

    const keys = ["iat", "exp", "nbf"];
    return keys
      .map((key) => ({ key, value: formatUnixDate(result.payload?.[key]) }))
      .filter((item): item is { key: string; value: string } => Boolean(item.value));
  }, [result.payload]);

  function copyPayload() {
    if (!result.payload) return;
    navigator.clipboard.writeText(JSON.stringify(result.payload, null, 2)).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <main className="noise" style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}>
      <SiteHeader active="Tools" />

      <section style={{ maxWidth: 980, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}>
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Developer Tools / JWT Decoder
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "var(--on-solid)", background: "var(--red)", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Private decode only, no signature verification</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>JWT Token Decoder</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 720 }}>
            Inspect JWT header and payload in readable JSON, plus claim timestamps for iat, exp, and nbf. Decoding happens only in your browser.
          </p>
        </div>

        <div className="fade-in-up" style={{ marginTop: "clamp(36px, 6vw, 56px)" }}>
          <textarea
            value={token}
            onChange={(event) => setToken(event.target.value)}
            spellCheck={false}
            placeholder="Paste JWT token here"
            style={{ width: "100%", minHeight: 120, border: "2px solid var(--border)", background: "transparent", color: "var(--ink)", fontFamily: "monospace", fontSize: 13, lineHeight: 1.65, padding: 18, outline: "none", resize: "vertical" }}
          />

          {result.error && (
            <p style={{ marginTop: 10, color: "var(--red)", fontSize: 13, fontWeight: 600 }}>{result.error}</p>
          )}

          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" className="btn" onClick={() => setToken(SAMPLE_TOKEN)}>Load sample token</button>
            <button type="button" className="btn" onClick={() => setToken("")}>Clear</button>
            <button type="button" className="btn btn-primary" onClick={copyPayload} disabled={!result.payload}>{copied ? "Copied" : "Copy payload"}</button>
          </div>
        </div>

        <div className="fade-in-up" style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <div style={{ border: "2px solid var(--border)", padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Header</p>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6 }}>{result.header ? JSON.stringify(result.header, null, 2) : "-"}</pre>
          </div>
          <div style={{ border: "2px solid var(--border)", padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Payload</p>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6 }}>{result.payload ? JSON.stringify(result.payload, null, 2) : "-"}</pre>
          </div>
        </div>

        <div className="fade-in-up" style={{ marginTop: 16, border: "2px solid var(--border)", padding: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Token Details</p>
          <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 8 }}>Signature length: {result.signature.length} chars</p>
          {payloadDates.length === 0 ? (
            <p style={{ fontSize: 13, opacity: 0.55 }}>No standard timestamp claims detected.</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {payloadDates.map((item) => (
                <p key={item.key} style={{ fontSize: 13 }}>
                  <strong>{item.key.toUpperCase()}</strong>: {item.value}
                </p>
              ))}
            </div>
          )}
        </div>
        <ToolEditorial toolName="JWT Token Decoder" {...toolEditorialData["jwt-decoder"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
