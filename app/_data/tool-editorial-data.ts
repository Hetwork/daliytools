export type StepItem = {
  num: string;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedTool = {
  slug: string;
  name: string;
};

export type ToolEditorialItem = {
  guideTitle: string;
  steps: StepItem[];
  howItWorks: {
    title: string;
    description: string[];
  };
  faqs: FaqItem[];
  relatedTools: RelatedTool[];
};

export const toolEditorialData: Record<string, ToolEditorialItem> = {
  "image-to-pdf": {
    guideTitle: "How to Convert Images into a PDF",
    steps: [
      {
        num: "01",
        title: "Add Images",
        description: "Upload or drag JPG, PNG, WebP, or BMP files from your device.",
      },
      {
        num: "02",
        title: "Reorder & Customize",
        description: "Drag thumbnails to arrange page sequence and choose page orientation.",
      },
      {
        num: "03",
        title: "Export Single PDF",
        description: "Click generate and download your clean, combined PDF document instantly.",
      },
    ],
    howItWorks: {
      title: "How Image to PDF Works Locally",
      description: [
        "Daliy.Tools uses client-side PDF document generation directly in your browser. Each uploaded image is scaled, fitted to standard page dimensions (A4/Letter), and bound into an official PDF stream.",
        "Because conversion happens on your device using HTML5 Canvas and WebAssembly, your photos and sensitive receipts are never transmitted over the internet.",
      ],
    },
    faqs: [
      {
        question: "What image formats can I convert?",
        answer: "You can convert JPG, JPEG, PNG, WebP, GIF, SVG, and BMP files into a single PDF.",
      },
      {
        question: "Can I rearrange the order of pages?",
        answer: "Yes. Simply drag and drop image cards to order them exactly how you want them in the final PDF.",
      },
      {
        question: "Is there a limit on how many images I can convert?",
        answer: "No. You can merge as many photos and documents as your browser memory comfortably supports.",
      },
      {
        question: "Are my images private?",
        answer: "100% private. Files never leave your local browser session and are never sent to external servers.",
      },
    ],
    relatedTools: [
      { slug: "compress-pdf", name: "Compress PDF" },
      { slug: "merge-pdf", name: "Merge PDF" },
      { slug: "resize-image", name: "Resize Image" },
    ],
  },

  "merge-pdf": {
    guideTitle: "How to Combine Multiple PDF Files",
    steps: [
      {
        num: "01",
        title: "Select PDF Files",
        description: "Choose two or more PDF documents you want to merge into one file.",
      },
      {
        num: "02",
        title: "Organize Document Order",
        description: "Arrange the PDFs in the order you wish their pages to appear.",
      },
      {
        num: "03",
        title: "Merge & Save",
        description: "Combine all pages into a single cohesive document with one click.",
      },
    ],
    howItWorks: {
      title: "Fast, In-Browser PDF Merging",
      description: [
        "Our merging engine reads the internal cross-reference tables and page trees of each PDF directly in JavaScript, uniting them into a seamless single document stream without re-encoding.",
        "Your documents never travel through any third-party cloud infrastructure, keeping contracts, statements, and personal records secure.",
      ],
    },
    faqs: [
      {
        question: "Does merging PDFs reduce document quality?",
        answer: "No. Merging preserves the original vector text, high-resolution graphics, and fonts without compression artifacts.",
      },
      {
        question: "How many PDF documents can I combine at once?",
        answer: "You can combine dozens of PDF documents at once directly in your browser with zero file count limits.",
      },
      {
        question: "Will hyperlinks and bookmarks still work in the merged PDF?",
        answer: "Standard internal references and page links are preserved during the merge process.",
      },
      {
        question: "Are my files stored anywhere?",
        answer: "No. There is no server upload. Everything is processed locally in browser memory.",
      },
    ],
    relatedTools: [
      { slug: "split-pdf", name: "Split PDF" },
      { slug: "compress-pdf", name: "Compress PDF" },
      { slug: "image-to-pdf", name: "Image to PDF" },
    ],
  },

  "split-pdf": {
    guideTitle: "How to Split & Extract Pages from a PDF",
    steps: [
      {
        num: "01",
        title: "Upload Your PDF",
        description: "Drop your multi-page document into the split tool area.",
      },
      {
        num: "02",
        title: "Select Page Ranges",
        description: "Specify individual page numbers or continuous ranges (e.g. 1-3, 5, 8-10).",
      },
      {
        num: "03",
        title: "Extract Pages",
        description: "Download the extracted pages as a new, lightweight PDF file.",
      },
    ],
    howItWorks: {
      title: "Precision Client-Side Page Extraction",
      description: [
        "The tool parses the PDF page tree index, extracting only the binary object streams associated with your selected pages and building a clean, new document catalog.",
        "Everything executes locally inside your web browser, ensuring confidential documents remain private.",
      ],
    },
    faqs: [
      {
        question: "Can I extract non-consecutive pages?",
        answer: "Yes. You can select specific individual pages or custom ranges like 1, 4, 7-10.",
      },
      {
        question: "Does splitting a PDF damage the original file?",
        answer: "No. Your original file on your computer is completely untouched. A new PDF is generated containing only your chosen pages.",
      },
      {
        question: "Can I split password-protected PDFs?",
        answer: "You must enter or remove the document password before extracting pages so the browser can read the contents.",
      },
      {
        question: "Is there any cost or watermarking?",
        answer: "Daliy.Tools is 100% free with no watermarks, forced sign-ups, or subscriptions.",
      },
    ],
    relatedTools: [
      { slug: "merge-pdf", name: "Merge PDF" },
      { slug: "compress-pdf", name: "Compress PDF" },
      { slug: "image-to-pdf", name: "Image to PDF" },
    ],
  },

  "resize-image": {
    guideTitle: "How to Resize Images Online for Free",
    steps: [
      {
        num: "01",
        title: "Choose Image",
        description: "Select JPG, PNG, or WebP pictures from your computer or phone.",
      },
      {
        num: "02",
        title: "Set Dimensions",
        description: "Enter exact pixel width and height, or scale by percentage with aspect ratio lock.",
      },
      {
        num: "03",
        title: "Download Resized Photo",
        description: "Export your resized image instantly at high fidelity.",
      },
    ],
    howItWorks: {
      title: "High-Fidelity Browser Rescaling",
      description: [
        "Daliy.Tools utilizes hardware-accelerated HTML5 Canvas bicubic interpolation to recalculate pixel values. This preserves sharp edges and vibrant colors while reducing file weight.",
        "Since processing happens directly in your browser's memory, your photos are never uploaded to remote cloud servers.",
      ],
    },
    faqs: [
      {
        question: "Will resizing my image reduce its quality?",
        answer: "Downscaling preserves high visual quality while reducing file size. When upscaling, our interpolation engine smooths pixels to minimize blur.",
      },
      {
        question: "Can I lock aspect ratio to avoid distortion?",
        answer: "Yes. Aspect ratio lock is enabled by default so your image proportions remain perfectly natural.",
      },
      {
        question: "What image formats are supported?",
        answer: "We support JPG, JPEG, PNG, WebP, GIF, SVG, and BMP images.",
      },
      {
        question: "Can I resize images for Instagram or web banners?",
        answer: "Yes. You can enter any standard dimensions like 1080x1080 for Instagram square or 1920x1080 for Full HD.",
      },
    ],
    relatedTools: [
      { slug: "crop-image", name: "Crop Image" },
      { slug: "compress-image", name: "Compress Image" },
      { slug: "convert-image-format", name: "Convert Image Format" },
    ],
  },

  "compress-image": {
    guideTitle: "How to Compress and Optimize Images",
    steps: [
      {
        num: "01",
        title: "Upload Image",
        description: "Drop your large JPG, PNG, or WebP files into the compressor.",
      },
      {
        num: "02",
        title: "Select Compression Level",
        description: "Adjust the quality slider to balance maximum size reduction with visual clarity.",
      },
      {
        num: "03",
        title: "Download Compressed File",
        description: "Save your lightweight photo with up to 80% reduced file weight.",
      },
    ],
    howItWorks: {
      title: "Smart Lossy and Lossless Compression",
      description: [
        "The compressor strips unnecessary EXIF metadata, color profiles, and redundant color data while optimizing discrete cosine transform (DCT) matrices for JPEG and WebP images.",
        "Your files remain completely private on your machine without server roundtrips.",
      ],
    },
    faqs: [
      {
        question: "How much file size can I save?",
        answer: "Most high-resolution photos can be compressed by 50% to 85% with virtually unnoticeable loss in visual quality.",
      },
      {
        question: "Does image compression remove EXIF location data?",
        answer: "Yes, metadata is stripped during optimization, which also helps protect your personal privacy.",
      },
      {
        question: "Is there a daily limit on compressed images?",
        answer: "No. You can optimize as many images as you need with no limits or watermarks.",
      },
      {
        question: "Are PNG transparent backgrounds preserved?",
        answer: "Yes, transparent PNG and WebP graphics retain their transparency after compression.",
      },
    ],
    relatedTools: [
      { slug: "resize-image", name: "Resize Image" },
      { slug: "convert-image-format", name: "Convert Image Format" },
      { slug: "crop-image", name: "Crop Image" },
    ],
  },

  "convert-image-format": {
    guideTitle: "How to Convert Image Formats",
    steps: [
      {
        num: "01",
        title: "Select File",
        description: "Drop any JPG, PNG, WebP, GIF, or BMP image file.",
      },
      {
        num: "02",
        title: "Choose Target Format",
        description: "Pick your desired output format (e.g. WebP for web speed, PNG for transparency, JPG for compatibility).",
      },
      {
        num: "03",
        title: "Convert & Save",
        description: "Download the converted image file instantly without watermarks.",
      },
    ],
    howItWorks: {
      title: "Instant Multi-Format Transcoding",
      description: [
        "Using native browser Canvas encoding APIs, the tool decodes incoming raster image data and re-encodes it into the target container format with customized compression parameters.",
        "Because it runs directly on your CPU/GPU in browser memory, conversions take milliseconds.",
      ],
    },
    faqs: [
      {
        question: "Why should I convert JPG to WebP?",
        answer: "WebP files are typically 25% to 35% smaller than comparable JPEGs while maintaining equal image clarity, making websites load significantly faster.",
      },
      {
        question: "Can I convert transparent PNGs to JPG?",
        answer: "Yes. When converting a transparent PNG to JPG, transparent areas are cleanly filled with a solid white background.",
      },
      {
        question: "Are my images sent to any server?",
        answer: "No. All encoding happens locally inside your browser.",
      },
      {
        question: "Can I convert large photos?",
        answer: "Yes, files up to 50MB can be transcoded directly on your device.",
      },
    ],
    relatedTools: [
      { slug: "compress-image", name: "Compress Image" },
      { slug: "resize-image", name: "Resize Image" },
      { slug: "image-to-pdf", name: "Image to PDF" },
    ],
  },

  "crop-image": {
    guideTitle: "How to Crop Images to Exact Ratios",
    steps: [
      {
        num: "01",
        title: "Drop Photo",
        description: "Upload any photo or graphic you want to crop.",
      },
      {
        num: "02",
        title: "Adjust Crop Box",
        description: "Drag the crop handles or select standard presets (1:1, 16:9, 4:3, 9:16).",
      },
      {
        num: "03",
        title: "Download Cropped Image",
        description: "Save your trimmed picture in crystal-clear full resolution.",
      },
    ],
    howItWorks: {
      title: "Precision Pixel Clipping",
      description: [
        "The crop tool maps your visual bounding box coordinates onto the image source buffer, slicing and re-rendering only the active rectangle to a newly dimensioned Canvas canvas.",
        "Zero data leaves your device, keeping your private pictures safe.",
      ],
    },
    faqs: [
      {
        question: "What social media aspect ratios are supported?",
        answer: "Standard presets include 1:1 (Instagram Square), 16:9 (YouTube/Landscape), 9:16 (Stories/Reels/TikTok), and 4:5 (Instagram Portrait).",
      },
      {
        question: "Does cropping reduce image resolution?",
        answer: "Cropping extracts pixels at full original density without artificial downsampling or compression artifacts.",
      },
      {
        question: "Can I undo or reset my crop?",
        answer: "Yes, you can reset the crop boundary at any time before downloading.",
      },
      {
        question: "Is there any cost?",
        answer: "All image editing tools on Daliy.Tools are 100% free with no ads over the workspace.",
      },
    ],
    relatedTools: [
      { slug: "resize-image", name: "Resize Image" },
      { slug: "color-picker", name: "Color Picker" },
      { slug: "compress-image", name: "Compress Image" },
    ],
  },

  "remove-background": {
    guideTitle: "How to Remove Backgrounds from Photos",
    steps: [
      {
        num: "01",
        title: "Upload Photo",
        description: "Select a portrait, product shot, or graphic with a clear subject.",
      },
      {
        num: "02",
        title: "Auto-Isolate Subject",
        description: "Our client-side vision algorithm separates the foreground subject from the background.",
      },
      {
        num: "03",
        title: "Export Transparent PNG",
        description: "Download a clean cut-out with a transparent alpha channel.",
      },
    ],
    howItWorks: {
      title: "In-Browser Foreground Segmentation",
      description: [
        "The background remover processes color contrast, edge gradients, and luminosity thresholds to isolate the primary subject from surrounding backdrop pixels.",
        "Everything executes locally inside your web browser without sending photos to remote AI servers.",
      ],
    },
    faqs: [
      {
        question: "What types of photos work best?",
        answer: "Photos with good contrast between the subject and background (like product photography, portraits, or logos) produce the cleanest results.",
      },
      {
        question: "In what format is the cutout saved?",
        answer: "Results are exported as transparent PNG files ready for graphic design or e-commerce listings.",
      },
      {
        question: "Are my personal photos uploaded anywhere?",
        answer: "No. Your images remain private on your computer or phone.",
      },
      {
        question: "Is this tool free for commercial use?",
        answer: "Yes. You can use cut-outs for store listings, thumbnails, and marketing materials freely.",
      },
    ],
    relatedTools: [
      { slug: "convert-image-format", name: "Convert Image Format" },
      { slug: "crop-image", name: "Crop Image" },
      { slug: "resize-image", name: "Resize Image" },
    ],
  },

  "word-counter": {
    guideTitle: "How to Count Words and Analyze Text",
    steps: [
      {
        num: "01",
        title: "Paste or Type Text",
        description: "Enter your essay, article, speech, or social post into the text area.",
      },
      {
        num: "02",
        title: "View Live Metrics",
        description: "Get instant word count, character count (with/without spaces), sentences, and paragraphs.",
      },
      {
        num: "03",
        title: "Check Reading Time",
        description: "Review estimated reading and speaking times for presentations or blogs.",
      },
    ],
    howItWorks: {
      title: "Real-Time Text Stream Analysis",
      description: [
        "Our text parser tokenizes your input using regex boundary algorithms that accurately handle hyphenated words, Unicode characters, and punctuation marks.",
        "Calculations update on every keystroke with zero latency and zero server transmission.",
      ],
    },
    faqs: [
      {
        question: "How is reading time calculated?",
        answer: "Estimated reading time is calculated based on an average adult reading speed of 225 words per minute.",
      },
      {
        question: "Does the word counter support non-English languages?",
        answer: "Yes. Our Unicode-compliant parser accurately counts words in Spanish, French, German, Arabic, Hindi, and other languages.",
      },
      {
        question: "Is my pasted text saved or logged?",
        answer: "No. Your text exists only in your temporary browser session and is never logged or stored.",
      },
      {
        question: "Can I count characters for Twitter/X character limits?",
        answer: "Yes. Character counts both with and without spaces are displayed clearly in real time.",
      },
    ],
    relatedTools: [
      { slug: "case-converter", name: "Case Converter" },
      { slug: "compare-files", name: "Compare Files" },
      { slug: "markdown-viewer", name: "Markdown Viewer" },
    ],
  },

  "case-converter": {
    guideTitle: "How to Convert Text Letter Case",
    steps: [
      {
        num: "01",
        title: "Enter Text",
        description: "Paste your text or titles into the converter box.",
      },
      {
        num: "02",
        title: "Select Case Style",
        description: "Choose UPPERCASE, lowercase, Title Case, Sentence case, camelCase, or snake_case.",
      },
      {
        num: "03",
        title: "Copy Result",
        description: "Click copy to clipboard and paste your formatted text anywhere.",
      },
    ],
    howItWorks: {
      title: "Intelligent Case Transformation",
      description: [
        "The case converter analyzes word delimiters, capitalizes title words according to Chicago/AP style guidelines, and handles programming identifier conventions like camelCase and kebab-case.",
      ],
    },
    faqs: [
      {
        question: "What case styles are available?",
        answer: "UPPERCASE, lowercase, Title Case, Sentence case, Capitalized Case, camelCase, snake_case, and kebab-case.",
      },
      {
        question: "Does Title Case skip small words like 'and', 'the', and 'in'?",
        answer: "Yes. Major title styling rules automatically keep conjunctions and prepositions lowercase unless they start the sentence.",
      },
      {
        question: "Is there a limit on text length?",
        answer: "You can convert thousands of lines or entire articles instantaneously.",
      },
      {
        question: "Is my text uploaded anywhere?",
        answer: "Never. All string manipulation executes in local browser JavaScript.",
      },
    ],
    relatedTools: [
      { slug: "word-counter", name: "Word Counter" },
      { slug: "compare-files", name: "Compare Files" },
      { slug: "json-formatter", name: "JSON Formatter" },
    ],
  },

  "qr-code-generator": {
    guideTitle: "How to Generate Custom QR Codes",
    steps: [
      {
        num: "01",
        title: "Enter Data",
        description: "Type or paste a website URL, Wi-Fi login, contact card, or plain text.",
      },
      {
        num: "02",
        title: "Customize & Preview",
        description: "Adjust size, error correction, and color preview instantly.",
      },
      {
        num: "03",
        title: "Download QR Code",
        description: "Export high-resolution PNG or SVG ready for print, menus, or digital flyers.",
      },
    ],
    howItWorks: {
      title: "Static QR Matrix Encoding",
      description: [
        "The tool converts your input into binary Reed-Solomon error correction matrices. These static 2D barcodes embed your actual payload directly, meaning they will continue working forever without expired links.",
        "Generated entirely on your device with no tracking redirects.",
      ],
    },
    faqs: [
      {
        question: "Do these QR codes ever expire?",
        answer: "No. These are permanent, static QR codes that point directly to your destination without third-party redirects.",
      },
      {
        question: "Can I use these QR codes for commercial projects?",
        answer: "Yes. They are 100% free for business cards, restaurant menus, packaging, and advertising.",
      },
      {
        question: "What is QR error correction?",
        answer: "Error correction allows the QR code to be scanned reliably even if parts are smudged, damaged, or obscured.",
      },
      {
        question: "Can I make a Wi-Fi QR code?",
        answer: "Yes. Wi-Fi QR codes allow guests to connect to your network instantly by scanning without typing passwords.",
      },
    ],
    relatedTools: [
      { slug: "password-generator", name: "Password Generator" },
      { slug: "base64-converter", name: "Base64 Converter" },
      { slug: "icon-kitchen", name: "Icon Kitchen" },
    ],
  },

  "password-generator": {
    guideTitle: "How to Generate Strong, Secure Passwords",
    steps: [
      {
        num: "01",
        title: "Select Length & Options",
        description: "Choose password length (12-64 characters) and toggle symbols, numbers, and uppercase.",
      },
      {
        num: "02",
        title: "Generate Instantly",
        description: "Click generate to create cryptographically secure, random passwords.",
      },
      {
        num: "03",
        title: "Copy Safely",
        description: "Copy to your clipboard and paste into your password manager or account setup.",
      },
    ],
    howItWorks: {
      title: "Cryptographically Secure Entropy (CSPRNG)",
      description: [
        "Daliy.Tools uses the browser's built-in window.crypto.getRandomValues() API rather than pseudo-random functions. This provides true cryptographic entropy resistant to brute-force predictions.",
        "Your generated passwords are never saved, transmitted, or logged anywhere.",
      ],
    },
    faqs: [
      {
        question: "How secure are passwords generated here?",
        answer: "They use industry-standard CSPRNG random number generation with high entropy, making them extremely resistant to dictionary and brute-force attacks.",
      },
      {
        question: "Are generated passwords sent over the network?",
        answer: "No. The generator runs completely offline inside your browser. No passwords ever touch a server.",
      },
      {
        question: "What is the recommended password length?",
        answer: "Security experts recommend at least 16 characters containing a mix of uppercase letters, lowercase letters, numbers, and symbols.",
      },
      {
        question: "Can I generate pronounceable passphrases?",
        answer: "Yes. You can customize character subsets and lengths to fit specific banking or service requirements.",
      },
    ],
    relatedTools: [
      { slug: "qr-code-generator", name: "QR Code Generator" },
      { slug: "jwt-decoder", name: "JWT Decoder" },
      { slug: "base64-converter", name: "Base64 Converter" },
    ],
  },

  "percentage-calculator": {
    guideTitle: "How to Calculate Percentages Easily",
    steps: [
      {
        num: "01",
        title: "Choose Calculation Type",
        description: "Calculate what is X% of Y, percentage increase/decrease, or find the ratio.",
      },
      {
        num: "02",
        title: "Enter Values",
        description: "Type in your numbers to see immediate, real-time math calculations.",
      },
      {
        num: "03",
        title: "View Formula & Result",
        description: "Get the exact answer along with the underlying mathematical formula.",
      },
    ],
    howItWorks: {
      title: "Fast Real-Time Mathematical Computation",
      description: [
        "The calculator performs floating-point arithmetic with precise rounding logic for financial percentages, retail discounts, markups, tips, and tax calculations.",
      ],
    },
    faqs: [
      {
        question: "How do I calculate percentage discount?",
        answer: "Multiply the original price by the discount percentage and divide by 100, then subtract that amount from the original price.",
      },
      {
        question: "Can I calculate percentage increase or decrease?",
        answer: "Yes. Our tool calculates the percentage difference between any old value and new value automatically.",
      },
      {
        question: "Is this calculator suitable for financial calculations?",
        answer: "Yes, it provides high-precision decimal outputs suitable for taxes, tips, profit margins, and investments.",
      },
      {
        question: "Is it free to use?",
        answer: "Yes, 100% free without sign-up or calculations limits.",
      },
    ],
    relatedTools: [
      { slug: "unit-converter", name: "Unit Converter" },
      { slug: "age-calculator", name: "Age Calculator" },
      { slug: "word-counter", name: "Word Counter" },
    ],
  },

  "json-formatter": {
    guideTitle: "How to Format and Validate JSON",
    steps: [
      {
        num: "01",
        title: "Paste Raw JSON",
        description: "Paste unformatted or minified JSON data into the editor.",
      },
      {
        num: "02",
        title: "Beautify or Minify",
        description: "Click format with 2-space or 4-space indentation, or minify for production.",
      },
      {
        num: "03",
        title: "Validate & Copy",
        description: "Check for syntax errors and copy the validated JSON in one click.",
      },
    ],
    howItWorks: {
      title: "Syntax Validation and Tree Parsing",
      description: [
        "Our formatter uses native JSON parsing algorithms to validate syntax tokens, pinpoint line numbers for missing commas or unmatched brackets, and output cleanly indented structures.",
        "Your payloads and API keys are never transmitted to any external server.",
      ],
    },
    faqs: [
      {
        question: "Does this tool detect JSON syntax errors?",
        answer: "Yes. If your JSON has syntax issues (like missing quotes or trailing commas), it highlights the exact line and error description.",
      },
      {
        question: "Can I minify JSON for web APIs?",
        answer: "Yes. Minify removes all whitespace and line breaks, reducing payload size for faster network transfer.",
      },
      {
        question: "Is my confidential JSON data private?",
        answer: "Completely private. Everything runs locally in your browser so API tokens and user records remain safe.",
      },
      {
        question: "Can it handle large JSON files?",
        answer: "Yes. It can parse multi-megabyte JSON payloads quickly.",
      },
    ],
    relatedTools: [
      { slug: "jwt-decoder", name: "JWT Decoder" },
      { slug: "base64-converter", name: "Base64 Converter" },
      { slug: "html-viewer", name: "HTML Viewer" },
    ],
  },
};
