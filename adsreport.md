# AdSense Readiness Report

**Site:** Daliy.Tools  
**Review date:** September 11, 2026  
**Scope:** AdSense policy readiness, content quality, trust pages, SEO metadata, structured data, and sitemap health.

## Executive Summary

Daliy.Tools has a useful foundation. The tool pages are not widget-only pages: most include an introduction, a working utility, step-by-step instructions, a technical explanation, FAQs, privacy messaging, and related tools.

The most important issues are inconsistent privacy claims, unfinished-site language, sitemap conflicts, and incomplete metadata/schema coverage. These should be addressed before requesting another Google AdSense review.

## High-Priority Findings

### 1. Privacy policy does not match contact-form data collection

The contact form collects and submits the following information:

- Name and email address
- IP address
- City, region, country, and postal code
- Timezone and organization
- Latitude and longitude
- Browser user agent
- Browser language
- Submission time

Location data is requested from `ipapi.co`, then forwarded to the contact API and Google Sheets.

However, the Privacy Policy says that the site does not knowingly collect personally identifiable information.

**Evidence:**

- `app/contact/contact-content.tsx`
- `app/api/contact/route.ts`
- `app/privacy-policy/page.tsx`

**Recommended fix:**

Either remove the IP/location enrichment from the contact form, or update the Privacy Policy to clearly explain the data collected, its purpose, third-party processors, storage location, retention period, and deletion rights. Removing unnecessary location data is the simpler option for a contact form.

### 2. Terms of Use contradict browser-only processing claims

The Terms of Use state that uploaded content is processed on the site's servers. Several tool pages state that files never leave the user's browser.

These statements cannot both be generally true.

**Evidence:**

- `app/terms-of-use/page.tsx`
- `app/tools/compress-image/compress-image-content.tsx`

**Recommended fix:**

Audit each tool and document its actual behavior. State whether each tool:

- Processes files entirely in the browser
- Sends data to an API
- Uses a third-party service
- Stores data temporarily or permanently

Avoid making a universal browser-only claim if some tools use server APIs.

### 3. Homepage contains unfinished-site wording

The homepage metadata says:

> One simple website. Hundreds of genuinely useful tools on the way.

The About page also includes similar wording. This can make the website appear incomplete or under construction, which is undesirable for AdSense review.

**Evidence:**

- `app/page.tsx`
- `app/about/about-content.tsx`

**Recommended fix:**

Replace the wording with an accurate description of the current site, such as:

> Free everyday tools for PDFs, images, text, media, and developer tasks.

Avoid phrases such as `coming soon`, `on the way`, `pipeline`, and `under construction` on public pages.

### 4. Sitemap sources conflict

The project contains both a generated Next.js sitemap and a static `public/sitemap.xml`.

The static sitemap:

- Uses `https://www.daliy.tools` instead of `https://daliy.tools`
- Contains stale modification dates
- Includes `/ads.txt`, which should not be indexed as a page URL
- Omits some current routes
- Omits the Contact page

The generated sitemap uses the non-`www` canonical host, but the deployed behavior should be verified.

**Evidence:**

- `public/sitemap.xml`
- `app/sitemap.ts`
- `app/robots.ts`

**Recommended fix:**

Keep one sitemap source, use one canonical host consistently, remove `/ads.txt`, include all intended live routes, and verify the deployed `/sitemap.xml` in Google Search Console.

The generated sitemap should also include only tools whose `live` property is `true`.

## Medium-Priority Findings

### 5. Structured data is incomplete

Only a subset of tool pages includes `WebApplication` and `FAQPage` JSON-LD. Many live tools have no structured data.

**Evidence:**

Schema exists on pages such as:

- `app/tools/compress-image/page.tsx`
- `app/tools/compress-pdf/page.tsx`
- `app/tools/json-formatter/page.tsx`

Schema is missing from routes such as the password generator.

**Recommended fix:**

Use a consistent schema pattern for every live tool:

- `WebApplication`
- `FAQPage`, when visible FAQs exist
- `BreadcrumbList`

### 6. FAQ schema does not always match visible FAQs

The Compress Image page visibly renders four FAQ entries, but its JSON-LD contains only two questions. This creates a mismatch between the visible page and structured data.

**Evidence:**

- `app/tools/compress-image/page.tsx`
- `app/_data/tool-editorial-data.ts`

**Recommended fix:**

Generate FAQ JSON-LD from the same FAQ data used to render the visible FAQ section. This keeps the markup complete and current.

### 7. Metadata is inconsistent across tools

Most tool pages define a title and description, but canonical URLs, Open Graph metadata, Twitter metadata, and keywords are not consistently present.

The root layout automatically appends `| Daliy.Tools` to titles. Some individual route titles already include the brand, which can cause duplicated or overly long titles.

**Evidence:**

- `app/layout.tsx`
- `app/tools/*/page.tsx`

**Recommended fix:**

Standardize each live tool page with:

- A unique title around 50-60 characters where practical
- A description around 130-160 characters
- A canonical URL
- Open Graph title, description, URL, and site name
- Twitter card metadata
- No duplicated brand suffix
- Accurate privacy and format claims

### 8. Trust pages lack semantic heading structure

The Privacy Policy and Terms pages use styled paragraphs for section headings rather than semantic `h1` and `h2` elements.

**Evidence:**

- `app/privacy-policy/page.tsx`
- `app/terms-of-use/page.tsx`

**Recommended fix:**

Use one `h1` for each page title, `h2` elements for major sections, and paragraphs for body text. This improves accessibility and document structure.

## Content Recommendations

### 9. Add independent how-to guides

The tool pages have useful editorial sections, but the site does not currently have a separate blog or guide section.

Consider adding original guides such as:

- How to reduce PDF size without losing readability
- JPG vs PNG vs WebP: which format should you use?
- How to convert images to PDF
- How to prepare images for email uploads
- How to inspect JWT tokens safely
- How to choose accessible text and background colors

Each article should answer a real user question, contain original practical information, and be approximately 400-800 words. Avoid creating thin keyword pages.

### 10. Review every live tool for accuracy

The tool registry currently contains 37 tools, all marked as live.

**Evidence:**

- `app/_data/tools.ts`

For every tool, verify:

- The tool works without errors
- The description matches its actual behavior
- Privacy claims are accurate
- The output is useful and understandable
- The page contains meaningful FAQs
- Any third-party API usage is disclosed
- Download or social-media features comply with applicable rights and platform rules

## Existing Strengths

- Tool pages generally contain substantial editorial content.
- A Contact page exists and is linked through the site footer.
- About, Privacy Policy, Terms of Use, and Contact pages exist.
- `robots.ts` allows public pages and blocks `/api/`.
- `public/ads.txt` exists.
- Current registry tools are marked live.
- No active `Coming Soon` tool appears to be listed.
- The shared editorial component provides instructions, technical explanations, FAQs, and related-tool links.

## Recommended Order of Work

1. Correct the Privacy Policy and Terms of Use.
2. Remove unfinished-site wording from the homepage and About page.
3. Consolidate and correct the sitemap.
4. Verify each tool's actual privacy and processing behavior.
5. Standardize metadata for all live tools.
6. Add complete, matching structured data.
7. Improve heading semantics on trust pages.
8. Add several high-quality supporting guides.
9. Crawl the production site and test every listed URL before applying for AdSense review.

## Final Assessment

The site is not empty or purely functional, but it is not yet fully consistent from an AdSense trust and quality perspective. The privacy/legal contradictions and sitemap issues should be treated as blockers. Metadata, structured data, semantic headings, and supporting guides are important follow-up improvements.

These changes improve AdSense readiness, but approval cannot be guaranteed because Google's review also considers the complete deployed site, traffic quality, policy compliance, content originality, and user experience.
