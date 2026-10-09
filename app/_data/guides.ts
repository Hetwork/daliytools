import type { BlogPost } from "./blogs";

const author = { name: "Daliy.Tools", role: "Tool guides and documentation" };

export const guides: BlogPost[] = [
  {
    slug: "compress-pdf-without-losing-what-matters",
    title: "Compress a PDF without losing what matters",
    excerpt: "Choose a setting for scanned pages, understand what happens to searchable text, and check the downloaded PDF before submitting it.",
    category: "PDF workflows",
    publishedAt: "2026-10-06",
    readTime: "5 min read",
    author,
    featured: true,
    relatedTools: [{ slug: "compress-pdf", name: "Compress PDF" }, { slug: "split-pdf", name: "Split PDF" }, { slug: "merge-pdf", name: "Merge PDF" }],
    faqs: [
      { question: "Will the compressed PDF remain searchable?", answer: "This compressor rebuilds each page as a JPEG image inside a new PDF. Existing searchable text, clickable links, form fields, and accessibility tags are not preserved. Keep the original if you need those features." },
      { question: "Why is my compressed file larger?", answer: "A text-only PDF can already be very compact. Converting its pages to images can add more data than it removes. Compare the actual download size and keep the original when it is smaller." },
      { question: "Can I choose an exact target size?", answer: "No. The presets control page resolution and JPEG quality, not a guaranteed byte size. Inspect the result and try a lower setting only if the text is still readable." },
    ],
    content: `A smaller PDF is useful only if the recipient can still use it. A scanned receipt and a searchable CV may both end in .pdf, but they need different treatment. This guide explains the behavior of the [Daliy.Tools PDF compressor](/tools/compress-pdf), including the features it cannot preserve.

## Decide whether this compressor fits your document

Open the original and try selecting a sentence. If you can copy text, or the file contains working form fields, links, or a digital signature, keep that original. This tool renders every page into an image and places those images in a new PDF. It does not optimize the original text objects.

Scanned pages and photo-heavy documents are better candidates. For a CV that needs machine-readable text, an accessible document, or a signed agreement, use the originating application's PDF export settings instead. A visually identical page may not preserve its document features.

## Choose a preset based on the smallest important detail

These are the settings used by this tool, not measured promises about file-size savings:

| Preset | Resolution | JPEG quality setting | What to inspect |
| --- | --- | --- | --- |
| High | 200 DPI | 85% | Fine print, stamps, and thin lines |
| Balanced | 150 DPI | 72% | Normal scan text and photos |
| Low | 100 DPI | 50% | Blurred letters and blocky edges |

The quality percentage is an encoder input. It does not mean that the result keeps that percentage of the original information. High still creates image-only pages. Start with Balanced for a routine scan, then compare High if small print becomes hard to read.

## A worked upload-limit example

Suppose a portal accepts files below 2 MB and your scan is 8 MB. Those are illustrative numbers, not a benchmark. A Balanced export might be above or below the limit; page count, dimensions, and image detail affect the result.

1. Keep a separate copy of the original.
2. Load the scan and export with Balanced.
3. Check the downloaded file's size in your file manager.
4. Open the result and inspect the smallest text at normal size and with zoom.
5. Try Low only if you still need a smaller copy and the result remains legible.

If the result is still too large, remove genuinely unnecessary pages using [Split PDF](/tools/split-pdf), where the receiving service permits a shorter document. Do not remove required evidence merely to reach the size limit. If the portal expects searchable text, return to the original instead of compressing again.

## Check more than the first page

Compare page count, orientation, edges, and any stamps or handwritten notes. Verify that text near the margins was not clipped and that faint writing remains visible. Test any barcode with the device that will read it. A clear-looking preview alone does not prove that a barcode scans.

Text selection and links should not be expected to work after this image-based export. A picture of a signature is also not the original cryptographic signature. Keep the original for verification and future edits.

## When the process is slow or the file grows

The tool accepts files up to 50 MB, but file size alone does not predict memory use. A long scan expands into page-sized bitmaps during processing. Close other heavy tabs or work with a smaller page range if your device runs out of memory. Processing takes place in your browser; the selected PDF is not submitted to a compression server.

A text-only original may become larger after rendering. In that case, keep the smaller original. Repeatedly compressing the compressed copy adds another lossy conversion and does not restore missing detail. Always retry from the original.

Found a mismatch? [Report the tool, browser, and steps](/contact) without sending a confidential document.`,
  },
  {
    slug: "resize-or-compress-image-for-upload",
    title: "Resize or compress? Prepare an image for an upload limit",
    excerpt: "Work through pixel dimensions, file size, JPEG transparency, and format choices using a 4000 × 3000 photo example.",
    category: "Image workflows",
    publishedAt: "2026-10-06",
    readTime: "5 min read",
    author,
    relatedTools: [{ slug: "resize-image", name: "Resize Image" }, { slug: "compress-image", name: "Compress Image" }, { slug: "convert-image-format", name: "Convert Image Format" }],
    faqs: [
      { question: "Does a 50% resize make the file half as large?", answer: "No. Halving width and height reduces the pixel count to one quarter. Encoded file size also depends on format, detail, and quality, so measure the downloaded result." },
      { question: "Will Compress Image preserve a transparent logo?", answer: "No. Compress Image exports JPEG, which cannot store transparency. Use Resize Image or Convert Image Format with PNG or a supported WebP encoder when you need a transparent background." },
      { question: "Can converting JPEG to PNG restore quality?", answer: "No. PNG can preserve the decoded pixels without further lossy encoding, but it cannot recover detail already lost in the JPEG. The output may also be larger." },
    ],
    content: `An upload form can reject an image for three separate reasons: too many bytes, the wrong dimensions, or an unsupported format. Changing a filename from .png to .jpg fixes none of those. Start by writing down the receiving site's actual requirements, then change only what is necessary.

## Separate pixels from bytes

Pixel dimensions describe the image grid. File size describes the bytes used to encode that grid. A flat-color graphic and a detailed photograph can have identical dimensions and very different file sizes.

As a worked example, a 4000 × 3000 photo contains 12 million pixels. Resizing it to 1600 × 1200 leaves 1.92 million pixels, or 16% of the original count. That is arithmetic, not a promise that the download will be 84% smaller: the format and encoder also matter.

If a form requires a square image, use [Crop Image](/tools/crop-image) to choose the composition first. Forcing a rectangular photograph into a square by disabling the aspect-ratio lock stretches faces and objects.

## Resize first when the dimensions are too large

Open [Resize Image](/tools/resize-image), select your file, and keep the aspect ratio locked. In the example above, entering a width of 1600 produces a height of 1200. Check both values against the form's rules before downloading. The resizer accepts JPG, PNG, and WebP inputs up to 30 MB.

Do not enlarge a small image to recover detail: resizing creates additional pixels, but it cannot recreate the original photograph. If the required dimensions exceed your source dimensions, obtain a larger original where possible.

## Pick the output format for the destination

| Image and destination | Starting choice | What to check |
| --- | --- | --- |
| Photograph for a form accepting JPG | JPEG | Artifacts around fine details |
| Transparent logo | PNG | Transparent edges after export |
| Screenshot with small text | PNG | Readability and byte limit |
| Image for a site accepting WebP | WebP | Actual size and browser encoding support |

Our [Compress Image](/tools/compress-image) tool always exports JPEG. Its quality slider changes JPEG encoding; it does not resize the image or preserve transparent pixels. Transparent areas are filled with white. Use the format converter or resizer for a transparent PNG instead.

## Reduce bytes, then inspect the result

If dimensions are correct but the file exceeds the byte limit, start with a moderate JPEG quality setting, such as 80. Download and measure the result. Lower the setting gradually if needed, checking hair, text, gradients, and edges at normal viewing size after each change.

For an illustrative 500 KB limit, aim below the boundary rather than relying on a rounded "500 KB" display. Some services count decimal kilobytes and others use binary units. The upload service's acceptance is the final check. No quality setting guarantees a particular size for every image.

Avoid repeatedly editing downloaded JPEGs. Retry from your original or the single resized source so each attempt does not compound earlier lossy compression.

## Check the exported file, not just the preview

Open the download and verify its dimensions, format, background, and readability. A PNG-to-JPEG conversion should have a solid background; a transparent logo exported as PNG should still have transparency. Animated inputs are treated as still images by these canvas-based tools, so do not use them to preserve animation.

Browser encoding support varies. The converter reports an unsupported encoder instead of giving a PNG file an AVIF filename. If your chosen format is unavailable, use a supported format accepted by the destination.

These image tools process selected images locally. That statement applies to these tools; the site's social-media download tools use server requests. See the [privacy policy](/privacy-policy) for the distinction.

For browser encoding behavior, see [MDN's canvas export reference](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob). It explains how unsupported output formats fall back to PNG, which this tool detects.`,
  },
  {
    slug: "json-formatting-validation-and-data-loss",
    title: "Format JSON safely: syntax errors and data that can change",
    excerpt: "Fix an invalid JSON example, distinguish syntax from schema validation, and avoid losing large integer precision or duplicate keys.",
    category: "Developer workflows",
    publishedAt: "2026-10-06",
    readTime: "4 min read",
    author,
    relatedTools: [{ slug: "json-formatter", name: "JSON Formatter" }, { slug: "compare-files", name: "Compare Files" }],
    faqs: [
      { question: "Does valid JSON mean my API request is correct?", answer: "No. Parsing checks JSON syntax. An API may still reject missing fields, incorrect types, unsupported values, or a request that does not match its schema." },
      { question: "Is formatting a lossless whitespace edit?", answer: "Not in this formatter. It uses JSON.parse followed by JSON.stringify. Duplicate keys collapse, large integers may lose precision, and numeric notation or key ordering can change." },
    ],
    content: `The [JSON Formatter](/tools/json-formatter) makes a compact payload easier to read by parsing it and writing it back with two-space indentation. Parsing is not a whitespace-only edit. Keep an untouched copy when the exact bytes or numeric values matter.

## Repair one syntax problem at a time

Consider this intentionally invalid example:

~~~text
{'name': 'Sample', 'enabled': True,}
~~~

There are three independent problems: JSON strings need double quotes, the boolean must be lowercase, and the final member cannot have a trailing comma. The corrected input is:

~~~json
{"name":"Sample","enabled":true}
~~~

Paste that into the formatter and choose Format. The expected result is:

~~~json
{
  "name": "Sample",
  "enabled": true
}
~~~

If a larger payload fails, check the first changed section for a missing quote, comma, brace, or bracket. Comments are not part of JSON, even if a JavaScript or configuration editor accepts them. Avoid replacing every quote blindly: a quote inside a string may need escaping instead.

## Check types after the syntax is valid

The values 12, "12", and null are different. A number, a string containing digits, and an explicit empty value may lead an API to take different actions. Formatting cannot decide which one your application intended.

An empty array and a missing property are not interchangeable either. Consult the receiving API's schema for required fields and allowed values. This formatter checks whether the text can be parsed; it does not perform schema validation or send a trial request to the API.

## Watch for large integers

This implementation uses JavaScript JSON.parse and JSON.stringify. JavaScript numbers cannot represent every integer above 9007199254740991 exactly. Parsing the numeric literal 9007199254740993 and writing it back produces 9007199254740992.

For identifiers that must remain exact, a schema permitting strings can use "9007199254740993" instead. Do not change a field's type without checking the schema. If the receiver requires an exact large numeric literal, use a precision-preserving workflow instead of this formatter.

## Duplicate keys and signatures need extra care

The input {"status":"pending","status":"complete"} contains a duplicate key. This parser keeps the last value, so the formatted result contains only "status": "complete". That can hide a data-generation error. Inspect the original payload if values unexpectedly disappear.

Formatting changes whitespace and may normalize number notation or key order. If a webhook signature or checksum covers the raw request body, verify the original bytes before formatting a copy for inspection. Do not send the prettified copy with the original signature and expect it to remain valid.

## A practical inspection workflow

1. Keep the original payload in a separate file.
2. Remove real tokens and personal information before sharing an example.
3. Format a copy and inspect nesting, field names, and types.
4. Check large identifiers and repeated property names against the original.
5. Validate against the receiver's schema in your development workflow.
6. Use [Compare Files](/tools/compare-files) to inspect textual changes, remembering that a text diff is not schema validation.

The formatter operates in the browser and does not send pasted JSON to a formatting API. Browser extensions and your own clipboard remain outside the tool's control. If you [report a problem](/contact), send a small invented payload that reproduces it rather than production credentials.

For parsing syntax and numeric precision, see the [MDN JSON.parse reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).`,
  },
  {
    slug: "10-free-online-tools",
    title: "10 everyday file tasks: choose the tool and check the result",
    excerpt: "A task-based reference for PDFs, images, text, and JSON, with a concrete output check for each tool instead of promised time savings.",
    category: "Practical reference",
    publishedAt: "2026-09-16",
    updatedAt: "2026-10-06",
    readTime: "4 min read",
    author,
    relatedTools: [{ slug: "image-to-pdf", name: "Image to PDF" }, { slug: "resize-image", name: "Resize Image" }, { slug: "json-formatter", name: "JSON Formatter" }],
    faqs: [
      { question: "Do I need an account?", answer: "These tools can be opened without creating an account. Browser memory, supported formats, and the limits shown on each tool still apply." },
      { question: "Does every tool process data locally?", answer: "No. The file and text tools in this reference process inputs in the browser, but social-media download tools use server requests. Check the selected tool's disclosure rather than assuming the entire site works offline." },
    ],
    content: `Choose a tool by the change you need in the output. Combining pages, reducing bytes, and changing a filename are different operations. These references pair ten common tasks with a result you can verify. They do not promise a particular amount of time saved.

## 1. Combine document photos into one PDF

Use [Image to PDF](/tools/image-to-pdf) when each image should become a page. Arrange the thumbnails before generating the file, then check the exported page order and orientation. These pages contain pictures of text; this tool does not perform optical character recognition or make photographed text searchable.

## 2. Join existing PDFs

Use [Merge PDF](/tools/merge-pdf) for documents already in PDF format. Check the first page at every document boundary, not just the page count. Keep signed originals separately: a merged file should not be treated as preserving the original signature's validity.

## 3. Extract selected pages

Use [Split PDF](/tools/split-pdf) when the recipient needs part of a document. Compare exported pages with the original's actual page positions; a printed label may differ from the position in a PDF viewer. Inspect the last selected page for accidentally omitted content.

## 4. Reduce a scanned PDF's size

Use [Compress PDF](/tools/compress-pdf) when image-only output is acceptable. The export removes selectable text and interactive features. Read the [PDF compression guide](/blogs/compress-pdf-without-losing-what-matters) before using it on a CV, accessible document, or form. Compare both file size and legibility.

## 5. Meet an image dimension requirement

Use [Resize Image](/tools/resize-image) to change pixel width and height. Keep the aspect ratio locked to prevent distortion. If a different shape is required, crop first. Inspect the downloaded dimensions rather than assuming a smaller preview means a smaller file.

## 6. Reduce a photograph's bytes

Use [Compress Image](/tools/compress-image) when JPEG output is appropriate. Its slider changes quality, not dimensions. It cannot preserve transparency. The [image upload guide](/blogs/resize-or-compress-image-for-upload) explains the order of resizing, format selection, and compression.

## 7. Change an image format

Use [Convert Image Format](/tools/convert-image-format) instead of renaming an extension. Choose PNG for transparent graphics or JPEG for an opaque photograph. Open the result and check the background. Unsupported encoders produce an error; animations are not preserved.

## 8. Inspect a JSON payload

Use [JSON Formatter](/tools/json-formatter) to expose nesting and catch syntax errors. Parsing does not check an API schema, and it can alter large integers or collapse duplicate keys. Read the [JSON safety example](/blogs/json-formatting-validation-and-data-loss) if exact preservation matters.

## 9. Compare two text versions

Use [Compare Files](/tools/compare-files) after an edit. A changed line is evidence of a text change, not proof that the new document is correct. Review the changed values and their surrounding context before replacing the original.

## 10. Check a draft's word count

Use [Word Counter](/tools/word-counter) for an estimate while writing. Hyphens, punctuation, and non-space-delimited languages may be counted differently by the destination editor. For a strict word limit, use the destination's counter as the final authority.

## Keep an original and verify the download

Keep originals until the recipient accepts the result. Open downloads in the application that will actually use them. A browser preview does not establish that an upload form, printer, or document-processing system will accept the output.

If a result does not match the description, [report the tool and reproduction steps](/contact). Include the browser, input format, and expected result; avoid sending private documents or credentials.`,
  },
];
