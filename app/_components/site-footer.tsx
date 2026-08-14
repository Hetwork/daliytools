import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
];

export default function SiteFooter() {
  return (
    <footer
      style={{
        background: "#201e1d",
        color: "#f3f2f2",
        padding: "clamp(40px, 6vw, 72px) 32px",
        marginTop: "clamp(48px, 8vw, 96px)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="reveal">
          <p
            style={{
              fontSize: "clamp(28px, 5vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Welcome to Daliy
            <span style={{ color: "#ec3013" }}>.</span>
            Tools.
          </p>
          <p
            style={{
              marginTop: 16,
              fontSize: "clamp(14px, 1.5vw, 17px)",
              opacity: 0.45,
              fontWeight: 400,
            }}
          >
            We promise the tools are spelled correctly.
          </p>
        </div>
        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid rgba(243,242,242,0.12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: 12,
              opacity: 0.3,
              fontWeight: 500,
              letterSpacing: "0.06em",
            }}
          >
            daliy.tools — everyday utilities
          </p>
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 12,
                  opacity: 0.3,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textDecoration: "none",
                  color: "#f3f2f2",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.3")}
              >
                {link.label}
              </Link>
            ))}
            <p style={{ fontSize: 12, opacity: 0.3, fontWeight: 500 }}>
              © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
