import type { Metadata } from "next";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";

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
    body: `Some tools may allow you to upload or paste content for processing. Depending on the tool, processing may happen entirely in your browser, on our servers, or through a third-party API. The applicable tool page should describe its processing method and any relevant limitations. We do not claim ownership of your content. Do not submit confidential or sensitive information unless you understand how the selected tool processes it. Any content sent to a server or third-party provider may be subject to that provider's terms, privacy policy, and retention practices.`,
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
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: "var(--font-archivo), sans-serif",
        minHeight: "100vh",
      }}
    >
      <SiteHeader />
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
              <h2
                style={{
                  fontSize: "clamp(18px, 2.5vw, 26px)",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  margin: "0 0 14px",
                }}
              >
                {s.heading}
              </h2>
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

      <SiteFooter />
    </main>
  );
}
