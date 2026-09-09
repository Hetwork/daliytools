"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolAdRail from "../../_components/tool-ad-rail";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

type Category = "Length" | "Weight" | "Volume" | "Temperature" | "Area" | "Speed";

interface Unit { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }

const UNITS: Record<Category, Unit[]> = {
  Length: [
    { label: "Millimeter (mm)",   toBase: (v) => v / 1000,       fromBase: (v) => v * 1000 },
    { label: "Centimeter (cm)",   toBase: (v) => v / 100,        fromBase: (v) => v * 100 },
    { label: "Meter (m)",         toBase: (v) => v,              fromBase: (v) => v },
    { label: "Kilometer (km)",    toBase: (v) => v * 1000,       fromBase: (v) => v / 1000 },
    { label: "Inch (in)",         toBase: (v) => v * 0.0254,     fromBase: (v) => v / 0.0254 },
    { label: "Foot (ft)",         toBase: (v) => v * 0.3048,     fromBase: (v) => v / 0.3048 },
    { label: "Yard (yd)",         toBase: (v) => v * 0.9144,     fromBase: (v) => v / 0.9144 },
    { label: "Mile (mi)",         toBase: (v) => v * 1609.344,   fromBase: (v) => v / 1609.344 },
    { label: "Nautical mile",     toBase: (v) => v * 1852,       fromBase: (v) => v / 1852 },
  ],
  Weight: [
    { label: "Milligram (mg)",    toBase: (v) => v / 1e6,        fromBase: (v) => v * 1e6 },
    { label: "Gram (g)",          toBase: (v) => v / 1000,       fromBase: (v) => v * 1000 },
    { label: "Kilogram (kg)",     toBase: (v) => v,              fromBase: (v) => v },
    { label: "Metric ton (t)",    toBase: (v) => v * 1000,       fromBase: (v) => v / 1000 },
    { label: "Ounce (oz)",        toBase: (v) => v * 0.0283495,  fromBase: (v) => v / 0.0283495 },
    { label: "Pound (lb)",        toBase: (v) => v * 0.453592,   fromBase: (v) => v / 0.453592 },
    { label: "Stone (st)",        toBase: (v) => v * 6.35029,    fromBase: (v) => v / 6.35029 },
  ],
  Volume: [
    { label: "Milliliter (ml)",   toBase: (v) => v / 1000,       fromBase: (v) => v * 1000 },
    { label: "Liter (L)",         toBase: (v) => v,              fromBase: (v) => v },
    { label: "Cubic meter (m³)",  toBase: (v) => v * 1000,       fromBase: (v) => v / 1000 },
    { label: "Fluid oz (fl oz)",  toBase: (v) => v * 0.0295735,  fromBase: (v) => v / 0.0295735 },
    { label: "Cup (US)",          toBase: (v) => v * 0.236588,   fromBase: (v) => v / 0.236588 },
    { label: "Pint (US pt)",      toBase: (v) => v * 0.473176,   fromBase: (v) => v / 0.473176 },
    { label: "Quart (US qt)",     toBase: (v) => v * 0.946353,   fromBase: (v) => v / 0.946353 },
    { label: "Gallon (US gal)",   toBase: (v) => v * 3.78541,    fromBase: (v) => v / 3.78541 },
  ],
  Temperature: [
    { label: "Celsius (°C)",      toBase: (v) => v,              fromBase: (v) => v },
    { label: "Fahrenheit (°F)",   toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    { label: "Kelvin (K)",        toBase: (v) => v - 273.15,     fromBase: (v) => v + 273.15 },
  ],
  Area: [
    { label: "sq mm (mm²)",       toBase: (v) => v / 1e6,        fromBase: (v) => v * 1e6 },
    { label: "sq cm (cm²)",       toBase: (v) => v / 10000,      fromBase: (v) => v * 10000 },
    { label: "sq meter (m²)",     toBase: (v) => v,              fromBase: (v) => v },
    { label: "sq km (km²)",       toBase: (v) => v * 1e6,        fromBase: (v) => v / 1e6 },
    { label: "sq inch (in²)",     toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
    { label: "sq foot (ft²)",     toBase: (v) => v * 0.092903,   fromBase: (v) => v / 0.092903 },
    { label: "Acre",              toBase: (v) => v * 4046.86,    fromBase: (v) => v / 4046.86 },
    { label: "Hectare (ha)",      toBase: (v) => v * 10000,      fromBase: (v) => v / 10000 },
  ],
  Speed: [
    { label: "m/s",               toBase: (v) => v,              fromBase: (v) => v },
    { label: "km/h",              toBase: (v) => v / 3.6,        fromBase: (v) => v * 3.6 },
    { label: "mph",               toBase: (v) => v * 0.44704,    fromBase: (v) => v / 0.44704 },
    { label: "Knot (kn)",         toBase: (v) => v * 0.514444,   fromBase: (v) => v / 0.514444 },
    { label: "ft/s",              toBase: (v) => v * 0.3048,     fromBase: (v) => v / 0.3048 },
  ],
};

const CATEGORIES = Object.keys(UNITS) as Category[];

function fmtResult(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) < 1e-10 && n !== 0) return n.toExponential(4);
  const s = parseFloat(n.toPrecision(8)).toString();
  return s;
}

export default function UnitConverterContent() {
  const [category, setCategory] = useState<Category>("Length");
  const [fromIdx, setFromIdx] = useState(2);
  const [toIdx, setToIdx] = useState(3);
  const [fromVal, setFromVal] = useState("1");
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

  const units = UNITS[category];
  const fromUnit = units[fromIdx] ?? units[0];
  const toUnit = units[toIdx] ?? units[1];

  const numVal = parseFloat(fromVal);
  const converted = isNaN(numVal) ? null : toUnit.fromBase(fromUnit.toBase(numVal));
  const resultStr = converted !== null ? fmtResult(converted) : "";

  function switchCategory(cat: Category) {
    setCategory(cat);
    setFromIdx(0);
    setToIdx(Math.min(1, UNITS[cat].length - 1));
    setFromVal("1");
  }

  function swap() {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
    setFromVal(resultStr || "1");
  }

  async function copy() {
    if (!resultStr) return;
    await navigator.clipboard.writeText(resultStr);
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
          <Link href="/tools" className="ink-hover">All Tools</Link> / Calculators & Converters / Unit Converter
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Unit Converter</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Convert length, weight, volume, temperature, area, and speed in seconds.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }} className="fade-in-up">

          {/* Category tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => switchCategory(cat)}
                style={{
                  padding: "9px 18px",
                  border: "2px solid #201e1d",
                  background: category === cat ? "#201e1d" : "transparent",
                  color: category === cat ? "#f3f2f2" : "#201e1d",
                  fontFamily: "var(--font-archivo)",
                  fontWeight: 700,
                  fontSize: 13,
                  transition: "background 0.15s ease, color 0.15s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Converter panel */}
          <div style={{ border: "2px solid #201e1d", padding: "clamp(20px, 3vw, 32px)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "end" }}>

              {/* From */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 8 }}>From</label>
                <select
                  value={fromIdx}
                  onChange={(e) => setFromIdx(Number(e.target.value))}
                  style={{
                    width: "100%",
                    border: "2px solid #201e1d",
                    background: "#f3f2f2",
                    color: "#201e1d",
                    fontFamily: "var(--font-archivo)",
                    fontWeight: 600,
                    fontSize: 14,
                    padding: "10px 14px",
                    outline: "none",
                    marginBottom: 10,
                    appearance: "none",
                  }}
                >
                  {units.map((u, i) => (
                    <option key={u.label} value={i}>{u.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={fromVal}
                  onChange={(e) => setFromVal(e.target.value)}
                  placeholder="Enter value"
                  style={{
                    width: "100%",
                    border: "2px solid #201e1d",
                    background: "transparent",
                    color: "#201e1d",
                    fontFamily: "var(--font-archivo)",
                    fontSize: 22,
                    fontWeight: 800,
                    padding: "14px 18px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Swap button */}
              <div style={{ paddingBottom: 4 }}>
                <button
                  type="button"
                  onClick={swap}
                  title="Swap units"
                  style={{
                    width: 44,
                    height: 44,
                    border: "2px solid #201e1d",
                    background: "transparent",
                    fontFamily: "var(--font-archivo)",
                    fontWeight: 800,
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.15s ease, color 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#201e1d"; e.currentTarget.style.color = "#f3f2f2"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#201e1d"; }}
                >
                  ⇄
                </button>
              </div>

              {/* To */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 8 }}>To</label>
                <select
                  value={toIdx}
                  onChange={(e) => setToIdx(Number(e.target.value))}
                  style={{
                    width: "100%",
                    border: "2px solid #201e1d",
                    background: "#f3f2f2",
                    color: "#201e1d",
                    fontFamily: "var(--font-archivo)",
                    fontWeight: 600,
                    fontSize: 14,
                    padding: "10px 14px",
                    outline: "none",
                    marginBottom: 10,
                    appearance: "none",
                  }}
                >
                  {units.map((u, i) => (
                    <option key={u.label} value={i}>{u.label}</option>
                  ))}
                </select>
                <div style={{
                  width: "100%",
                  border: "2px solid #201e1d",
                  background: "rgba(32,30,29,0.04)",
                  fontSize: 22,
                  fontWeight: 800,
                  padding: "14px 18px",
                  minHeight: 58,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}>
                  <span style={{ color: resultStr ? "#ec3013" : "#c8c6c5" }}>
                    {resultStr || "—"}
                  </span>
                  {resultStr && (
                    <button type="button" onClick={copy} style={{ background: "none", border: "none", fontFamily: "inherit", fontWeight: 700, fontSize: 12, opacity: 0.5 }} className="ink-hover">
                      {copied ? "✓" : "Copy"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Formula row */}
            {resultStr && fromVal && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(32,30,29,0.12)", fontSize: 14, opacity: 0.55, fontWeight: 500 }}>
                {fromVal} {fromUnit.label} = <strong style={{ color: "#201e1d", opacity: 1 }}>{resultStr} {toUnit.label}</strong>
              </div>
            )}
          </div>

          {/* Quick reference table */}
          {fromVal && resultStr && (
            <div style={{ marginTop: 20, border: "2px solid #201e1d", padding: "clamp(16px, 2.5vw, 24px)" }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, marginBottom: 14 }}>
                Quick reference — 1 {fromUnit.label} =
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {units
                  .filter((_, i) => i !== fromIdx)
                  .map((u) => {
                    const val = u.fromBase(fromUnit.toBase(1));
                    return (
                      <div key={u.label} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(32,30,29,0.1)" }}>
                        <span style={{ fontSize: 13, opacity: 0.55 }}>{u.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{fmtResult(val)}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            Each unit is defined by a pair of functions to and from a base unit (meters for length, kilograms for weight, etc.).
            Converting from A to B converts A to base first, then base to B — so adding new units only requires two functions each, never an N×N conversion table.
            Temperature uses offsets rather than ratios. All math runs in your browser with no network requests.
          </p>
        </div>
        <ToolEditorial toolName="Unit Converter" {...toolEditorialData["unit-converter"]} />
      </section>

              <ToolAdRail />
      </div>

      <SiteFooter />
    </main>
  );
}
