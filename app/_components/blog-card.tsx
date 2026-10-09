import Link from "next/link";
import Image from "next/image";
import { formatBlogDate, type BlogPost } from "../_data/blogs";
import Icon from "./icon";

export default function BlogCard({ post, delay = 0 }: { post: BlogPost; delay?: number }) {
  return <article className="journal-card" style={{ animationDelay: `${delay}s` }}><Link href={`/blogs/${post.slug}`}><div className="journal-card-image">{post.image ? <Image src={post.image} alt={post.imageAlt || post.title} fill sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 580px" unoptimized={post.image.endsWith(".svg")} /> : <div className="guide-card-art" aria-hidden="true"><Icon name={post.category === "PDF workflows" ? "text" : post.category === "Image workflows" ? "grid" : "spark"} size={64} /><span>{post.category}</span></div>}</div><div className="journal-card-copy"><span className="eyebrow">{post.category}</span><h2>{post.title}</h2><p>{post.excerpt}</p><div><span>{formatBlogDate(post.updatedAt || post.publishedAt)} · {post.readTime}</span><Icon name="arrow" size={18} /></div></div></Link></article>;
}
