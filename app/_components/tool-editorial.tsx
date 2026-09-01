import Link from "next/link";

export type StepItem = {
  num: string;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedTool = {
  slug: string;
  name: string;
};

export type ToolEditorialProps = {
  toolName: string;
  guideTitle?: string;
  steps: StepItem[];
  howItWorks: {
    title: string;
    description: string[];
  };
  faqs: FaqItem[];
  relatedTools: RelatedTool[];
};

export default function ToolEditorial({
  toolName,
  guideTitle,
  steps,
  howItWorks,
  faqs,
  relatedTools,
}: ToolEditorialProps) {
  return (
    <div
      className="reveal"
      style={{
        marginTop: "clamp(56px, 8vw, 88px)",
        borderTop: "2px solid #201e1d",
        paddingTop: 40,
      }}
    >
      {/* ── STEP-BY-STEP GUIDE ── */}
      {steps && steps.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#ec3013",
            }}
          >
            Step-by-Step Guide
          </span>
          <h2
            style={{
              fontSize: "clamp(22px, 3.2vw, 32px)",
              fontWeight: 800,
              marginTop: 8,
              marginBottom: 20,
            }}
          >
            {guideTitle || `How to Use the ${toolName}`}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {steps.map((step) => (
              <div
                key={step.num}
                style={{
                  padding: "16px 20px",
                  background: "#fff",
                  border: "1.5px solid #201e1d",
                }}
              >
                <p style={{ fontWeight: 800, fontSize: 18, color: "#ec3013" }}>
                  {step.num}
                </p>
                <p style={{ fontWeight: 700, fontSize: 15, margin: "6px 0" }}>
                  {step.title}
                </p>
                <p style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.5 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── UNDER THE HOOD / HOW IT WORKS ── */}
      {howItWorks && (
        <div
          style={{
            marginBottom: 48,
            background: "#fff",
            border: "2px solid #201e1d",
            padding: "clamp(24px, 4vw, 36px)",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#ec3013",
            }}
          >
            Under the Hood
          </span>
          <h2
            style={{
              fontSize: "clamp(20px, 2.6vw, 28px)",
              fontWeight: 800,
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            {howItWorks.title}
          </h2>
          {howItWorks.description.map((paragraph, index) => (
            <p
              key={index}
              style={{
                fontSize: "clamp(14px, 1.5vw, 16px)",
                lineHeight: 1.75,
                opacity: 0.8,
                marginBottom:
                  index === howItWorks.description.length - 1 ? 0 : 14,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* ── FAQS ── */}
      {faqs && faqs.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#ec3013",
            }}
          >
            Answers to Common Questions
          </span>
          <h2
            style={{
              fontSize: "clamp(22px, 3.2vw, 32px)",
              fontWeight: 800,
              marginTop: 8,
              marginBottom: 24,
            }}
          >
            Frequently Asked Questions
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  padding: "20px 24px",
                  background: "#fff",
                  border: "1.5px solid #201e1d",
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                  {faq.question}
                </h3>
                <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RELATED TOOLS ── */}
      {relatedTools && relatedTools.length > 0 && (
        <div style={{ borderTop: "1.5px dashed #201e1d", paddingTop: 32 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              opacity: 0.5,
              marginBottom: 16,
            }}
          >
            Related Daily Utilities
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {relatedTools.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="btn"
                style={{ fontSize: 13 }}
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
