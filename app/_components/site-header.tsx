"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import Icon from "./icon";

const links = [{ href: "/", label: "Home" }, { href: "/tools", label: "Tools" }, { href: "/blogs", label: "Blog" }, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }];
export default function SiteHeader({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <header className="site-header">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="header-inner">
      <Link href="/" className="brand" aria-label="Daliy Tools home"><span className="brand-mark"><Icon name="grid" size={19} /></span>daliy<span className="brand-dot">.</span>tools</Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <Link key={link.href} href={link.href} className={active === link.label || (!active && pathname === link.href) ? "selected" : ""} aria-current={active === link.label || (!active && pathname === link.href) ? "page" : undefined}>{link.label}</Link>)}</nav>
      <div className="header-actions"><ThemeToggle /><Link href="/tools" className="header-cta">Explore tools <Icon name="arrow" size={15} /></Link><button className="menu-toggle" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button></div>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={active === link.label ? "page" : undefined}>{link.label}<Icon name="right" size={16} /></Link>)}</nav>}
  </header>;
}
