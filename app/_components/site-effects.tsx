"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SiteEffects() {
  const pathname = usePathname();
  useEffect(() => {
    const main = document.querySelector("main");
    const target = main?.querySelector<HTMLElement>("section") || main;
    if (target && !document.getElementById("main-content")) { target.id = "main-content"; target.tabIndex = -1; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in-view");
        observer.unobserve(entry.target);
      }
    }), { threshold: .08 });
    document.querySelectorAll(".scroll-reveal").forEach(element => { element.classList.add("will-reveal"); observer.observe(element); });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
