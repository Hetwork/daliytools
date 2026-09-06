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
  "unlock-pdf": {
    guideTitle: "How to Remove a Password from a PDF",
    steps: [
      {
        num: "01",
        title: "Choose Your PDF",
        description: "Upload the password-protected PDF from your device.",
      },
      {
        num: "02",
        title: "Enter the Password",
        description: "Type the document password you already know so the file can be opened.",
      },
      {
        num: "03",
        title: "Download Unlocked PDF",
        description: "Export a new copy without password protection. Your original stays unchanged.",
      },
    ],
    howItWorks: {
      title: "Unlock PDFs Privately in Your Browser",
      description: [
        "The document is opened with your password using PDF.js, then each page is written into a new PDF without encryption. This makes the downloaded copy accessible without a password.",
        "Everything happens in your browser. Your PDF and password are never uploaded or stored by Daliy.Tools.",
      ],
    },
    faqs: [
      {
        question: "Do I need to know the PDF password?",
        answer: "Yes. This tool is for removing protection from documents you are authorized to access. It cannot bypass an unknown password.",
      },
      {
        question: "Will my original PDF be changed?",
        answer: "No. The tool creates a separate unlocked copy and leaves the original file on your device untouched.",
      },
      {
        question: "Will selectable text and links be preserved?",
        answer: "The unlocked copy is rendered page by page for reliable browser-only processing, so text selection, links, forms, and bookmarks are not preserved.",
      },
      {
        question: "Are my PDF and password uploaded?",
        answer: "No. The file and password stay in your browser while the new PDF is generated.",
      },
    ],
    relatedTools: [
      { slug: "compress-pdf", name: "Compress PDF" },
      { slug: "split-pdf", name: "Split PDF" },
      { slug: "merge-pdf", name: "Merge PDF" },
    ],
  },

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

  "age-calculator": {
    guideTitle: "How to Calculate Your Exact Age",
    steps: [
      { num: "01", title: "Enter Birth Date", description: "Choose your date of birth from the calendar." },
      { num: "02", title: "Set Reference Date", description: "Use today or select another date for an age comparison." },
      { num: "03", title: "Read the Results", description: "See your exact age plus totals in days, weeks, months, and hours." },
    ],
    howItWorks: { title: "Calendar-Accurate Date Arithmetic", description: ["The calculator compares calendar years, months, and days, then calculates total elapsed days from the two selected dates.", "All calculations run in your browser. The dates you enter are not uploaded or stored."] },
    faqs: [
      { question: "Can I calculate age on a future date?", answer: "Yes. Turn off the Today option and choose any reference date after the date of birth." },
      { question: "Does the calculator account for leap years?", answer: "Yes. Date arithmetic uses the calendar rules built into your browser, including leap years and varying month lengths." },
      { question: "Can I calculate someone else's age?", answer: "Yes. Enter any birth date and reference date to calculate the exact difference." },
      { question: "Are my dates private?", answer: "Yes. The calculation happens locally in your browser and the dates are never sent to a server." },
    ],
    relatedTools: [{ slug: "percentage-calculator", name: "Percentage Calculator" }, { slug: "unit-converter", name: "Unit Converter" }, { slug: "word-counter", name: "Word Counter" }],
  },

  "audio-cutter": {
    guideTitle: "How to Trim an Audio File",
    steps: [
      { num: "01", title: "Upload Audio", description: "Choose an MP3, WAV, M4A, OGG, or other supported audio file." },
      { num: "02", title: "Set the Range", description: "Move the start and end handles to select the section you need." },
      { num: "03", title: "Export the Clip", description: "Preview your selection and download the trimmed audio." },
    ],
    howItWorks: { title: "Non-Destructive Browser Audio Editing", description: ["The tool decodes your audio into a browser buffer, selects the requested time range, and encodes a new clip without changing your original file.", "Processing stays on your device. Audio is not uploaded or retained by Daliy.Tools."] },
    faqs: [
      { question: "Which audio formats can I trim?", answer: "Common browser-supported formats such as MP3, WAV, M4A, OGG, and AAC work best." },
      { question: "Will the original audio be changed?", answer: "No. The original file remains untouched, and the tool creates a separate trimmed download." },
      { question: "Can I preview the selected section?", answer: "Yes. Use the built-in playback controls to check the start and end points before exporting." },
      { question: "Are my recordings uploaded?", answer: "No. Audio processing takes place locally in browser memory." },
    ],
    relatedTools: [{ slug: "video-to-frames", name: "Video to Frames" }, { slug: "screen-recorder", name: "Screen Recorder" }, { slug: "compress-image", name: "Compress Image" }],
  },

  "base64-converter": {
    guideTitle: "How to Encode and Decode Base64",
    steps: [
      { num: "01", title: "Choose a Mode", description: "Select Base64, URL, or HTML entity encoding and decoding." },
      { num: "02", title: "Enter Your Value", description: "Paste text, encoded data, or a URL into the input panel." },
      { num: "03", title: "Copy the Result", description: "Review the converted output and copy it to your clipboard." },
    ],
    howItWorks: { title: "Standard Browser Encoding APIs", description: ["The converter applies the relevant UTF-8, Base64, percent-encoding, or HTML entity rules to transform your input into a compatible string.", "Your tokens and text stay in the current browser tab and are never transmitted."] },
    faqs: [
      { question: "What can I encode or decode?", answer: "You can convert Base64 strings, URL components, and common HTML entities in either direction." },
      { question: "Does Base64 encrypt my data?", answer: "No. Base64 is an encoding format, not encryption. Anyone with the encoded value can decode it." },
      { question: "Can I convert Unicode text?", answer: "Yes. The tool handles regular Unicode text through UTF-8 compatible browser processing." },
      { question: "Is my input saved?", answer: "No. Conversion happens locally and your input is not stored on a server." },
    ],
    relatedTools: [{ slug: "jwt-decoder", name: "JWT Decoder" }, { slug: "json-formatter", name: "JSON Formatter" }, { slug: "html-viewer", name: "HTML Viewer" }],
  },

  "color-picker": {
    guideTitle: "How to Pick Colors from an Image",
    steps: [
      { num: "01", title: "Upload an Image", description: "Choose a photo, screenshot, or graphic from your device." },
      { num: "02", title: "Pick a Pixel", description: "Move over the image and select the color you want to inspect." },
      { num: "03", title: "Copy Color Values", description: "Copy the HEX, RGB, or HSL value for your design or code." },
    ],
    howItWorks: { title: "Pixel Sampling on a Local Canvas", description: ["The browser draws your image to a canvas and reads the red, green, and blue values at the selected pixel, then converts them to common color formats.", "The image remains in local browser memory and is not sent to a remote service."] },
    faqs: [
      { question: "Which color formats are provided?", answer: "The picker provides HEX, RGB, and HSL values for the selected pixel." },
      { question: "Can I use screenshots and transparent PNGs?", answer: "Yes. Standard image files, screenshots, and PNG graphics are supported by the browser." },
      { question: "How accurate are the picked colors?", answer: "Values are read directly from the rendered pixel, subject to the source image and browser color handling." },
      { question: "Are my images uploaded?", answer: "No. Image sampling is performed locally in your browser." },
    ],
    relatedTools: [{ slug: "contrast-checker", name: "Contrast Checker" }, { slug: "convert-image-format", name: "Convert Image Format" }, { slug: "resize-image", name: "Resize Image" }],
  },

  "compare-files": {
    guideTitle: "How to Compare Two Text Files",
    steps: [
      { num: "01", title: "Add the Files", description: "Paste or load the first and second versions of your text." },
      { num: "02", title: "Review Differences", description: "Scan the side-by-side comparison for inserted, removed, or changed lines." },
      { num: "03", title: "Copy What You Need", description: "Use the comparison to verify revisions or combine the correct content." },
    ],
    howItWorks: { title: "Line-by-Line Text Comparison", description: ["The comparison splits each input into lines, matches common content, and marks additions and removals so changes are easy to inspect.", "Both inputs remain in your browser tab. The tool does not upload or log your documents."] },
    faqs: [
      { question: "What files can I compare?", answer: "You can compare plain text, code, Markdown, JSON, and other text-based content." },
      { question: "Does comparison change either file?", answer: "No. The tool only displays differences and leaves your original content unchanged." },
      { question: "Can I compare large documents?", answer: "Yes, although very large files may take longer because the comparison runs in browser memory." },
      { question: "Is confidential text private?", answer: "Yes. The comparison runs locally and your documents are not sent to a server." },
    ],
    relatedTools: [{ slug: "word-counter", name: "Word Counter" }, { slug: "case-converter", name: "Case Converter" }, { slug: "json-formatter", name: "JSON Formatter" }],
  },

  "contrast-checker": {
    guideTitle: "How to Check WCAG Color Contrast",
    steps: [
      { num: "01", title: "Choose Text Color", description: "Enter or select the foreground color used for your text." },
      { num: "02", title: "Choose Background", description: "Set the background color behind the text or interface element." },
      { num: "03", title: "Review Accessibility", description: "Check the contrast ratio and WCAG AA or AAA results." },
    ],
    howItWorks: { title: "Relative Luminance and WCAG Ratios", description: ["The checker converts sRGB colors to relative luminance and compares the two values using the WCAG contrast ratio formula.", "All color calculations run locally, so your palette and design details remain in the browser."] },
    faqs: [
      { question: "What contrast ratio should normal text meet?", answer: "WCAG AA generally requires a ratio of at least 4.5:1 for normal text and 3:1 for large text." },
      { question: "What do AA and AAA mean?", answer: "They are WCAG conformance levels. AAA is the stricter target and may require stronger contrast." },
      { question: "Does the tool check large text?", answer: "Yes. Results distinguish normal and large text thresholds so you can assess both cases." },
      { question: "Are colors sent to a server?", answer: "No. The ratio and pass or fail results are calculated entirely in your browser." },
    ],
    relatedTools: [{ slug: "color-picker", name: "Color Picker" }, { slug: "convert-image-format", name: "Convert Image Format" }, { slug: "resize-image", name: "Resize Image" }],
  },

  "html-viewer": {
    guideTitle: "How to Preview HTML in Your Browser",
    steps: [
      { num: "01", title: "Paste HTML", description: "Enter markup into the editor, including styles and basic scripts." },
      { num: "02", title: "Inspect the Preview", description: "See the rendered result update as you edit the HTML." },
      { num: "03", title: "Refine Your Markup", description: "Use the live preview to test structure, spacing, and content." },
    ],
    howItWorks: { title: "Live Document Rendering", description: ["The viewer places your markup into an isolated preview document and refreshes it as the source changes, giving you immediate visual feedback.", "The editor content stays in your browser session. Avoid pasting untrusted scripts when testing unknown code."] },
    faqs: [
      { question: "Can I preview CSS with my HTML?", answer: "Yes. Include style elements or inline styles in the markup to preview their effect." },
      { question: "Does the preview access my files?", answer: "The preview only renders the content you provide and does not upload it to Daliy.Tools." },
      { question: "Can I use JavaScript in the preview?", answer: "Basic scripts may run in the preview, so only test code you understand and trust." },
      { question: "Can I use this to publish a webpage?", answer: "It is a testing and preview tool. You still need hosting to publish a page publicly." },
    ],
    relatedTools: [{ slug: "markdown-viewer", name: "Markdown Viewer" }, { slug: "base64-converter", name: "Base64 Converter" }, { slug: "json-formatter", name: "JSON Formatter" }],
  },

  "icon-kitchen": {
    guideTitle: "How to Create App Icons and Favicons",
    steps: [
      { num: "01", title: "Add Source Artwork", description: "Upload a square logo or image for your app icon set." },
      { num: "02", title: "Configure the Set", description: "Choose backgrounds, padding, and the platforms you want to support." },
      { num: "03", title: "Download Assets", description: "Generate the required PNG sizes and download the asset package." },
    ],
    howItWorks: { title: "Multi-Size Image Export", description: ["The generator scales your source artwork onto platform-specific canvases, applies the selected padding and background, and packages the resulting PNG files.", "Artwork processing happens locally in your browser. Source images are not uploaded or stored."] },
    faqs: [
      { question: "Which platforms are supported?", answer: "You can create common Android, iOS, web app, and favicon sizes from one source image." },
      { question: "Should my source image be square?", answer: "Yes. A square, high-resolution source usually produces the cleanest results across every output size." },
      { question: "Can I create transparent icons?", answer: "Yes. Use a transparent source and choose the available transparent background option." },
      { question: "Are source images kept private?", answer: "Yes. Icon generation is performed locally in browser memory." },
    ],
    relatedTools: [{ slug: "resize-image", name: "Resize Image" }, { slug: "convert-image-format", name: "Convert Image Format" }, { slug: "compress-image", name: "Compress Image" }],
  },

  "instagram-post": {
    guideTitle: "How to Download Public Instagram Posts",
    steps: [
      { num: "01", title: "Copy a Public URL", description: "Copy the link to a public Instagram post or carousel." },
      { num: "02", title: "Paste the Link", description: "Enter the post URL and let the tool retrieve available media." },
      { num: "03", title: "Save the Media", description: "Review the returned items and download the files you are permitted to use." },
    ],
    howItWorks: { title: "URL-Based Media Retrieval", description: ["The downloader sends the public post URL to its retrieval endpoint, which checks the available media and returns download links when the post can be accessed.", "Only use media you own or have permission to download. Public availability does not remove copyright or platform restrictions."] },
    faqs: [
      { question: "Can I download private posts?", answer: "No. The tool is intended for publicly accessible posts and cannot bypass private account controls." },
      { question: "Can I download carousels?", answer: "Yes, when the public post exposes its carousel media to the retrieval service." },
      { question: "Can I reuse downloaded media commercially?", answer: "Only when you own the content or have permission and comply with Instagram's terms and applicable copyright law." },
      { question: "Does Daliy.Tools store the downloads?", answer: "The tool does not provide a personal media library. Downloaded files are saved by your browser to your device." },
    ],
    relatedTools: [{ slug: "youtube-downloader", name: "YouTube Downloader" }, { slug: "video-to-frames", name: "Video to Frames" }, { slug: "compress-image", name: "Compress Image" }],
  },

  "jwt-decoder": {
    guideTitle: "How to Inspect a JWT Token",
    steps: [
      { num: "01", title: "Paste the Token", description: "Enter a JSON Web Token into the decoder field." },
      { num: "02", title: "Inspect Header and Payload", description: "Review the decoded algorithm, claims, timestamps, and other fields." },
      { num: "03", title: "Check the Context", description: "Use the claims to understand the token, but verify it with the issuing service." },
    ],
    howItWorks: { title: "Local JWT Segment Decoding", description: ["A JWT contains Base64URL-encoded header and payload segments. The decoder parses those segments into readable JSON without needing the signing secret.", "Decoding does not validate a signature. Tokens stay in the browser and are not sent to a server."] },
    faqs: [
      { question: "Does decoding a JWT verify it?", answer: "No. Decoding only reads the token contents. Signature verification must happen with the issuer's trusted key and rules." },
      { question: "Can I decode an expired token?", answer: "Yes. The tool can display its expiration claim, but an expired token should not be treated as valid." },
      { question: "Should I paste production tokens here?", answer: "Use care with sensitive credentials. Although processing is local, avoid exposing active tokens unnecessarily." },
      { question: "What parts of a JWT are shown?", answer: "The decoder displays the header, payload claims, and readable timestamp values when present." },
    ],
    relatedTools: [{ slug: "base64-converter", name: "Base64 Converter" }, { slug: "json-formatter", name: "JSON Formatter" }, { slug: "password-generator", name: "Password Generator" }],
  },

  "lorem-ipsum-generator": {
    guideTitle: "How to Generate Placeholder Text",
    steps: [
      { num: "01", title: "Choose a Format", description: "Select paragraphs, sentences, or word count for your mock content." },
      { num: "02", title: "Set the Amount", description: "Choose how much placeholder copy your layout needs." },
      { num: "03", title: "Copy the Text", description: "Generate the result and copy it into your design or prototype." },
    ],
    howItWorks: { title: "Deterministic Placeholder Text Assembly", description: ["The generator selects words from a local Latin-style vocabulary and groups them into sentences or paragraphs according to your requested amount.", "No input is required and generated text remains entirely within your browser session."] },
    faqs: [
      { question: "What is Lorem Ipsum used for?", answer: "It fills a design with realistic text-shaped content while typography, spacing, and layout are being tested." },
      { question: "Can I generate a specific number of paragraphs?", answer: "Yes. Choose the output format and amount before generating your placeholder copy." },
      { question: "Is the generated text original writing?", answer: "No. It is filler text for prototypes and should be replaced with meaningful content before publication." },
      { question: "Does the generator require an account?", answer: "No. It runs immediately in your browser without sign-up or server storage." },
    ],
    relatedTools: [{ slug: "word-counter", name: "Word Counter" }, { slug: "case-converter", name: "Case Converter" }, { slug: "markdown-viewer", name: "Markdown Viewer" }],
  },

  "markdown-viewer": {
    guideTitle: "How to Write and Preview Markdown",
    steps: [
      { num: "01", title: "Enter Markdown", description: "Type or paste headings, lists, links, tables, and other Markdown syntax." },
      { num: "02", title: "Preview the Result", description: "Review the rendered document beside your source as you edit." },
      { num: "03", title: "Refine and Copy", description: "Adjust the source until the formatted content reads as expected." },
    ],
    howItWorks: { title: "Client-Side Markdown Rendering", description: ["The viewer parses Markdown syntax in the browser and renders it into an HTML preview, including common GitHub-Flavored Markdown features.", "Your document stays in the current tab and is not uploaded or logged."] },
    faqs: [
      { question: "Does the viewer support GitHub-Flavored Markdown?", answer: "Yes. Common extensions such as tables, task lists, and strikethrough are supported." },
      { question: "Can I preview code blocks?", answer: "Yes. Fenced code blocks are rendered as formatted blocks in the preview." },
      { question: "Can I publish the rendered page directly?", answer: "No. This tool provides a preview; you need a publishing workflow or host for a public page." },
      { question: "Is my Markdown private?", answer: "Yes. Rendering runs locally in your browser without server uploads." },
    ],
    relatedTools: [{ slug: "html-viewer", name: "HTML Viewer" }, { slug: "word-counter", name: "Word Counter" }, { slug: "compare-files", name: "Compare Files" }],
  },

  "screen-recorder": {
    guideTitle: "How to Record Your Screen",
    steps: [
      { num: "01", title: "Choose a Source", description: "Select a browser tab, window, or entire screen when prompted." },
      { num: "02", title: "Start Recording", description: "Allow optional microphone audio and record your walkthrough or presentation." },
      { num: "03", title: "Stop and Save", description: "End the recording and download the resulting video file." },
    ],
    howItWorks: { title: "Browser Media Capture", description: ["The recorder uses the browser's MediaRecorder API to capture the screen source and optional microphone stream into a downloadable video blob.", "Recording data is assembled in local browser memory. The site does not receive your screen or microphone feed."] },
    faqs: [
      { question: "Can I record a browser tab?", answer: "Yes. Choose a tab in the browser's screen-sharing prompt, subject to your browser's permissions." },
      { question: "Can I include microphone audio?", answer: "Yes. Allow microphone access when starting the recording if you want narration." },
      { question: "Why do I need to grant screen permission?", answer: "Browsers require explicit permission before a site can capture a screen, window, or tab." },
      { question: "Is my recording uploaded?", answer: "No. The recording is created locally and downloaded directly to your device." },
    ],
    relatedTools: [{ slug: "audio-cutter", name: "Audio Cutter" }, { slug: "video-to-frames", name: "Video to Frames" }, { slug: "youtube-downloader", name: "YouTube Downloader" }],
  },

  "unit-converter": {
    guideTitle: "How to Convert Everyday Units",
    steps: [
      { num: "01", title: "Choose a Category", description: "Select length, weight, volume, temperature, or another unit group." },
      { num: "02", title: "Enter a Value", description: "Type the number and choose its original unit." },
      { num: "03", title: "Read the Conversion", description: "Select the target unit and copy the calculated result." },
    ],
    howItWorks: { title: "Reference-Based Unit Conversion", description: ["Each supported unit maps to a common base unit. The calculator converts your input to that base and then into the target unit.", "The arithmetic happens locally and your values are not saved or transmitted."] },
    faqs: [
      { question: "Which units can I convert?", answer: "The converter includes common length, weight, volume, temperature, area, and time units." },
      { question: "Does it convert temperature correctly?", answer: "Yes. Temperature conversions use offset formulas for Celsius, Fahrenheit, and Kelvin rather than simple multiplication." },
      { question: "How many decimal places are shown?", answer: "Results are formatted for readability while retaining useful precision for everyday calculations." },
      { question: "Are calculations private?", answer: "Yes. All conversions run in your browser without server requests." },
    ],
    relatedTools: [{ slug: "percentage-calculator", name: "Percentage Calculator" }, { slug: "age-calculator", name: "Age Calculator" }, { slug: "word-counter", name: "Word Counter" }],
  },

  "video-to-frames": {
    guideTitle: "How to Extract Frames from a Video",
    steps: [
      { num: "01", title: "Load a Video", description: "Choose a video file supported by your browser." },
      { num: "02", title: "Set Frame Timing", description: "Choose a timestamp or interval for the frames you want to capture." },
      { num: "03", title: "Download Frames", description: "Preview the still images and save the frames you need." },
    ],
    howItWorks: { title: "Video Seeking and Canvas Capture", description: ["The browser seeks through the local video element to the requested timestamps, draws each decoded frame to a canvas, and exports still images.", "The video stays on your device and is not uploaded to a processing server."] },
    faqs: [
      { question: "Which video formats are supported?", answer: "Support depends on your browser, with common MP4 and WebM files usually working best." },
      { question: "Can I extract a frame at an exact time?", answer: "Yes. Enter a timestamp or use the available interval controls to select the frame positions." },
      { question: "What format are frames saved in?", answer: "Extracted frames are saved as image files suitable for previews, thumbnails, or further editing." },
      { question: "Is my video uploaded?", answer: "No. Frame extraction takes place locally in your browser." },
    ],
    relatedTools: [{ slug: "audio-cutter", name: "Audio Cutter" }, { slug: "resize-image", name: "Resize Image" }, { slug: "compress-image", name: "Compress Image" }],
  },

  "watermark-remover": {
    guideTitle: "How to Retouch an Image Area",
    steps: [
      { num: "01", title: "Upload an Image", description: "Choose the photo or graphic you are authorized to edit." },
      { num: "02", title: "Paint the Area", description: "Mark the watermark or unwanted region with the brush tool." },
      { num: "03", title: "Preview and Save", description: "Review the retouched image and download the result." },
    ],
    howItWorks: { title: "Local Pixel Retouching", description: ["The editor uses the selected mask to blur, fill, or clone nearby pixels across the marked region, creating a new rendered image.", "Editing happens in browser memory. Only remove marks from images you own or have permission to modify."] },
    faqs: [
      { question: "Can this remove every watermark perfectly?", answer: "Results depend on the watermark size, contrast, and surrounding detail. Simple backgrounds are usually easier to retouch." },
      { question: "What image formats can I edit?", answer: "Common browser-supported formats such as JPG, PNG, and WebP are suitable for editing." },
      { question: "Can I remove a watermark from someone else's work?", answer: "Only edit and remove marks when you own the image or have explicit permission to do so." },
      { question: "Are my images uploaded?", answer: "No. Retouching runs locally in your browser." },
    ],
    relatedTools: [{ slug: "remove-background", name: "Remove Background" }, { slug: "crop-image", name: "Crop Image" }, { slug: "compress-image", name: "Compress Image" }],
  },

  "youtube-downloader": {
    guideTitle: "How to Save Public YouTube Media",
    steps: [
      { num: "01", title: "Copy a Public URL", description: "Copy the link to a public video you are allowed to save." },
      { num: "02", title: "Paste and Check", description: "Enter the URL and review the available media information." },
      { num: "03", title: "Choose a Format", description: "Select an available video or audio format and download it to your device." },
    ],
    howItWorks: { title: "Server-Assisted Format Retrieval", description: ["The downloader requests metadata and available streams for a public video through its retrieval endpoint, then provides the selected file for download.", "Use this only for content you own or have permission to download, and follow YouTube's terms and applicable copyright law."] },
    faqs: [
      { question: "Can I download private or restricted videos?", answer: "No. The tool is for publicly accessible videos and cannot bypass account, age, region, or permission restrictions." },
      { question: "Which output formats are available?", answer: "Available formats depend on the source video and may include MP4 video or audio-only options." },
      { question: "Can I use downloaded videos commercially?", answer: "Only when you have the necessary rights or permission. Public access does not grant reuse rights." },
      { question: "Are downloaded files stored in an account?", answer: "No. Files are delivered to your browser for download and are not kept as a personal library." },
    ],
    relatedTools: [{ slug: "instagram-post", name: "Instagram Post Downloader" }, { slug: "video-to-frames", name: "Video to Frames" }, { slug: "audio-cutter", name: "Audio Cutter" }],
  },

  "cron-generator": {
    guideTitle: "How to Build a Cron Schedule",
    steps: [
      { num: "01", title: "Choose the Frequency", description: "Select a minute, hour, day, week, or month schedule." },
      { num: "02", title: "Set Schedule Values", description: "Choose the exact time, weekday, or interval for your job." },
      { num: "03", title: "Copy the Expression", description: "Review the human-readable preview and copy the generated cron string." },
    ],
    howItWorks: { title: "Cron Field Composition", description: ["The builder combines minute, hour, day-of-month, month, and weekday fields according to standard five-field cron syntax.", "Expressions are generated locally, so your schedules and project details remain private in the browser."] },
    faqs: [
      { question: "What does a cron expression describe?", answer: "It describes when a scheduled command should run using fields for time and calendar intervals." },
      { question: "Does this support standard five-field cron?", answer: "Yes. The generated expressions use the common minute, hour, day, month, and weekday format." },
      { question: "Can I schedule every few minutes?", answer: "Yes. Use the interval controls to create expressions such as every 5, 10, or 15 minutes." },
      { question: "Are my schedules stored?", answer: "No. The expression and preview are created locally in your browser." },
    ],
    relatedTools: [{ slug: "unit-converter", name: "Unit Converter" }, { slug: "json-formatter", name: "JSON Formatter" }, { slug: "password-generator", name: "Password Generator" }],
  },
};
