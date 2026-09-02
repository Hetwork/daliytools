"use client";

import { useEffect, useState } from "react";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";

const CONTACT_SHEET_URL = process.env.NEXT_PUBLIC_CONTACT_SHEET_URL || "";

async function getUserLocation() {
  try {
    const response = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (!response.ok) return {};
    return await response.json();
  } catch {
    return {};
  }
}

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Tool Suggestion",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document
      .querySelectorAll(".reveal, .reveal-fast")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("daliytools0312@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const location = await getUserLocation();

      if (!CONTACT_SHEET_URL) {
        throw new Error("Google Sheets endpoint is not configured. Add NEXT_PUBLIC_CONTACT_SHEET_URL to your environment.");
      }

      const response = await fetch(CONTACT_SHEET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ip: location.ip || "",
          city: location.city || "",
          region: location.region || "",
          country: location.country_name || location.country || "",
          countryCode: location.country_code || "",
          postal: location.postal || "",
          timezone: location.timezone || "",
          org: location.org || "",
          latitude: location.latitude || "",
          longitude: location.longitude || "",
          userAgent: navigator.userAgent,
          language: navigator.language,
          page: "daliytools-contact",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Your message could not be sent.");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "Tool Suggestion", message: "" });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong while sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="noise"
      style={{
        background: "#f3f2f2",
        color: "#201e1d",
        fontFamily: "var(--font-archivo), sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <SiteHeader active="Contact" />

      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: "clamp(40px, 7vw, 72px)",
          paddingBottom: "clamp(48px, 8vw, 88px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Category Label */}
        <p
          style={{
            fontSize: "clamp(11px, 1.4vw, 13px)",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.45,
            marginBottom: 16,
          }}
        >
          Support & Feedback
        </p>

        {/* Page Title */}
        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: 700,
          }}
        >
          Get in touch with us<span style={{ color: "#ec3013" }}>.</span>
        </h1>

        <p
          style={{
            marginTop: 20,
            fontSize: "clamp(16px, 1.8vw, 20px)",
            lineHeight: 1.6,
            opacity: 0.75,
            maxWidth: 620,
          }}
        >
          Have a tool idea? Found a bug? Or just want to ask how something works? We read every single note that comes in.
        </p>

        {/* Contact Info Cards Grid */}
        <div
          style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {/* Direct Email Card */}
          <div
            style={{
              border: "2px solid #201e1d",
              background: "#fff",
              padding: "clamp(24px, 4vw, 36px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#ec3013",
                }}
              >
                Direct Email
              </span>
              <h2
                style={{
                  fontSize: "clamp(20px, 2.5vw, 26px)",
                  fontWeight: 800,
                  marginTop: 8,
                  marginBottom: 12,
                }}
              >
                Email Our Team
              </h2>
              <p style={{ opacity: 0.7, fontSize: 14, lineHeight: 1.6 }}>
                For urgent inquiries, partnership requests, or detailed bug reports with file examples, shoot us an email directly.
              </p>
              <div
                style={{
                  marginTop: 20,
                  padding: "12px 16px",
                  background: "#f3f2f2",
                  border: "1px dashed #201e1d",
                  fontSize: 15,
                  fontWeight: 600,
                  wordBreak: "break-all",
                }}
              >
                daliytools0312@gmail.com
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="mailto:daliytools0312@gmail.com"
                className="btn btn-primary"
                style={{ fontSize: 13, padding: "10px 18px" }}
              >
                Send Email &rarr;
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="btn"
                style={{ fontSize: 13, padding: "10px 18px", cursor: "pointer" }}
              >
                {copied ? "Copied!" : "Copy Address"}
              </button>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div
            style={{
              border: "2px solid #201e1d",
              background: "#fff",
              padding: "clamp(24px, 4vw, 36px)",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#ec3013",
              }}
            >
              Quick Form
            </span>
            <h2
              style={{
                fontSize: "clamp(20px, 2.5vw, 26px)",
                fontWeight: 800,
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              Send a Message
            </h2>

            {submitted ? (
              <div
                style={{
                  padding: 24,
                  background: "#f3f2f2",
                  border: "2px solid #201e1d",
                  marginTop: 16,
                }}
              >
                <p style={{ fontWeight: 800, fontSize: 18, color: "#ec3013" }}>
                  Thank you for reaching out!
                </p>
                <p style={{ marginTop: 8, opacity: 0.8, fontSize: 14, lineHeight: 1.6 }}>
                  Your message has been recorded. We will review your feedback and get back to you if a response is needed.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmitError("");
                    setFormData({ name: "", email: "", subject: "Tool Suggestion", message: "" });
                  }}
                  className="btn"
                  style={{ marginTop: 16, fontSize: 12 }}
                >
                  Send another note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label htmlFor="contact-name" style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Smith"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid #201e1d",
                      background: "#fdfdfd",
                      fontFamily: "inherit",
                      fontSize: 14,
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid #201e1d",
                      background: "#fdfdfd",
                      fontFamily: "inherit",
                      fontSize: 14,
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="contact-topic" style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>
                    Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid #201e1d",
                      background: "#fdfdfd",
                      fontFamily: "inherit",
                      fontSize: 14,
                    }}
                  >
                    <option value="Tool Suggestion">Suggest a New Daily Tool</option>
                    <option value="Bug Report">Report a Bug / Issue</option>
                    <option value="Feedback">General Feedback</option>
                    <option value="Other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-msg" style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>
                    Message
                  </label>
                  <textarea
                    id="contact-msg"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what tool you need or what happened..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid #201e1d",
                      background: "#fdfdfd",
                      fontFamily: "inherit",
                      fontSize: 14,
                      resize: "vertical",
                    }}
                  />
                </div>

                {submitError ? (
                  <p
                    style={{
                      marginTop: 6,
                      color: "#b42318",
                      fontSize: 13,
                      lineHeight: 1.5,
                      background: "#fff5f5",
                      border: "1px solid #f7c7c7",
                      padding: "10px 12px",
                    }}
                  >
                    {submitError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{
                    marginTop: 8,
                    width: "100%",
                    justifyContent: "center",
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmitting ? "Sending..." : "Submit Message →"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Contact FAQ */}
        <div style={{ marginTop: 64, borderTop: "2px solid #201e1d", paddingTop: 40 }}>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800 }}>
            Frequently Asked Questions
          </h2>
          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            <div style={{ padding: "20px 0" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                How quickly do you reply?
              </h3>
              <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>
                We typically review and reply to all messages within 24 to 48 hours during business days.
              </p>
            </div>

            <div style={{ padding: "20px 0" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                Can I request a custom daily tool?
              </h3>
              <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>
                Yes! If you have a repetitive daily task that needs a quick browser tool, send us details and we will prioritize building it.
              </p>
            </div>

            <div style={{ padding: "20px 0" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                Do you charge for tool suggestions?
              </h3>
              <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>
                Never. Daliy.Tools is dedicated to providing free, accessible everyday utilities without paywalls.
              </p>
            </div>

            <div style={{ padding: "20px 0" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                How do you handle my privacy when I contact you?
              </h3>
              <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>
                We only use your email to answer your specific inquiry. We never sell or share contact details with advertisers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
