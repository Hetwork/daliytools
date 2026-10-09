"use client";

import { useState } from "react";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";
import BlogCard from "../_components/blog-card";
import Icon from "../_components/icon";
import { blogs } from "../_data/blogs";

export default function BlogsContent() {
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(blogs.map(blog => blog.category))];
  const posts = category === "All" ? blogs : blogs.filter(blog => blog.category === category);
  return <main><SiteHeader active="Blog" /><section className="site-container journal-hero" id="main-content" tabIndex={-1}><div><p className="eyebrow">THE DALIY JOURNAL</p><h1>A little know-how.<br /><span>A smoother day.</span></h1><p>Practical guides, thoughtful shortcuts, and better ways<br className="desktop-break" /> to get the everyday things done.</p></div><div className="journal-art" aria-hidden="true"><div><Icon name="text" size={60} /></div><span><Icon name="spark" size={35} /></span></div></section><section className="site-container journal-content"><div className="journal-filters"><div className="category-tabs" role="group" aria-label="Filter articles">{categories.map(item => <button type="button" className={`category-tab${category === item ? " selected" : ""}`} aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{item === "All" ? "All stories" : item}</button>)}</div><span role="status">{posts.length} {posts.length === 1 ? "story" : "stories"} to explore</span></div><div className="journal-grid">{posts.map((post, i) => <BlogCard key={post.slug} post={post} delay={i * .06} />)}</div></section><SiteFooter /></main>;
}
