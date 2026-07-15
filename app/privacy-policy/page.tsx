import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Daliy.Tools handles your data. We keep it simple: we don't collect personal information, and we use Google AdSense to serve ads.",
};

const sections = [
  {
    heading: "Overview",
    body: `Daliy.Tools ("we", "us", or "our") operates the website https://daliy.tools. This Privacy Policy explains what information we collect, how we use it, and your rights in relation to it. By using the site you agree to the practices described here.`,
  },
  {
    heading: "Information We Collect",
    body: `We do not ask you to create an account, and we do not knowingly collect personally identifiable information. When you visit the site, standard server logs and third-party analytics may record your IP address, browser type, referring URL, and pages visited. This data is used only in aggregate to understand traffic patterns.`,
  },
  {
    heading: "Cookies",
    body: `We use cookies solely through third-party services described below. You can control cookies through your browser settings. Disabling cookies may affect how ads are displayed but will not prevent you from using our tools.`,
  },
  {
    heading: "Google AdSense & Advertising",
    body: `We use Google AdSense to display advertisements. Google and its partners may use cookies to serve ads based on your prior visits to this site or other sites on the internet. You can opt out of personalised advertising by visiting https://www.google.com/settings/ads or by visiting https://www.aboutads.info. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the internet. For more information on how Google uses data, please visit https://policies.google.com/technologies/partner-sites.`,
  },
  {
    heading: "Third-Party Links",
    body: `Our site may contain links to third-party websites. We have no control over the content or privacy practices of those sites and are not responsible for them. We encourage you to review the privacy policy of every site you visit.`,
  },
  {
    heading: "Children's Privacy",
    body: `Daliy.Tools is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.`,
  },
  {
    heading: "Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the bottom of this page. We encourage you to review this page periodically for any changes.`,
  },
  {
    heading: "Contact",
    body: `If you have any questions about this Privacy Policy, please contact us at: daliytools0312@gmail.com`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main
      style={{
        background: "#f3f2f2",
        color: "#201e1d",
        fontFamily: "var(--font-archivo), sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: "clamp(48px, 10vw, 80px)",
        }}
      >
        <div style={{ height: 12, background: "#201e1d", marginBottom: 28 }} />
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            daliy<span style={{ color: "#ec3013" }}>.</span>tools
          </Link>
          <span
            style={{
              fontSize: "clamp(10px, 1.2vw, 12px)",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.4,
            }}
          >
            Privacy Policy
          </span>
        </div>
        <div style={{ height: 12, background: "#201e1d", marginTop: 28 }} />
      </section>

      {/* Content */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(48px, 8vw, 80px) 32px",
        }}
      >
        <p
          style={{
            fontSize: "clamp(11px, 1.3vw, 13px)",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            opacity: 0.4,
            marginBottom: 40,
          }}
        >
          Last updated: July 15, 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {sections.map((s) => (
            <div key={s.heading}>
              <p
                style={{
                  fontSize: "clamp(18px, 2.5vw, 26px)",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  marginBottom: 14,
                }}
              >
                {s.heading}
              </p>
              <p
                style={{
                  fontSize: "clamp(14px, 1.6vw, 17px)",
                  fontWeight: 400,
                  lineHeight: 1.8,
                  opacity: 0.75,
                  maxWidth: 700,
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#201e1d",
          color: "#f3f2f2",
          padding: "clamp(32px, 5vw, 56px) 32px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <Link
              href="/"
              style={{
                fontSize: 12,
                opacity: 0.3,
                fontWeight: 500,
                letterSpacing: "0.06em",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              ← Back to daliy.tools
            </Link>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <Link
                href="/privacy-policy"
                style={{ fontSize: 12, opacity: 0.5, fontWeight: 600, letterSpacing: "0.06em", textDecoration: "none", color: "#f3f2f2" }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-use"
                style={{ fontSize: 12, opacity: 0.3, fontWeight: 500, letterSpacing: "0.06em", textDecoration: "none", color: "#f3f2f2" }}
              >
                Terms of Use
              </Link>
              <p style={{ fontSize: 12, opacity: 0.3, fontWeight: 500 }}>
                © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
