"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const HILLTOP_SCRIPT =
  "//juvenilechoice.com/bqXjV.srdTGIlY0wY/WMck/AeMmL9/u/ZIUslQkEPJT/ctzPOIT-UczAMoj/k/tMNBzjMs5/N/TEMszeMawp";
const HILLTOP_RIGHT_SCRIPT =
  "//juvenilechoice.com/bFXwVns/d.GRll0FYkWhch/SewmC9OulZ/UPlSk/PrTccE0ZM-DWE/3/MJjtk/t/NFzFQEwQMYTwc-zaMWwZ";
const AD_ROUTE_KEY = "daliy-tools-ad-route";

/**
 * Sidebar ad rail that loads the Hilltop ad network script.
 * Shown only on viewports >= 1260 px wide (hidden via CSS below that).
 */
export default function ToolAdRail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rail = container.parentElement;
    const isRightRail = rail?.parentElement?.lastElementChild === rail;

    if (isRightRail) {
      const previousPathname = window.sessionStorage.getItem(AD_ROUTE_KEY);
      if (previousPathname && previousPathname !== pathname) {
        window.sessionStorage.setItem(AD_ROUTE_KEY, pathname);
        const loader = document.createElement("div");
        loader.className = "ad-page-loader";
        loader.setAttribute("role", "status");
        loader.setAttribute("aria-label", "Loading page");
        loader.innerHTML = '<span class="ad-page-loader__spinner"></span>';
        document.body.appendChild(loader);
        window.setTimeout(() => window.location.reload(), 80);
        return;
      }
      window.sessionStorage.setItem(AD_ROUTE_KEY, pathname);
    }

    container.replaceChildren();

    const placement = isRightRail ? "right" : "left";
    const scriptUrl = `${
      isRightRail ? HILLTOP_RIGHT_SCRIPT : HILLTOP_SCRIPT
    }?page=${encodeURIComponent(pathname)}&rail=${placement}`;
    const bootstrap = document.createElement("script");
    bootstrap.textContent = `
      (function(pucp) {
        var d = document,
            s = d.createElement('script'),
            l = d.currentScript || d.scripts[d.scripts.length - 1];
        s.settings = pucp || {};
        s.src = "${scriptUrl}";
        s.async = true;
        s.referrerPolicy = 'no-referrer-when-downgrade';
        l.parentNode.insertBefore(s, l);
      })({});
    `;
    container.appendChild(bootstrap);

    return () => {
      container.replaceChildren();
    };
  }, [pathname]);

  return (
    <aside className="tool-ad-rail" aria-label="Advertisement">
      <div ref={containerRef} />
    </aside>
  );
}
