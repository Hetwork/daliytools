"use client";

import { useState } from "react";
import { categories, tools, featuredSlugs } from "../_data/tools";
import ToolCard from "./tool-card";
import Icon, { categoryIcons } from "./icon";

export default function ToolLibrary({ full = false }: { full?: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All tools");
  const [expanded, setExpanded] = useState(full);
  const filtered = tools.filter(tool => (category === "All tools" || tool.category === category) && `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(query.toLowerCase().trim()));
  const results = !expanded && !query.trim() && category === "All tools" ? featuredSlugs.flatMap(slug => tools.find(tool => tool.slug === slug) || []) : filtered;
  return <div className="tool-library">
    <div className="library-toolbar"><label className="tool-search"><Icon name="search" size={21} /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="What do you need to do today?" aria-label="Search tools" />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><Icon name="close" size={16} /></button>}<span className="search-hint">Find your tool</span></label><span className="library-count">{tools.filter(tool => tool.live).length} tools. Endless possibilities.</span></div>
    <div className="category-tabs" role="group" aria-label="Filter by category">{["All tools", ...categories].map(item => <button type="button" key={item} aria-pressed={category === item} className={category === item ? "category-tab selected" : "category-tab"} onClick={() => setCategory(item)}><Icon name={categoryIcons[item] || "grid"} size={15} />{item === "Calculators & Converters" ? "Calculators" : item.replace(" Tools", "")}</button>)}</div>
    <div className="section-heading library-heading"><div><p className="eyebrow">{query || category !== "All tools" ? "YOUR TOOLKIT, FILTERED" : full || expanded ? "THE COMPLETE COLLECTION" : "SMALL TOOLS. BIG DIFFERENCE."}</p><h2>{query ? "Search results" : category !== "All tools" ? category : full || expanded ? "A tool for every task." : "Everyday favorites."}</h2></div><span className="results-count" role="status" aria-live="polite">{results.length} tools{category !== "All tools" ? " in this category" : " to make life easier"}</span></div>
    {results.length ? <div className="tools-grid">{results.map((tool, index) => <ToolCard key={tool.slug} tool={tool} delay={Math.min(index, 5) * .04} />)}</div> : <div className="empty-search"><Icon name="search" size={32} /><h3>No tools found</h3><p>Try a different keyword or explore another category.</p><button className="btn" onClick={() => { setQuery(""); setCategory("All tools"); }}>Clear filters <Icon name="right" size={16} /></button></div>}
    {!full && !expanded && !query && category === "All tools" && <div className="library-more"><button className="btn btn-secondary" onClick={() => setExpanded(true)}>Discover all {tools.length} tools <Icon name="right" size={17} /></button><p>No sign-up. Just pick a tool and go.</p></div>}
  </div>;
}
