"use client";

import { useSyncExternalStore } from "react";
import Icon from "./icon";

const key = "daliy-theme";
function getSnapshot() { return document.documentElement.dataset.theme === "dark"; }
function subscribe(callback: () => void) {
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const sync = () => {
    let preference: string | null = null;
    try { preference = localStorage.getItem(key); } catch {}
    document.documentElement.dataset.theme = preference === "dark" || (preference !== "light" && system.matches) ? "dark" : "light";
    callback();
  };
  const onStorage = (event: StorageEvent) => { if (event.key === key || event.key === null) sync(); };
  system.addEventListener("change", sync);
  window.addEventListener("storage", onStorage);
  window.addEventListener("daliy-theme-change", callback);
  return () => {
    system.removeEventListener("change", sync);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("daliy-theme-change", callback);
  };
}
export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => false);
  function toggle() {
    const theme = getSnapshot() ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(key, theme); } catch {}
    window.dispatchEvent(new Event("daliy-theme-change"));
  }
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title={dark ? "Switch to light theme" : "Switch to dark theme"}><span className="theme-sun"><Icon name="sun" /></span><span className="theme-moon"><Icon name="moon" /></span></button>;
}
