"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SparkMD5 from "spark-md5";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";

const NAMESPACE_DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

function formatUuidFromBytes(bytes: Uint8Array): string {
  const hex = bytesToHex(bytes);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function parseUuid(uuid: string): Uint8Array | null {
  const clean = uuid.replace(/-/g, "").trim().toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(clean)) return null;
  const out = new Uint8Array(16);
  for (let i = 0; i < 16; i += 1) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

async function shaDigest(algorithm: "SHA-1" | "SHA-256" | "SHA-512", bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest(algorithm, bytes);
  return bytesToHex(new Uint8Array(digest));
}

async function uuidV5(name: string, namespace = NAMESPACE_DNS): Promise<string> {
  const nsBytes = parseUuid(namespace);
  if (!nsBytes) throw new Error("Invalid namespace UUID");

  const nameBytes = new TextEncoder().encode(name);
  const all = new Uint8Array(nsBytes.length + nameBytes.length);
  all.set(nsBytes, 0);
  all.set(nameBytes, nsBytes.length);

  const digest = new Uint8Array(await crypto.subtle.digest("SHA-1", all));
  const bytes = digest.slice(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuidFromBytes(bytes);
}

function nanoId(length: number): string {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values)
    .map((v) => alphabet[v % alphabet.length])
    .join("");
}

export default function UuidGeneratorContent() {
  const [count, setCount] = useState(10);
  const [uuids, setUuids] = useState<string[]>([]);
  const [nameInput, setNameInput] = useState("daliy.tools");
  const [namespaceInput, setNamespaceInput] = useState(NAMESPACE_DNS);
  const [uuid5Value, setUuid5Value] = useState("");
  const [hashInput, setHashInput] = useState("Hello Daliy.Tools");
  const [hashOutput, setHashOutput] = useState<{ sha256: string; sha512: string; md5: string } | null>(null);
  const [nanoLength, setNanoLength] = useState(21);
  const [nanoValue, setNanoValue] = useState("");
  const [fileHashResult, setFileHashResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

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

  const countClamped = useMemo(() => Math.min(100, Math.max(1, Math.floor(count))), [count]);

  function generateV4Batch() {
    const next = Array.from({ length: countClamped }, () => crypto.randomUUID());
    setUuids(next);
    setError(null);
  }

  async function generateV5Value() {
    try {
      const id = await uuidV5(nameInput, namespaceInput);
      setUuid5Value(id);
      setError(null);
    } catch {
      setError("Namespace must be a valid UUID.");
    }
  }

  function generateNano() {
    const len = Math.max(6, Math.min(64, Math.floor(nanoLength)));
    setNanoValue(nanoId(len));
  }

  async function hashText() {
    const bytes = new TextEncoder().encode(hashInput);
    const sha256 = await shaDigest("SHA-256", bytes);
    const sha512 = await shaDigest("SHA-512", bytes);
    const md5 = SparkMD5.ArrayBuffer.hash(bytes.buffer);
    setHashOutput({ sha256, sha512, md5 });
  }

  async function hashFile(file: File | null) {
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const sha256 = await shaDigest("SHA-256", bytes);
    const sha512 = await shaDigest("SHA-512", bytes);
    const md5 = SparkMD5.ArrayBuffer.hash(buffer);
    setFileHashResult(`SHA-256: ${sha256}\nSHA-512: ${sha512}\nMD5: ${md5}`);
  }

  return (
    <main className="noise" style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}>
      <SiteHeader active="Tools" />

      <section style={{ maxWidth: 980, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}>
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Developer Tools / UUID & Hash Generator
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>UUID v4/v5, Nano ID, SHA-256/SHA-512/MD5</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>UUID & Hash Generator</h1>
        </div>

        <div className="fade-in-up" style={{ marginTop: "clamp(36px, 6vw, 56px)", display: "grid", gap: 16 }}>
          <div style={{ border: "2px solid #201e1d", padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>UUID v4 Batch</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <input type="number" min={1} max={100} value={count} onChange={(event) => setCount(Number(event.target.value))} style={{ border: "2px solid #201e1d", background: "transparent", padding: "8px 10px", width: 90 }} />
              <button type="button" className="btn btn-primary" onClick={generateV4Batch}>Generate</button>
            </div>
            {uuids.length > 0 && <pre style={{ marginTop: 10, fontFamily: "monospace", fontSize: 12, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{uuids.join("\n")}</pre>}
          </div>

          <div style={{ border: "2px solid #201e1d", padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>UUID v5</p>
            <div style={{ display: "grid", gap: 8 }}>
              <input value={nameInput} onChange={(event) => setNameInput(event.target.value)} placeholder="Name" style={{ border: "2px solid #201e1d", background: "transparent", padding: "10px 12px" }} />
              <input value={namespaceInput} onChange={(event) => setNamespaceInput(event.target.value)} placeholder="Namespace UUID" style={{ border: "2px solid #201e1d", background: "transparent", padding: "10px 12px", fontFamily: "monospace" }} />
              <button type="button" className="btn" onClick={generateV5Value}>Generate v5</button>
              {uuid5Value && <p style={{ fontFamily: "monospace", fontSize: 13 }}>{uuid5Value}</p>}
            </div>
          </div>

          <div style={{ border: "2px solid #201e1d", padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Nano ID</p>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input type="number" min={6} max={64} value={nanoLength} onChange={(event) => setNanoLength(Number(event.target.value))} style={{ border: "2px solid #201e1d", background: "transparent", padding: "8px 10px", width: 90 }} />
              <button type="button" className="btn" onClick={generateNano}>Generate Nano ID</button>
              {nanoValue && <span style={{ fontFamily: "monospace", fontSize: 13 }}>{nanoValue}</span>}
            </div>
          </div>

          <div style={{ border: "2px solid #201e1d", padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Hash Text</p>
            <textarea value={hashInput} onChange={(event) => setHashInput(event.target.value)} style={{ width: "100%", minHeight: 90, border: "2px solid #201e1d", background: "transparent", padding: 12, fontFamily: "monospace" }} />
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button type="button" className="btn btn-primary" onClick={hashText}>Generate hashes</button>
            </div>
            {hashOutput && (
              <pre style={{ marginTop: 10, whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 12, lineHeight: 1.55 }}>
{`SHA-256: ${hashOutput.sha256}\nSHA-512: ${hashOutput.sha512}\nMD5: ${hashOutput.md5}`}
              </pre>
            )}
          </div>

          <div style={{ border: "2px solid #201e1d", padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45, marginBottom: 10 }}>Hash File</p>
            <input type="file" onChange={(event) => { void hashFile(event.target.files?.[0] ?? null); }} />
            {fileHashResult && <pre style={{ marginTop: 10, whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 12, lineHeight: 1.55 }}>{fileHashResult}</pre>}
          </div>

          {error && <p style={{ color: "#ec3013", fontWeight: 600, fontSize: 13 }}>{error}</p>}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
