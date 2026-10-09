"use client";

import { useRef } from "react";
import Icon from "./icon";

export default function Sculpture({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  return <div className={`sculpture ${compact ? "sculpture-compact" : ""}`} aria-hidden="true" onPointerMove={event => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    ref.current?.style.setProperty("--pointer-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 12}deg`);
    ref.current?.style.setProperty("--pointer-y", `${((event.clientY - bounds.top) / bounds.height - .5) * -12}deg`);
  }} onPointerLeave={() => { ref.current?.style.setProperty("--pointer-x", "0deg"); ref.current?.style.setProperty("--pointer-y", "0deg"); }}>
    <div className="sculpture-grid" /><div className="sculpture-halo" />
    <div ref={ref} className="sculpture-scene">
      <div className="orbit orbit-one" /><div className="orbit orbit-two" />
      <div className="cube-float"><div className="cube">{["front", "back", "right", "left", "top", "bottom"].map(face => <div key={face} className={`cube-face cube-${face}`}><Icon name="grid" size={72} /></div>)}</div></div>
      <div className="sculpture-ring"><div /></div><div className="sculpture-sphere" /><div className="small-sphere" />
      <div className="floating-tile tile-pdf"><Icon name="pdf" size={24} /><span>PDF</span></div><div className="floating-tile tile-code"><Icon name="code" size={26} /></div><div className="floating-tile tile-image"><Icon name="image" size={26} /></div>
      <div className="sculpture-caption"><span /> Less busywork. More possibilities.</div>
    </div><div className="sculpture-shadow" />
  </div>;
}
