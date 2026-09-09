"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolAdRail from "../../_components/tool-ad-rail";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

function parseField(field: string, min: number, max: number): Set<number> | null {
  const out = new Set<number>();

  const pushRange = (start: number, end: number, step = 1) => {
    for (let i = start; i <= end; i += step) out.add(i);
  };

  const parseToken = (token: string) => {
    if (token === "*") {
      pushRange(min, max);
      return;
    }

    if (token.startsWith("*/")) {
      const step = Number(token.slice(2));
      if (!Number.isInteger(step) || step < 1) throw new Error("Invalid step");
      pushRange(min, max, step);
      return;
    }

    if (token.includes("-")) {
      const [a, b] = token.split("-").map(Number);
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < min || b > max || a > b) throw new Error("Invalid range");
      pushRange(a, b);
      return;
    }

    const value = Number(token);
    if (!Number.isInteger(value) || value < min || value > max) throw new Error("Invalid value");
    out.add(value);
  };

  try {
    field.split(",").forEach((token) => parseToken(token.trim()));
    return out;
  } catch {
    return null;
  }
}

function explainField(name: string, value: string): string {
  if (value === "*") return `Every ${name}`;
  if (value.startsWith("*/")) return `Every ${value.slice(2)} ${name}${value.slice(2) === "1" ? "" : "s"}`;
  if (value.includes(",")) return `${name} ${value}`;
  if (value.includes("-")) return `${name} ${value}`;
  return `${name} ${value}`;
}

function nextRuns(expression: string, count = 5): Date[] {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) return [];

  const [m, h, dom, mon, dow] = fields;
  const minutes = parseField(m, 0, 59);
  const hours = parseField(h, 0, 23);
  const days = parseField(dom, 1, 31);
  const months = parseField(mon, 1, 12);
  const weekdays = parseField(dow, 0, 6);
  if (!minutes || !hours || !days || !months || !weekdays) return [];

  const now = new Date();
  const cursor = new Date(now.getTime());
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const results: Date[] = [];
  let guard = 0;
  while (results.length < count && guard < 600000) {
    guard += 1;
    const minute = cursor.getMinutes();
    const hour = cursor.getHours();
    const day = cursor.getDate();
    const month = cursor.getMonth() + 1;
    const weekday = cursor.getDay();

    if (minutes.has(minute) && hours.has(hour) && days.has(day) && months.has(month) && weekdays.has(weekday)) {
      results.push(new Date(cursor.getTime()));
    }

    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return results;
}

export default function CronGeneratorContent() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
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

  const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  const schedule = useMemo(() => nextRuns(expression, 6), [expression]);
  const isValid = schedule.length > 0;

  function copyExpression() {
    navigator.clipboard.writeText(expression).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <main className="noise" style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}>
      <SiteHeader active="Tools" />

      <div className="tool-ad-layout">
        <ToolAdRail />

      <section style={{ maxWidth: 980, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}>
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Developer Tools / Cron Generator
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>5-field cron expression builder</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Cron Expression Builder</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 700 }}>
            Build cron schedules with quick presets, inspect the expression, and preview upcoming execution times.
          </p>
        </div>

        <div className="fade-in-up" style={{ marginTop: "clamp(36px, 6vw, 56px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}><span style={{ fontSize: 12, opacity: 0.55, fontWeight: 700 }}>Minute</span><input value={minute} onChange={(event) => setMinute(event.target.value)} placeholder="* or */5" style={{ border: "2px solid #201e1d", background: "transparent", padding: "10px 12px", fontFamily: "monospace" }} /></label>
          <label style={{ display: "grid", gap: 6 }}><span style={{ fontSize: 12, opacity: 0.55, fontWeight: 700 }}>Hour</span><input value={hour} onChange={(event) => setHour(event.target.value)} placeholder="* or 9" style={{ border: "2px solid #201e1d", background: "transparent", padding: "10px 12px", fontFamily: "monospace" }} /></label>
          <label style={{ display: "grid", gap: 6 }}><span style={{ fontSize: 12, opacity: 0.55, fontWeight: 700 }}>Day of month</span><input value={dayOfMonth} onChange={(event) => setDayOfMonth(event.target.value)} placeholder="* or 1-5" style={{ border: "2px solid #201e1d", background: "transparent", padding: "10px 12px", fontFamily: "monospace" }} /></label>
          <label style={{ display: "grid", gap: 6 }}><span style={{ fontSize: 12, opacity: 0.55, fontWeight: 700 }}>Month</span><input value={month} onChange={(event) => setMonth(event.target.value)} placeholder="* or 1,6,12" style={{ border: "2px solid #201e1d", background: "transparent", padding: "10px 12px", fontFamily: "monospace" }} /></label>
          <label style={{ display: "grid", gap: 6 }}><span style={{ fontSize: 12, opacity: 0.55, fontWeight: 700 }}>Day of week</span><input value={dayOfWeek} onChange={(event) => setDayOfWeek(event.target.value)} placeholder="* or 1-5" style={{ border: "2px solid #201e1d", background: "transparent", padding: "10px 12px", fontFamily: "monospace" }} /></label>
        </div>

        <div className="fade-in-up" style={{ marginTop: 16, border: "2px solid #201e1d", padding: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.45, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Expression</p>
          <p style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{expression}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" className="btn btn-primary" onClick={copyExpression}>{copied ? "Copied" : "Copy expression"}</button>
            <button type="button" className="btn" onClick={() => { setMinute("0"); setHour("9"); setDayOfMonth("*"); setMonth("*"); setDayOfWeek("1-5"); }}>Workdays 09:00</button>
            <button type="button" className="btn" onClick={() => { setMinute("*/15"); setHour("*"); setDayOfMonth("*"); setMonth("*"); setDayOfWeek("*"); }}>Every 15 minutes</button>
            <button type="button" className="btn" onClick={() => { setMinute("0"); setHour("0"); setDayOfMonth("1"); setMonth("*"); setDayOfWeek("*"); }}>Monthly</button>
          </div>
          <p style={{ marginTop: 10, fontSize: 13, opacity: 0.65 }}>
            {explainField("minute", minute)}, {explainField("hour", hour)}, {explainField("day-of-month", dayOfMonth)}, {explainField("month", month)}, {explainField("day-of-week", dayOfWeek)}
          </p>
          {!isValid && <p style={{ marginTop: 8, color: "#ec3013", fontWeight: 600, fontSize: 13 }}>Expression contains an invalid field syntax.</p>}
        </div>

        <div className="fade-in-up" style={{ marginTop: 16, border: "2px solid #201e1d", padding: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.45, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Upcoming Runs</p>
          {schedule.length === 0 ? (
            <p style={{ fontSize: 13, opacity: 0.65 }}>No schedule preview available for this expression.</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {schedule.map((date, index) => (
                <p key={`${date.toISOString()}-${index}`} style={{ fontSize: 14, fontFamily: "monospace" }}>{date.toLocaleString()}</p>
              ))}
            </div>
          )}
        </div>
        <ToolEditorial toolName="Cron Expression Builder" {...toolEditorialData["cron-generator"]} />
      </section>

              <ToolAdRail />
      </div>

      <SiteFooter />
    </main>
  );
}
