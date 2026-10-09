import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";

export const metadata: Metadata = {
  title: "Editorial Policy & Corrections",
  description: "How to interpret Daliy.Tools guides, worked examples, processing disclosures, and corrections to tool documentation.",
  alternates: { canonical: "https://daliy.tools/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return <main>
    <SiteHeader />
    <article className="site-container editorial-policy" id="main-content" tabIndex={-1}>
      <p className="eyebrow">ABOUT OUR DOCUMENTATION</p>
      <h1>Useful instructions.<br />Clear limitations.</h1>
      <p>Daliy.Tools publishes the tools and guides on this site under the Daliy.Tools name. Our guides explain specific tasks, the settings available in our tools, and how to inspect the output. They are product documentation, not independent reviews of our own service.</p>
      <h2>Examples and evidence</h2>
      <p>Worked examples illustrate a process. Hypothetical file sizes and upload limits are labeled as examples; they are not benchmarks or results from a customer. Compression savings and processing time depend on the input, settings, device, and browser. No guide can guarantee a particular saving or that an external service will accept a file.</p>
      <h2>Know what a tool changes</h2>
      <p>Instructions should describe the output format and any loss of features. Our PDF compressor creates image-only pages. Our image compressor exports JPEG. Our JSON formatter parses and serializes data, which can change large integers and duplicate keys. Keep an original and inspect the download before relying on it.</p>
      <h2>Processing and privacy</h2>
      <p>Many tools process selected files in your browser. Social-media download tools use server requests, and the contact form sends a message to our support endpoint. A local-processing statement about one tool does not apply to every feature of the site. Read the <Link href="/privacy-policy">privacy policy</Link> and the selected tool&apos;s instructions.</p>
      <h2>Dates and corrections</h2>
      <p>Article dates identify publication and substantive updates. A rebuild of the website does not mean an article was reviewed again. Browser behavior and tool implementations can change; if an instruction no longer matches what you see, please report it.</p>
      <p>Use <Link href="/contact">the contact form</Link> or email <a href="mailto:daliytools0312@gmail.com">daliytools0312@gmail.com</a>. Include the page URL, browser, input format, reproduction steps, and expected result. A small invented example is usually enough; do not send passwords, tokens, or confidential files.</p>
      <h2>Advertising</h2>
      <p>The site is intended to be supported by advertising. Advertising does not establish the accuracy of a guide or certify a tool&apos;s output. Tool use does not require clicking an advertisement.</p>
      <p><Link href="/blogs">Read the practical guides</Link> or <Link href="/about">learn about Daliy.Tools</Link>.</p>
    </article>
    <SiteFooter />
  </main>;
}
