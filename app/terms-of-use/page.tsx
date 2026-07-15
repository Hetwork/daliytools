import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read the Terms of Use for Daliy.Tools. By accessing our website you agree to these terms.",
};

const sections = [
  {
    heading: "Acceptance of Terms",
    body: `By accessing or using https://daliy.tools (the "Site"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Site.`,
  },
  {
    heading: "Use of the Site",
    body: `Daliy.Tools provides a collection of free online utilities for personal and professional use. You may use the Site and its tools for any lawful purpose. You agree not to use the Site to transmit any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.`,
  },
  {
    heading: "Intellectual Property",
    body: `All content on the Site, including but not limited to text, graphics, logos, and code, is the property of Daliy.Tools or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
  },
  {
    heading: "User-Provided Content",
    body: `Some tools may allow you to upload or paste content for processing. We do not store, share, or claim ownership of any content you provide. All processing happens on our servers solely to deliver the requested tool output and is discarded immediately after.`,
  },
  {
    heading: "Disclaimer of Warranties",
    body: `The Site and its tools are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses. You use the Site entirely at your own risk.`,
  },
  {
    heading: "Limitation of Liability",
    body: `To the maximum extent permitted by law, Daliy.Tools and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Site or any tool it provides.`,
  },
  {
    heading: "Third-Party Services",
    body: `The Site uses third-party services including Google AdSense for advertising. Your use of such third-party services is subject to their respective terms and privacy policies. We are not responsible for the content or practices of third-party providers.`,
  },
  {
    heading: "Modifications",
    body: `We reserve the right to modify these Terms of Use at any time. Changes become effective immediately upon posting to the Site. Your continued use of the Site after changes are posted constitutes your acceptance of the revised terms.`,
  },
  {
    heading: "Governing Law",
    body: `These Terms of Use shall be governed by and construed in accordance with applicable law, without regard to conflict of law principles.`,
  },
  {
    heading: "Contact",
    body: `If you have any questions about these Terms of Use, please contact us at: daliytools0312@gmail.com`,
  },
];

export default function TermsOfUsePage() {
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
            Terms of Use
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
                style={{ fontSize: 12, opacity: 0.3, fontWeight: 500, letterSpacing: "0.06em", textDecoration: "none", color: "#f3f2f2" }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-use"
                style={{ fontSize: 12, opacity: 0.5, fontWeight: 600, letterSpacing: "0.06em", textDecoration: "none", color: "#f3f2f2" }}
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
