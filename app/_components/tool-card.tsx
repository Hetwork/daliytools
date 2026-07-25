import Link from "next/link";
import type { Tool } from "../_data/tools";
import { monogram } from "../_data/tools";

export default function ToolCard({
  tool,
  delay = 0,
  showCategory = true,
}: {
  tool: Tool;
  delay?: number;
  showCategory?: boolean;
}) {
  const mark = (
    <div
      className="tool-mark"
      style={{
        width: 40,
        height: 40,
        border: "2px solid #201e1d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        fontWeight: 800,
        marginBottom: 18,
      }}
    >
      {monogram(tool.name)}
    </div>
  );

  const body = (
    <>
      {mark}
      {showCategory && (
        <p
          style={{
            fontSize: "clamp(11px, 1.2vw, 12px)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.4,
            marginBottom: 8,
          }}
        >
          {tool.category}
        </p>
      )}
      <p
        style={{
          fontSize: "clamp(17px, 2vw, 20px)",
          fontWeight: 700,
          lineHeight: 1.3,
          marginBottom: 10,
        }}
      >
        {tool.name}
      </p>
      <p
        style={{
          fontSize: "clamp(13px, 1.5vw, 15px)",
          lineHeight: 1.55,
          opacity: 0.65,
        }}
      >
        {tool.description}
      </p>
      <div
        style={{
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span className="pulse-dot" />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: tool.live ? 0.85 : 0.5,
            color: tool.live ? "#ec3013" : "inherit",
          }}
        >
          {tool.live ? "Live — Try it →" : "Coming Soon"}
        </span>
      </div>
    </>
  );

  if (tool.live) {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className="tool-card tool-card-live reveal-fast"
        style={{ transitionDelay: `${delay}s` }}
      >
        {body}
      </Link>
    );
  }

  return (
    <div className="tool-card reveal-fast" style={{ transitionDelay: `${delay}s` }}>
      {body}
    </div>
  );
}
