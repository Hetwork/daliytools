# 💡 Daliy.Tools — Tool Ideas & Roadmap

This document catalogs high-impact, privacy-first, everyday utility tool ideas designed to fit the core ethos of **Daliy.Tools**
> *Everyday tools. Actually simple. 100% client-side, zero bloated ad-tech, no paywalls, no popups.*

---

## 🧭 Priority Tiers

| Tier | Focus | Highlights |
| :--- | :--- | :--- |
| **P0 (Immediate Value)** | High-frequency daily search terms with pure in-browser execution | Favicon Generator, Screenshot Beautifier, List Cleaner, PDF to Image |
| **P1 (Core Expansion)** | Essential document, image & developer utilities | EXIF Stripper, PDF Organizer/Rotator, JWT Decoder, Cron Builder |
| **P2 (Advanced Utilities)** | Rich interactive client-side tools | Audio Trimmer, Video to GIF, WCAG Contrast Checker, Timezone Planner |

---

## 🎨 1. Image & Designer Utilities

### 1.1 Icon Kitchen (App Icon & Favicon Generator) `[LIVE]`
* **Slug**: `/tools/icon-kitchen`
* **Status**: ✅ **Implemented & Live**
* **What it does**: Full-featured in-browser icon studio supporting custom images, clipart vector libraries, and monograms. Exports Android Adaptive/Round mipmap sets, iOS `AppIcon.appiconset` with `Contents.json`, and Web Favicon `.ico`, Apple touch icon, and `site.webmanifest` in a 1-click `.zip` bundle.
* **Tech**: Canvas API + `jszip` + binary `.ico` encoder.

### 1.2 Screenshot Beautifier & Mockup Wrapper `[P0]`
* **Slug**: `/tools/screenshot-beautifier`
* **What it does**: Paste or upload any screenshot &rarr; automatically wraps it in a macOS/browser window frame with customizable gradient backgrounds, dropshadow, border radius, padding, and watermarks for Twitter, LinkedIn, and blog sharing.
* **Tech**: Canvas / SVG rendering or HTML-to-Canvas export.

### 1.3 EXIF Metadata Stripper & Inspector `[P1]`
* **Slug**: `/tools/exif-remover`
* **What it does**: Inspect all embedded camera metadata (GPS coordinates, device model, exposure, timestamp) and strip them with one click for private sharing.
* **Tech**: `exif-js` or direct client-side binary buffer manipulation.

### 1.4 SVG to High-Res PNG / ICO Converter `[P1]`
* **Slug**: `/tools/svg-to-png`
* **What it does**: Drop an SVG and export crisp raster images at 1x, 2x, 4x, 8x or custom pixel dimensions with transparent or solid background toggles.
* **Tech**: DOMParser, Image element, and Canvas export.

### 1.5 CSS Box-Shadow & Glassmorphism Generator `[P1]`
* **Slug**: `/tools/box-shadow-generator`
* **What it does**: Visual interactive controls for layered soft shadows, inset shadows, and frosted-glass `backdrop-filter` effects with instant CSS copy.

---

## 📄 2. PDF & Document Tools

### 2.1 PDF to Image (JPG / PNG / WebP) `[P0]`
* **Slug**: `/tools/pdf-to-image`
* **What it does**: Convert all or selected pages of a PDF into high-res images, with options to download single images or a `.zip` of all pages.
* **Tech**: `pdfjs-dist` + HTML Canvas.

### 2.2 PDF Page Numberer & Stamper `[P1]`
* **Slug**: `/tools/number-pdf`
* **What it does**: Add clean page numbers ("Page 1 of 10", "1/10", or custom formats), headers, footers, or customizable text stamps (e.g., "DRAFT", "CONFIDENTIAL") with font, position, and opacity controls.
* **Tech**: `pdf-lib`.

### 2.3 PDF Page Organizer & Rotator `[P1]`
* **Slug**: `/tools/organize-pdf`
* **What it does**: Visual drag-and-drop thumbnail grid of all pages to rearrange order, rotate individual/all pages (90°/180°), or delete unwanted pages before exporting.
* **Tech**: `pdfjs-dist` (thumbnails) + `pdf-lib` (rebuilding document).

### 2.4 Protect & Unlock PDF `[P2]`
* **Slug**: `/tools/protect-pdf`
* **What it does**: Encrypt a PDF with a user/owner password or remove password restrictions if the password is known.
* **Tech**: `pdf-lib`.

---

## ✍️ 3. Text & Content Utilities

### 3.1 List Cleaner & Deduplicator `[P0]`
* **Slug**: `/tools/list-cleaner`
* **What it does**: Paste any raw list to instantly:
  * Remove duplicate lines
  * Sort alphabetically (A–Z / Z–A), numerically, or by length
  * Trim whitespace and strip empty lines
  * Convert between newlines, commas, quotes, and bullet points
  * Shuffle items randomly
* **Tech**: Pure client-side JavaScript regex & array manipulation.

### 3.2 URL Slug & Text Cleaner `[P1]`
* **Slug**: `/tools/slug-generator`
* **What it does**: Turn headlines or titles into SEO-clean kebab-case, snake_case, camelCase, or PascalCase strings, stripping accents, diacritics, and special characters.

### 3.3 Text & Code Diff Checker `[P1]`
* **Slug**: `/tools/text-diff`
* **What it does**: Side-by-side and inline visual difference checker highlighting additions, deletions, and inline character modifications.
* **Tech**: `diff` library (jsdiff) + syntax highlighter.

### 3.4 UTM Campaign URL Builder `[P1]`
* **Slug**: `/tools/utm-builder`
* **What it does**: Generate clean marketing campaign URLs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) with preset saving and copy button.

---

## ⚡ 4. Developer & Privacy Tools

### 4.1 JWT Token Decoder & Inspector `[P1]`
* **Slug**: `/tools/jwt-decoder`
* **What it does**: Paste a JSON Web Token to inspect the Header and Payload with formatted JSON and human-readable expiration dates (Issued At, Expires At). 100% private, never touches a server.
* **Tech**: Standard Base64URL decoding in JS.

### 4.2 Cron Expression Builder & Explainer `[P1]`
* **Slug**: `/tools/cron-generator`
* **What it does**: Visual interactive dropdowns for Minute, Hour, Day of Month, Month, and Day of Week that generate 5-field/6-field cron expressions, with live natural-language translation and upcoming execution schedules.
* **Tech**: `cronstrue` + standard cron parser.

### 4.3 Base64 / URL / HTML Entity Encoder & Decoder `[P1]`
* **Slug**: `/tools/base64-converter`
* **What it does**: Multi-tab instant converter for Base64 (strings or files), URL percent-encoding, and HTML entities (`&amp;`, `&lt;`, etc.).

### 4.4 UUID & Cryptographic Hash Generator `[P1]`
* **Slug**: `/tools/uuid-generator`
* **What it does**: Generate batches of UUID v4/v5, nano IDs, and calculate SHA-256, SHA-512, MD5 hashes of text or files using `crypto.subtle`.

### 4.5 WCAG Color Contrast Checker `[P2]`
* **Slug**: `/tools/contrast-checker`
* **What it does**: Test foreground vs. background colors against WCAG 2.1 AA and AAA standards for normal and large text, with live UI mockup previews.

---

## 🧮 5. Everyday Calculators & Converters

### 5.1 Aspect Ratio & Resolution Calculator `[P1]`
* **Slug**: `/tools/aspect-ratio-calculator`
* **What it does**: Calculate dimensions for 16:9, 4:3, 1:1, 9:16, 21:9, scaling dimensions while preserving ratio, and calculating print dimensions at 300 DPI.

### 5.2 Time Zone Meeting Finder `[P1]`
* **Slug**: `/tools/timezone-planner`
* **What it does**: Interactive multi-city timeline slider that highlights overlapping business/working hours across worldwide time zones.

### 5.3 Freelance Rate & Billable Hours Calculator `[P2]`
* **Slug**: `/tools/freelance-rate-calculator`
* **What it does**: Calculate minimum hourly/daily rates factoring in desired annual income, tax rate, business expenses, non-billable administrative hours, and vacation time.

### 5.4 Tip & Split Bill Calculator `[P2]`
* **Slug**: `/tools/tip-calculator`
* **What it does**: Quick bill calculation with customizable tip percentages, tax separation, and split evenly or by unequal amounts.

---

## 🎬 6. Audio & Quick Media

### 6.1 In-Browser Audio Cutter / Trimmer `[P2]`
* **Slug**: `/tools/audio-trimmer`
* **What it does**: Upload MP3/WAV/OGG/AAC, select start and end points on an interactive waveform, and download the trimmed audio segment without server processing.
* **Tech**: Web Audio API + `wavesurfer.js`.

### 6.2 Video to GIF Converter `[P2]`
* **Slug**: `/tools/video-to-gif`
* **What it does**: Select a video clip, choose FPS and resolution, and generate an optimized looping GIF.
* **Tech**: `@ffmpeg/ffmpeg` (Wasm) or client-side Canvas GIF encoder (`gifshot` / `omggif`).

### 6.3 In-Browser Screen & Audio Recorder `[P2]`
* **Slug**: `/tools/screen-recorder`
* **What it does**: 1-click screen, window, or tab recording with optional microphone audio, downloading directly to WebM/MP4 with zero server uploads.
* **Tech**: `navigator.mediaDevices.getDisplayMedia` + `MediaRecorder` API.

---

## 🛠️ Architecture Checklist for New Tools
When adding any new tool to Daliy.Tools:
1. **Client-Side First**: Perform all operations inside the browser via Web APIs, Web Workers, or WebAssembly whenever technically possible.
2. **Design System**: Use the unified dark/editorial theme (`#201e1d` ink, `#ec3013` accent, `#f3f2f2` bg) with consistent breadcrumbs, dropzones, and action buttons.
3. **Data Registration**: Add the tool definition to [app/_data/tools.ts](file:///c:/Users/wwwhe/Desktop/Work/daliytools/app/_data/tools.ts) with `live: true` when published.
