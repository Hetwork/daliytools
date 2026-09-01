---
name: adsense
description: >
  A complete, actionable guide for making daliy.tools compliant with Google AdSense
  Publisher Policies and optimized for organic search engines (SEO). Use this skill
  whenever the task involves fixing AdSense violations, writing tool page content,
  creating site pages (Contact, About, Blog), adding FAQ sections, optimizing metadata
  (titles, descriptions, tags, OpenGraph, schema), or ranking for daily utility keywords.
---

# AdSense Compliance & SEO Strategy Skill — daliy.tools

## What This Skill Is For

daliy.tools received a **"Low Value Content"** violation from Google AdSense. This skill tells you **exactly what needs to be fixed**, how to structure content that passes Google review, and how to optimize every page for SEO so that users find and trust the site.

Use this skill any time you are:
- Writing or expanding content on any tool page
- Crafting page titles, meta descriptions, OpenGraph tags, or structured data (JSON-LD)
- Optimizing pages to rank for search queries around "daily tools" and specific utilities
- Creating site pages (Contact, Blog, FAQ, About)
- Fixing "under construction" language and thin content
- Writing articles, guides, or tool FAQs in a human, easy-to-read style

---

## Understanding the AdSense Violation

Google's "Low Value Content" policy means the site **does not yet provide enough unique, useful, readable text content** for Google to monetize with ads. It does **not** mean the tools are broken or poorly designed.

Google evaluates three main pillars:
1. **Editorial Substance:** Is there original, helpful text on every page that explains what the tool does, how it works, and how to use it?
2. **Site Completeness:** Is every listed page functional? Are there broken links, empty pages, or "coming soon" badges?
3. **Trust & Transparency (E-E-A-T):** Does the site have clear About, Contact, Privacy Policy, and Terms pages?

---

## Section 1 — The Five Core AdSense Problems to Fix

### Problem 1: Tool Pages Have Almost No Readable Text (Thin Content)
A page with only an interactive widget (drop zone, buttons, converter) is treated by Google crawlers as thin content.

**What to include on every tool page:**
- **Intro summary (2–4 sentences):** What problem does this tool solve? Who is it for?
- **Step-by-step instructions:** 3–5 clearly numbered steps explaining how to use it.
- **How it works (under the hood):** 1–2 paragraphs explaining the process in plain language (e.g., client-side browser processing).
- **FAQ section:** At least 4 realistic questions with detailed answers.
- **Privacy & safety note:** Reassurance that files are processed locally and never stored.

---

### Problem 2: "Under Construction" / "Pipeline" Signals
Google explicitly forbids serving ads on sites or pages that appear under construction.

**Fix:**
- Remove phrases like *"15+ Tools in the pipeline"* or *"Coming Soon"*.
- Replace with live, accurate numbers: *"30+ Free everyday tools available"*.
- Unpublish or hide navigation links to any tools that are not 100% complete and working.

---

### Problem 3: Missing Contact Page
Google AdSense requires an easy way for visitors to contact the site operator.

**Fix:**
- Create `/contact` with a simple contact form or a verified email address (e.g., `support@daliy.tools` or `hello@daliy.tools`).
- Add a direct link to the Contact page in the global footer.

---

### Problem 4: Missing FAQ Sections
Search crawlers and human reviewers both look for helpful FAQ content to verify depth and utility.

**Fix:** Add 4–6 high-value questions to each tool page answering real concerns (e.g., file size limits, supported formats, privacy, quality retention).

---

### Problem 5: No Supporting Blog or How-To Guides
A site with purely functional tools benefits enormously from 5–10 high-quality supporting articles (400–800 words each) covering common tasks, format comparisons, and tutorials.

---

## Section 2 — Complete SEO & Meta Tag Guidelines

To drive organic traffic, build domain authority, and prove value to Google, every page must have comprehensive On-Page SEO and technical metadata.

### 1. Title Tag Strategy (`<title>`)
Keep title tags between **50 and 60 characters**. Put the primary keyword first, followed by key user benefits and the brand name.

#### Title Tag Formula:
```
[Primary Tool Name] — [Key Benefit / Free & Private] | Daliy.Tools
```

#### Examples:
- **Compress PDF:** `Compress PDF Online — Free, Fast & Private | Daliy.Tools`
- **Resize Image:** `Resize Image Online — Free Image Resizer | Daliy.Tools`
- **QR Code Generator:** `Free QR Code Generator — Create Custom QR Codes | Daliy.Tools`
- **JSON Formatter:** `JSON Formatter & Validator — Clean & Format JSON | Daliy.Tools`
- **Homepage:** `Daliy.Tools — Free Everyday Online Tools & Utilities`

---

### 2. Meta Description Strategy
Keep descriptions between **130 and 160 characters**. Write an active, compelling pitch that includes primary and secondary keywords.

#### Description Formula:
```
[Action verb] [primary keyword] [key benefit/format]. Fast, free, and 100% private in your browser with no file uploads or sign-ups required.
```

#### Example:
> *"Compress PDF files online for free without losing clarity. Fast, secure, and runs directly in your browser with no watermarks or file uploads required."*

---

### 3. Next.js Metadata Implementation Template

Use Next.js Metadata API in `app/tools/[tool-slug]/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF Online — Free, Fast & Private | Daliy.Tools",
  description:
    "Compress PDF files online for free without losing quality. Fast, secure, and runs directly in your browser with no file uploads or sign-up required.",
  keywords: [
    "compress pdf",
    "reduce pdf size online",
    "free pdf compressor",
    "shrink pdf file",
    "daily tools",
    "private pdf compression"
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/compress-pdf",
  },
  openGraph: {
    title: "Compress PDF Online — Free & Private | Daliy.Tools",
    description: "Shrink your PDF file size safely in your browser. No file uploads, no watermarks, completely free.",
    url: "https://daliy.tools/tools/compress-pdf",
    siteName: "Daliy.Tools",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Online — Free & Private | Daliy.Tools",
    description: "Shrink your PDF file size safely in your browser. Free, fast, and no server uploads.",
  },
};
```

---

### 4. Ranking for "Daily Tools" & Search Queries

Users search for "daily tools", "free daily utilities", "everyday productivity tools", and specific tasks ("convert image to pdf").

#### How to optimize for "Daily Tools" search intent:
1. **Target Natural Keyword Variations:**
   - Primary variations: `daily tools`, `everyday tools`, `free online utilities`, `quick daily web tools`.
   - Brand awareness: Naturally weave both "Daliy.Tools" (the brand) and "daily tools" (the search intent) into headings and body text.
   - Example copy: *"Daliy.Tools is your go-to hub for free daily tools and utilities you need every day."*

2. **Heading Hierarchy (H1, H2, H3):**
   - **H1:** Exactly one per page. Must contain the primary tool name (e.g., `<h1>Compress PDF Online for Free</h1>`).
   - **H2s:** Clear section anchors:
     - `<h2>How to Compress Your PDF in 4 Simple Steps</h2>`
     - `<h2>Why Choose Our Daily PDF Compressor?</h2>`
     - `<h2>How Client-Side Compression Protects Your Privacy</h2>`
     - `<h2>Frequently Asked Questions</h2>`
   - **H3s:** Sub-questions in FAQs and step titles.

3. **Internal Linking & Topic Clusters:**
   - Link related tools to each other (e.g., from *Compress PDF* link to *Merge PDF*, *Split PDF*, and *Image to PDF*).
   - In tool sidebars or bottom sections, include a "Related Daily Tools" grid.
   - Add breadcrumbs on all tool pages: `Home > Tools > PDF Tools > Compress PDF`.

---

### 5. Structured Data (JSON-LD Schema Markup)

Adding Schema Markup helps Google generate rich snippets in search results:

#### A. WebApplication / SoftwareApplication Schema
Place this in tool pages to tell Google it's a functional utility:
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Compress PDF - Daliy.Tools",
  "url": "https://daliy.tools/tools/compress-pdf",
  "description": "Free online tool to compress and reduce PDF file size in the browser.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

#### B. FAQPage Schema
Include this whenever a tool page features a FAQ section to earn FAQ rich dropdowns in search results:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Will compressing my PDF reduce text quality?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Our balanced preset compresses heavy images while keeping text and vector shapes sharp and readable."
      }
    },
    {
      "@type": "Question",
      "name": "Are my files uploaded to any server?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. All processing happens entirely inside your web browser. Your documents never leave your device."
      }
    }
  ]
}
```

---

## Section 3 — Writing Rules and Tone Guide

Every piece of content must feel human, helpful, and natural:

1. **Write for humans, not search bots:** Avoid keyword stuffing. Mention keywords naturally.
2. **Short, direct sentences:** Keep sentences crisp (under 20 words where possible).
3. **Use active verbs and second-person:** Speak directly to the reader ("Upload your file", "Select your preset", "Download your result").
4. **Be transparent:** Always explain privacy benefits (client-side execution, no data collection).
5. **Clean grammar:** No spelling mistakes, correct punctuation, and natural phrasing.

---

## Section 4 — Complete Page-by-Page Checklist

Before requesting Google AdSense review or launching SEO campaigns:

- [ ] **SEO Title:** Unique, keyword-targeted, under 60 characters.
- [ ] **Meta Description:** Engaging, active, includes target keyword, 130–160 characters.
- [ ] **Canonical URL:** Configured for every page.
- [ ] **OpenGraph / Twitter:** Title, description, and site name tags included.
- [ ] **H1 Heading:** Single descriptive H1 per page matching user intent.
- [ ] **Introduction:** 2–4 informative sentences introducing the tool.
- [ ] **Step-by-Step Guide:** Clear numbered instructions.
- [ ] **Technical / Educational Note:** 1–2 paragraphs explaining how the feature works.
- [ ] **FAQ Section:** 4+ practical questions with comprehensive answers.
- [ ] **Schema Markup:** WebApplication and FAQPage JSON-LD added.
- [ ] **Internal Links:** "Related Daily Tools" links included at the bottom.
- [ ] **No Placeholder Text:** Zero "Coming Soon", "Under Construction", or dead links.
- [ ] **Sitemap & Indexing:** All live tool URLs present in `sitemap.xml` and submitted to Google Search Console.
- [ ] **Trust Pages:** Complete `/about`, `/contact`, `/privacy-policy`, and `/terms-of-use`.
- [ ] **ads.txt:** Verified in `/public/ads.txt`.
