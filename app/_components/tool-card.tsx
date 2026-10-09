import Link from "next/link";
import type { Tool } from "../_data/tools";
import Icon, { categoryIcons } from "./icon";

export default function ToolCard({ tool, delay = 0, showCategory = true }: { tool: Tool; delay?: number; showCategory?: boolean }) {
  const icon = categoryIcons[tool.category] || "spark";
  const body = <><div className="tool-card-top"><span className={`tool-icon tone-${icon}`}><Icon name={icon} size={23} /></span><span className="tool-card-arrow"><Icon name="arrow" size={18} /></span></div>{showCategory && <span className="tool-category">{tool.category}</span>}<h3>{tool.name}</h3><p>{tool.description}</p><div className="tool-card-bottom"><span className={tool.live ? "tool-available" : ""}>{tool.live ? "Free to use" : "Coming soon"}</span>{tool.live && <span>Open tool <Icon name="right" size={13} /></span>}</div></>;
  return tool.live ? <Link href={`/tools/${tool.slug}`} className="tool-card tool-card-live" style={{ animationDelay: `${delay}s` }}>{body}</Link> : <div className="tool-card" style={{ animationDelay: `${delay}s` }}>{body}</div>;
}
