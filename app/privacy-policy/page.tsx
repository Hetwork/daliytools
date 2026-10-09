import type { Metadata } from "next";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Daliy.Tools handles local file processing, server-based tools, contact submissions, cookies, and advertising data.",
};

const sections = [
  {
    heading: "Overview",
    body: `Daliy.Tools ("we", "us", or "our") operates the website https://daliy.tools. This Privacy Policy explains what information we collect, how we use it, and your rights in relation to it. By using the site you agree to the practices described here.`,
  },
  {
    heading: "Information We Collect",
    body: `You can use our tools without creating an account. Some tools process your files or text locally in your browser, while tools that use a server or third-party API may transmit the information needed to provide the requested result. If you contact us, we collect the name, email address, subject, and message that you submit. The contact form may also send your IP address, approximate location, browser user agent, browser language, timezone, organization, and submission time. We use this information to respond to you, investigate support requests, prevent abuse, and operate the site.`,
  },
  {
    heading: "Third-Party Processors and Storage",
    body: `The contact form uses ipapi.co to look up location information associated with the submitting IP address. Contact submissions are sent through our contact API to the Google Sheets or connected automation endpoint configured by the site operator, where they are stored for support and record-keeping. Google AdSense and its advertising partners may process device and browsing information through cookies and similar technologies to deliver and measure advertisements. We do not sell contact information. Tool data sent to a server or third-party API is handled by that service according to its applicable terms and privacy policy.`,
  },
  {
    heading: "Retention and Deletion",
    body: `We do not currently promise a fixed number of days for retaining contact messages and related metadata. They are retained only for as long as reasonably necessary to respond to requests, maintain support records, resolve disputes, and meet legal or security requirements. We review stored contact information periodically and delete it when it is no longer needed. You may request access to or deletion of your contact submission by emailing daliytools0312@gmail.com. Some information may need to be retained where required by law or needed to protect the site. Files processed locally in your browser remain under your control; server-based tools and third-party services may have their own retention rules.`,
  },
  {
    heading: "Cookies",
    body: `We use a local browser preference named daliy-cookie-consent to remember whether you accepted or declined this notice. We also use cookies and similar technologies through third-party services described below, including advertising services. You can control cookies through your browser settings. Disabling cookies may affect how ads are displayed but will not prevent you from using our tools.`,
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
