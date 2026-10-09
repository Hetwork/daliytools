import Link from "next/link";

const guides = [
  { slug: "compress-pdf-without-losing-what-matters", title: "Compress a PDF without losing what matters", description: "Compare presets and check text, links, and legibility before submitting a file.", tools: ["compress-pdf", "split-pdf", "merge-pdf", "image-to-pdf", "unlock-pdf"] },
  { slug: "resize-or-compress-image-for-upload", title: "Resize or compress? Prepare an image for an upload limit", description: "A worked pixel-size example, format choices, and checks for transparency.", tools: ["resize-image", "compress-image", "convert-image-format", "crop-image", "remove-background"] },
  { slug: "json-formatting-validation-and-data-loss", title: "Format JSON safely: syntax errors and data that can change", description: "Fix invalid syntax and understand large numbers, duplicate keys, and signatures.", tools: ["json-formatter", "compare-files", "jwt-decoder", "base64-converter"] },
];

export default function ToolGuideLinks({ slug }: { slug: string }) {
  const related = guides.filter(guide => guide.tools.includes(slug));
  if (!related.length) return null;
  return <aside className="tool-guide-links" aria-label="Practical guides">
    <h2>Before you export</h2>
    {related.map(guide => <div key={guide.slug}><Link href={`/blogs/${guide.slug}`}>{guide.title}</Link><p>{guide.description}</p></div>)}
    <p><Link href="/contact">Report an incorrect result or instruction</Link></p>
  </aside>;
}
