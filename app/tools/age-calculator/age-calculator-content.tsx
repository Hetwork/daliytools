"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  nextBirthday: { days: number; date: string };
  isToday: boolean;
}

function calcAge(dob: string, refDate: string): AgeResult | null {
  if (!dob || !refDate) return null;
  const birth = new Date(dob);
  const ref = new Date(refDate);
  if (isNaN(birth.getTime()) || isNaN(ref.getTime())) return null;
  if (birth > ref) return null;

  let years = ref.getFullYear() - birth.getFullYear();
  let months = ref.getMonth() - birth.getMonth();
  let days = ref.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const msPerDay = 86400000;
  const totalDays = Math.floor((ref.getTime() - birth.getTime()) / msPerDay);

  const nextBirthdayDate = new Date(ref.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthdayDate <= ref) nextBirthdayDate.setFullYear(ref.getFullYear() + 1);
  const daysToNextBirthday = Math.ceil((nextBirthdayDate.getTime() - ref.getTime()) / msPerDay);

  const isToday = birth.getMonth() === ref.getMonth() && birth.getDate() === ref.getDate();

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalMonths: years * 12 + months,
    totalHours: totalDays * 24,
    nextBirthday: {
      days: isToday ? 0 : daysToNextBirthday,
      date: nextBirthdayDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    },
    isToday,
  };
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function plural(n: number, word: string): string {
  return `${n.toLocaleString()} ${word}${n !== 1 ? "s" : ""}`;
}

export default function AgeCalculatorContent() {
  const [dob, setDob] = useState("");
  const [refDate, setRefDate] = useState(todayStr());
  const [useToday, setUseToday] = useState(true);
  const [result, setResult] = useState<AgeResult | null>(null);

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
    if (useToday) setRefDate(todayStr());
  }, [useToday]);

  useEffect(() => {
    setResult(calcAge(dob, refDate));
  }, [dob, refDate]);

  const STATS = result
    ? [
        { label: "Total days lived",   value: result.totalDays.toLocaleString() },
        { label: "Total weeks",         value: result.totalWeeks.toLocaleString() },
        { label: "Total months",        value: result.totalMonths.toLocaleString() },
        { label: "Total hours",         value: result.totalHours.toLocaleString() },
      ]
    : [];

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
          <Link href="/tools" className="ink-hover">All Tools</Link> / Calculators & Converters / Age Calculator
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Age Calculator</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Find the exact age between two dates — down to years, months, and days.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }} className="fade-in-up">

          {/* Inputs */}
          <div style={{ border: "2px solid #201e1d", padding: "clamp(20px, 3vw, 28px)", marginBottom: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, flexWrap: "wrap" }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 8 }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  max={refDate}
                  style={{
                    width: "100%",
                    border: "2px solid #201e1d",
                    background: "transparent",
                    color: "#201e1d",
                    fontFamily: "var(--font-archivo)",
                    fontSize: 16,
                    fontWeight: 700,
                    padding: "14px 18px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45 }}>
                    Age at date
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseToday(!useToday)}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", fontFamily: "inherit", fontSize: 12, fontWeight: 700, opacity: 0.5 }}
                  >
                    <span style={{
                      width: 32,
                      height: 18,
                      background: useToday ? "#ec3013" : "#c8c6c5",
                      borderRadius: 9,
                      position: "relative",
                      display: "inline-block",
                      transition: "background 0.2s",
                      flexShrink: 0,
                    }}>
                      <span style={{
                        position: "absolute",
                        top: 1,
                        left: useToday ? 15 : 1,
                        width: 16,
                        height: 16,
                        background: "#f3f2f2",
                        borderRadius: "50%",
                        transition: "left 0.2s",
                      }} />
                    </span>
                    Today
                  </button>
                </div>
                <input
                  type="date"
                  value={refDate}
                  onChange={(e) => { setRefDate(e.target.value); setUseToday(false); }}
                  disabled={useToday}
                  style={{
                    width: "100%",
                    border: "2px solid #201e1d",
                    background: useToday ? "rgba(32,30,29,0.04)" : "transparent",
                    color: useToday ? "rgba(32,30,29,0.35)" : "#201e1d",
                    fontFamily: "var(--font-archivo)",
                    fontSize: 16,
                    fontWeight: 700,
                    padding: "14px 18px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {dob && result === null && (
              <p style={{ marginTop: 12, fontSize: 13, color: "#ec3013", fontWeight: 600 }}>
                Date of birth must be before the reference date.
              </p>
            )}
          </div>

          {/* Main result */}
          {result && (
            <>
              {result.isToday && (
                <div style={{ background: "#ec3013", color: "#f3f2f2", padding: "12px 20px", marginBottom: 16, fontWeight: 700, fontSize: 15, letterSpacing: "0.02em" }}>
                  🎂 Happy Birthday!
                </div>
              )}

              <div style={{ border: "2px solid #201e1d", padding: "clamp(24px, 4vw, 40px)", marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>Exact Age</p>
                <div style={{ display: "flex", gap: "clamp(24px, 4vw, 48px)", flexWrap: "wrap" }}>
                  {[
                    { value: result.years,  label: "Years"  },
                    { value: result.months, label: "Months" },
                    { value: result.days,   label: "Days"   },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <p style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", color: "#ec3013" }}>
                        {value}
                      </p>
                      <p style={{ fontSize: 14, fontWeight: 600, opacity: 0.5, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
                {STATS.map(({ label, value }) => (
                  <div key={label} style={{ border: "2px solid #201e1d", padding: "16px 20px" }}>
                    <p style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, letterSpacing: "-0.01em" }}>{value}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.45, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Next birthday */}
              <div style={{ border: "2px solid #201e1d", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, marginBottom: 4 }}>
                    {result.isToday ? "Next Birthday" : "Days until next birthday"}
                  </p>
                  <p style={{ fontSize: "clamp(17px, 2vw, 22px)", fontWeight: 800 }}>
                    {result.isToday
                      ? result.nextBirthday.date
                      : plural(result.nextBirthday.days, "day")}
                  </p>
                </div>
                {!result.isToday && (
                  <p style={{ fontSize: 14, opacity: 0.5 }}>{result.nextBirthday.date}</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            Age is calculated by subtracting the birth date from the reference date in full calendar units — borrowing days from the previous month when needed, and borrowing months when the month count goes negative. This matches how ages are expressed in everyday language. All statistics (total days, weeks, hours) are derived from the raw millisecond difference between the two dates.
          </p>
        </div>
        <ToolEditorial toolName="Age Calculator" {...toolEditorialData["age-calculator"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
