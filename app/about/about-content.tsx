import Link from "next/link";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";
import Sculpture from "../_components/sculpture";
import Icon from "../_components/icon";

export default function AboutContent() {
  return <main><SiteHeader active="About" />
    <section className="collection-hero site-container" id="main-content" tabIndex={-1}><div><p className="eyebrow">A SMALL TYPO. A SIMPLE IDEA.</p><h1>Yes, it’s Daliy.<br /><span>That’s our story.</span></h1><p>Useful things don’t have to be complicated.<br />And good things don’t have to start perfectly.</p></div><Sculpture compact /></section>
    <section className="site-container story-layout scroll-reveal"><div className="story-label"><p className="eyebrow">HOW WE GOT HERE</p><h2>A little mistake.<br />A better way forward.</h2><span className="story-index">01 — OUR BEGINNING</span></div><div className="story-copy"><p>When we went to buy the domain, we made the kind of mistake every developer, designer, and founder has made at least once. One typo. One “we’ll fix it later.”</p><p>Except the domain was already ours. So we kept it.</p><blockquote>“If our tools help people fix mistakes every day, why are we embarrassed by one of our own?”</blockquote><p>It’s a reminder that good products aren’t built by people who never make mistakes. They’re built by people who keep shipping anyway.</p></div></section>
    <section className="site-container story-layout scroll-reveal"><div className="story-label"><p className="eyebrow">WHY WE’RE HERE</p><h2>Less looking around.<br />More getting it done.</h2><span className="story-index">02 — OUR PURPOSE</span></div><div className="story-copy"><p>Compress a PDF. Resize a photo. Count a few words. Everyday tasks shouldn’t send you through a maze of complicated websites.</p><p>We wanted one simple place for all those little jobs. So we built Daliy.Tools: a growing collection of PDF, image, text, media, and developer utilities.</p><p>Just open a tool, get your job done, and move on with your day. Or your <span className="accent">daliy</span>.</p><Link className="btn btn-primary" href="/tools">Meet your toolkit <Icon name="arrow" size={17} /></Link></div></section>
    <section className="site-container scroll-reveal"><div className="home-cta"><p className="eyebrow">OUR MISSION</p><h2>Make everyday<br />a little easier.</h2><p className="mission-copy">One tool at a time. One problem at a time. One typo at a time.</p><div className="cta-art" aria-hidden="true"><span /><span /><span /><Icon name="spark" size={86} /></div></div></section><SiteFooter />
  </main>;
}
