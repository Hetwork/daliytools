import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/blogs", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader({ active }: { active?: string }) {
  return (
    <section
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "0 32px",
        paddingTop: "clamp(48px, 10vw, 80px)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        className="line-animated"
        style={{ height: 12, background: "#201e1d", marginBottom: 28 }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          className="logo-text"
          style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textDecoration: "none",
            color: "inherit",
            userSelect: "none",
          }}
        >
          daliy<span style={{ color: "#ec3013" }}>.</span>tools
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${active === link.label ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div
        className="line-animated"
        style={{
          height: 12,
          background: "#201e1d",
          marginTop: 28,
          animationDelay: "0.15s",
        }}
      />
    </section>
  );
}
