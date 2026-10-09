import Link from "next/link";
import SiteHeader from "./_components/site-header";
import SiteFooter from "./_components/site-footer";
import Sculpture from "./_components/sculpture";
import ToolLibrary from "./_components/tool-library";
import Icon from "./_components/icon";
import BlogCard from "./_components/blog-card";
import { getRecentBlogs } from "./_data/blogs";
import { tools, categories } from "./_data/tools";

export default function HomeContent() {
  return <main className="home-page">
    <SiteHeader active="Home" />
    <section className="hero site-container" id="main-content" tabIndex={-1}>
      <div className="hero-copy"><div className="hero-badge"><span /> YOUR EVERYDAY DIGITAL TOOLKIT</div><h1>Big things.<br />Small tools.<br /><span>Less effort.</span><svg className="hero-underline" viewBox="0 0 320 14" aria-hidden="true"><path d="M3 10Q145-5 316 7" /></svg></h1><p>Make room for what matters. Simple, free tools for your PDFs, images, text, and everything in between.</p><div className="hero-actions"><Link href="#toolkit" className="btn btn-primary">Find your tool <Icon name="arrow" size={19} /></Link><Link href="/about" className="hero-story">A little about us <Icon name="right" size={17} /></Link></div><div className="hero-proof"><span><Icon name="check" size={15} /> Free to use</span><span><Icon name="check" size={15} /> No account needed</span><span><Icon name="check" size={15} /> Built for everyone</span></div></div>
      <Sculpture />
      <div className="hero-bottom"><span>A little less friction. A lot more done.</span><a href="#toolkit">MEET YOUR NEW TOOLKIT <span>↓</span></a></div>
    </section>
    <div className="trust-strip"><div className="site-container"><div><strong>{tools.filter(tool => tool.live).length}+</strong><span>handy tools</span></div><div><strong>{categories.length}</strong><span>ways to get things done</span></div><div><Icon name="shield" /><span>Privacy in mind</span></div><div><Icon name="bolt" /><span>Open. Use. Done.</span></div></div></div>
    <section id="toolkit" className="site-container toolkit-section scroll-reveal"><ToolLibrary /></section>
    <section className="site-container why-section scroll-reveal"><div className="section-heading"><div><p className="eyebrow">BUILT AROUND YOUR DAY</p><h2>Useful by design.<br /><span className="muted-heading">Simple by nature.</span></h2></div><p className="section-description">The little jobs shouldn’t take up your whole day.<br />We’re here to help you get back to the good stuff.</p></div><div className="benefit-grid">{[{ icon: "bolt", title: "Less waiting. More doing.", body: "Open a tool, drop in what you need, and get on with your day. A shorter path from to-do to done." }, { icon: "shield", title: "Your work stays yours.", body: "Many tools work right in your browser. Tools that need a server tell you, so you know where your data goes." }, { icon: "spark", title: "Good tools. Zero fuss.", body: "No account to create. No complicated setup. Just a useful collection, ready whenever you are." }].map((item, i) => <article key={item.title} className="benefit-card"><div className="benefit-top"><span className="benefit-icon"><Icon name={item.icon} size={24} /></span><span>0{i + 1}</span></div><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>
    <section className="site-container scroll-reveal"><div className="home-cta"><div><p className="eyebrow">ONE LESS THING ON YOUR LIST</p><h2>Your next shortcut<br />is right here.</h2><Link href="/tools" className="btn">Explore the toolkit <Icon name="arrow" size={18} /></Link></div><div className="cta-art" aria-hidden="true"><span /><span /><span /><Icon name="spark" size={86} /></div><p className="cta-footnote">Made for the things you do every day.</p></div></section>
    <section className="site-container toolkit-section"><div className="section-heading"><div><p className="eyebrow">PRACTICAL GUIDES</p><h2>Choose the right settings.<br /><span className="muted-heading">Check the result.</span></h2></div><Link href="/blogs" className="btn">All guides</Link></div><div className="journal-grid">{getRecentBlogs().map(post => <BlogCard key={post.slug} post={post} />)}</div></section>
    <SiteFooter />
  </main>;
}
