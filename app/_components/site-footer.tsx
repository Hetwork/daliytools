import Link from "next/link";
import Icon from "./icon";

export default function SiteFooter() {
  return <footer className="site-footer"><div className="footer-inner">
    <div className="footer-top"><div><Link href="/" className="brand"><span className="brand-mark"><Icon name="grid" size={19} /></span>daliy<span className="brand-dot">.</span>tools</Link><p>Little tools. A little more time for you.</p></div><div className="footer-links"><Link href="/tools">All tools</Link><Link href="/blogs">Journal</Link><Link href="/about">Our story</Link><Link href="/contact">Say hello <Icon name="arrow" size={14} /></Link></div></div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} Daliy.Tools. Made for your everyday.</p><div><Link href="/editorial-policy">Editorial policy</Link><Link href="/privacy-policy">Privacy policy</Link><Link href="/terms-of-use">Terms of use</Link><span className="footer-note"><span /> A little simpler, every day.</span></div></div>
  </div></footer>;
}
