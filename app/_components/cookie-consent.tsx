"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "daliy-cookie-consent";

type ConsentChoice = "accepted" | "declined";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(window.localStorage.getItem(CONSENT_KEY) === null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function chooseConsent(choice: ConsentChoice) {
    window.localStorage.setItem(CONSENT_KEY, choice);
    window.dispatchEvent(new CustomEvent("daliy-consent-change", { detail: choice }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      className="cookie-consent"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        width: "min(680px, calc(100vw - 48px))",
        boxSizing: "border-box",
        padding: "20px 22px",
        border: "2px solid var(--border)",
        background: "var(--bg)",
        color: "var(--ink)",
        boxShadow: "8px 8px 0 var(--border)",
      }}
    >
      <div className="cookie-consent-copy" style={{ maxWidth: 470 }}>
        <p className="cookie-consent-title" style={{ marginBottom: 6, fontSize: 14, fontWeight: 800 }}>
          Cookies & privacy
        </p>
        <p style={{ color: "rgba(var(--ink-rgb), 0.68)", fontSize: 13, lineHeight: 1.5 }}>
          We use cookies and similar technologies for advertising and site
          functionality. Read our <Link href="/privacy-policy">Privacy Policy</Link> for details.
        </p>
      </div>
      <div className="cookie-consent-actions" style={{ display: "flex", flexShrink: 0, gap: 8 }}>
        <button
          type="button"
          className="cookie-consent-decline"
          onClick={() => chooseConsent("declined")}
          style={{ minWidth: 80, padding: "10px 14px", border: "2px solid var(--border)", background: "transparent", color: "var(--ink)", cursor: "pointer", font: "700 12px/1 var(--font-archivo), sans-serif" }}
        >
          Decline
        </button>
        <button
          type="button"
          className="cookie-consent-accept"
          onClick={() => chooseConsent("accepted")}
          style={{ minWidth: 80, padding: "10px 14px", border: "2px solid var(--red)", background: "var(--red)", color: "var(--on-solid)", cursor: "pointer", font: "700 12px/1 var(--font-archivo), sans-serif" }}
        >
          Accept
        </button>
      </div>
    </aside>
  );
}
