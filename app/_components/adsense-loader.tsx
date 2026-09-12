"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "daliy-cookie-consent";

export default function AdsenseLoader() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAllowed(window.localStorage.getItem(CONSENT_KEY) === "accepted");
    }, 0);
    const handleConsentChange = (event: Event) => {
      const choice = (event as CustomEvent<"accepted" | "declined">).detail;
      setAllowed(choice === "accepted");
    };
    window.addEventListener("daliy-consent-change", handleConsentChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("daliy-consent-change", handleConsentChange);
    };
  }, []);

  if (!allowed) return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5099034972283695"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
