export type ToolSeo = {
  title: string;
  description: string;
  keywords: string[];
  openGraphTitle?: string;
  openGraphDescription?: string;
};

export type Tool = {
  slug: string;
  name: string;
  category: string;
  description: string;
  seo?: ToolSeo;
  live?: boolean;
};

export const categories = [
  "PDF Tools",
  "Image Tools",
  "Media Tools",
  "Text Tools",
  "Generators",
  "Calculators & Converters",
  "Developer Tools",
  "Social Media",
] as const;

const baseTools: Tool[] = [
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    category: "PDF Tools",
    description: "Shrink file size without losing quality.",
    live: true,
  },
  {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    category: "PDF Tools",
    description: "Remove a PDF password when you know it.",
    live: true,
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    category: "PDF Tools",
    description: "Combine one or more images into a single PDF.",
    live: true,
  },
  {
    slug: "pdf-to-image",
    name: "PDF to Image",
    category: "PDF Tools",
    description: "Export PDF pages as PNG, JPG, or WebP images.",
    live: true,
  },
  {
    slug: "number-pdf",
    name: "Number & Stamp PDF",
    category: "PDF Tools",
    description: "Add page numbers, headers, footers, and custom stamps.",
    live: true,
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "PDF Tools",
    description: "Combine multiple PDFs into one file.",
    live: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "PDF Tools",
    description: "Pull specific pages out of a PDF.",
    live: true,
  },
  {
    slug: "resize-image",
    name: "Resize Image",
    category: "Image Tools",
    description: "Resize photos to the exact dimensions you need.",
    live: true,
  },
  {
    slug: "remove-background",
    name: "Remove Background",
    category: "Image Tools",
    description: "Cut backgrounds out of images automatically.",
    live: true,
  },
  {
    slug: "convert-image-format",
    name: "Convert Image Format",
    category: "Image Tools",
    description: "Switch between JPG, PNG, WebP, and more.",
    live: true,
  },
  {
    slug: "compress-image",
    name: "Compress Image",
    category: "Image Tools",
    description: "Reduce image file size while keeping it sharp.",
    seo: {
      title: "Compress Image Online — Free Image Optimizer & Reducer",
      description:
      "Reduce JPG, PNG, and WebP image file sizes online for free without losing quality. 100% private in-browser compression with zero uploads.",
      keywords: [
        "compress image",
        "image compressor online",
        "reduce photo size",
        "shrink jpg",
        "png compressor",
        "daily tools compress image",
      ],
      openGraphTitle: "Compress Image Online — Free & Private | Daliy.Tools",
      openGraphDescription:
        "Compress and optimize images directly in your browser. Save up to 80% file size without losing sharpness.",
    },
    live: true,
  },
  {
    slug: "crop-image",
    name: "Crop Image",
    category: "Image Tools",
    description: "Trim your photo to a custom area or a preset ratio.",
    live: true,
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Image Tools",
    description: "Extract colors from any image — get HEX, RGB, and HSL instantly.",
    live: true,
  },
  {
    slug: "watermark-remover",
    name: "Watermark Remover",
    category: "Image Tools",
    description: "Paint over a region to blur, fill, or clone it out.",
    live: true,
  },
  {
    slug: "video-to-frames",
    name: "Video to Frames",
    category: "Image Tools",
    description: "Extract individual frames from a video at any interval.",
    live: true,
  },
  {
    slug: "audio-cutter",
    name: "Audio Cutter",
    category: "Media Tools",
    description: "Trim and export the exact audio segment you need.",
    live: true,
  },
  {
    slug: "video-to-audio",
    name: "Video to Audio",
    category: "Media Tools",
    description: "Extract high-quality MP3 or lossless WAV audio from any video.",
    live: true,
  },
  {
    slug: "screen-recorder",
    name: "Screen Recorder",
    category: "Media Tools",
    description: "Record your screen or tab with optional microphone audio.",
    live: true,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    category: "Text Tools",
    description: "Count words, characters, and reading time instantly.",
    live: true,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Text Tools",
    description: "Flip text between UPPER, lower, and Title Case.",
    live: true,
  },
  {
    slug: "compare-files",
    name: "Compare Two Files",
    category: "Text Tools",
    description: "Spot the differences between two documents.",
    live: true,
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    category: "Generators",
    description: "Turn any link or text into a scannable QR code.",
    live: true,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    description: "Create strong, random passwords in one click.",
    live: true,
  },
  {
    slug: "icon-kitchen",
    name: "Icon Kitchen",
    category: "Generators",
    description: "Generate Android, iOS, and Web app icons & favicons in every size and format.",
    live: true,
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    description: "Generate placeholder text for mockups.",
    live: true,
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "Calculators & Converters",
    description: "Work out percentages without the mental math.",
    live: true,
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    category: "Calculators & Converters",
    description: "Convert length, weight, and volume in seconds.",
    live: true,
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "Calculators & Converters",
    description: "Find the exact age between two dates.",
    live: true,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Developer Tools",
    description: "Beautify or minify messy JSON in one click.",
    live: true,
  },
  {
    slug: "html-viewer",
    name: "HTML Viewer",
    category: "Developer Tools",
    description: "Paste HTML and see it rendered live in a preview pane.",
    live: true,
  },
  {
    slug: "markdown-viewer",
    name: "Markdown Viewer",
    category: "Developer Tools",
    description: "Edit and preview Markdown side by side in real time.",
    live: true,
  },
  {
    slug: "jwt-decoder",
    name: "JWT Token Decoder",
    category: "Developer Tools",
    description: "Inspect JWT headers, payloads, and claim timestamps locally.",
    live: true,
  },
  {
    slug: "cron-generator",
    name: "Cron Expression Builder",
    category: "Developer Tools",
    description: "Build cron expressions with human-readable schedule previews.",
    live: true,
  },
  {
    slug: "base64-converter",
    name: "Base64 / URL / HTML Converter",
    category: "Developer Tools",
    description: "Encode and decode Base64, URL strings, and HTML entities.",
    live: true,
  },
  {
    slug: "contrast-checker",
    name: "WCAG Contrast Checker",
    category: "Developer Tools",
    description: "Validate text and background colors against WCAG AA/AAA.",
    live: true,
  },
  {
    slug: "instagram-post",
    name: "Instagram Post Downloader",
    category: "Social Media",
    description: "Download Instagram posts and carousels at full quality.",
    live: true,
  },
  {
    slug: "youtube-downloader",
    name: "YouTube Video Downloader",
    category: "Social Media",
    description: "Download any public YouTube video in MP4 or audio-only format.",
    live: true,
  },
];

const createSeo = (
  title: string,
  description: string,
  keywords: string[],
  openGraphDescription = description
): ToolSeo => ({
  title,
  description,
  keywords,
  openGraphTitle: `${title} | Daliy.Tools`,
  openGraphDescription,
});

const seoBySlug: Record<string, ToolSeo> = {
  "compress-pdf": createSeo(
    "Compress PDF Online — Free, Fast & 100% Private",
    "Compress and shrink PDF file size online for free without losing quality. 100% private in-browser processing — no file uploads, no limits, no watermarks.",
    ["compress pdf", "reduce pdf size online", "free pdf compressor", "shrink pdf file size", "private pdf compressor", "daily tools pdf"]
  ),
  "unlock-pdf": createSeo(
    "Unlock PDF Online — Remove Password Protection Privately",
    "Remove password protection from a PDF when you know the password. Create an unlocked PDF in your browser without uploading your file.",
    ["unlock pdf", "remove pdf password", "decrypt pdf online", "password remover pdf", "private pdf unlocker"],
    "Create an unlocked copy of a password-protected PDF in your browser. No uploads and no password bypassing."
  ),
  "image-to-pdf": createSeo(
    "Image to PDF Converter Online — Free & 100% Private",
    "Convert JPG, PNG, and WebP images to PDF online for free. Reorder pages, adjust margins, and download your clean PDF without server uploads.",
    ["image to pdf", "jpg to pdf", "png to pdf", "convert photos to pdf", "free image to pdf converter", "combine pictures into pdf"],
    "Combine photos and images into a single PDF document in your browser. Fast, free, and completely private."
  ),
  "pdf-to-image": createSeo(
    "PDF to Image Converter Online — Free & Private",
    "Convert PDF pages to PNG, JPG, or WebP images in your browser. Select pages, download individual images, or export everything as a ZIP.",
    ["pdf to image", "pdf to jpg", "pdf to png", "convert pdf pages", "pdf page image converter"],
    "Convert PDF pages to images locally in your browser."
  ),
  "number-pdf": createSeo(
    "Number & Stamp PDF Online — Free & Private",
    "Add page numbers, headers, footers, and custom text stamps to PDF files in your browser. No uploads, accounts, or watermarks.",
    ["number pdf", "add page numbers to pdf", "stamp pdf", "pdf header footer", "pdf page numberer"],
    "Add page numbers and custom stamps to PDF files locally in your browser."
  ),
  "merge-pdf": createSeo(
    "Merge PDF Files Online — Free, Fast & Private",
    "Combine multiple PDF documents into one single file online for free. Arrange page order with zero file uploads and in-browser privacy.",
    ["merge pdf", "combine pdf files", "join pdfs online", "free pdf merger", "merge multiple pdf documents", "daily tools merge pdf"],
    "Join multiple PDF files into one clean document directly in your browser. Fast, free, and private."
  ),
  "split-pdf": createSeo(
    "Split PDF Online — Free, Fast & Private",
    "Extract pages, separate single pages, or split PDF documents into separate files online for free. Private in-browser tool with zero server uploads.",
    ["split pdf", "extract pdf pages", "separate pdf pages online", "free pdf splitter", "cut pdf pages", "daily tools split pdf"],
    "Separate and extract pages from any PDF document safely in your browser."
  ),
  "resize-image": createSeo(
    "Resize Image Online — Free Image Resizer & Scaler",
    "Resize images to exact pixel dimensions, aspect ratios, or percentages for free. Fast browser-based image resizer with no file uploads.",
    ["resize image", "image resizer online", "scale photo size", "change image dimensions", "free image resizer", "bulk resize images"],
    "Resize JPG, PNG, and WebP images to exact pixels or aspect ratios without losing clarity."
  ),
  "remove-background": createSeo(
    "Remove Background — Free & Private",
    "Remove image backgrounds instantly using AI. Processing runs in your browser with no image uploads or sign-up required.",
    ["remove background", "background remover", "remove image background", "transparent background maker", "free background remover"]
  ),
  "convert-image-format": createSeo(
    "Convert Image Format — Free & Private",
    "Convert images between JPEG, PNG, WebP, and AVIF formats directly in your browser without uploading files.",
    ["convert image format", "jpg to png", "png to jpg", "webp converter", "avif converter", "image format converter"]
  ),
  "compress-image": createSeo(
    "Compress Image Online — Free Image Optimizer & Reducer",
    "Reduce JPG, PNG, and WebP image file sizes online for free without losing quality. 100% private in-browser compression with zero uploads.",
    ["compress image", "image compressor online", "reduce photo size", "shrink jpg", "png compressor", "daily tools compress image"],
    "Compress and optimize images directly in your browser. Save up to 80% file size without losing sharpness."
  ),
  "crop-image": createSeo(
    "Crop Image — Free & Private",
    "Trim your photo to a custom area or preset aspect ratio with an easy drag-to-crop image editor in your browser.",
    ["crop image", "crop photo online", "image cropper", "photo crop tool", "free image cropper"]
  ),
  "color-picker": createSeo(
    "Color Picker — Free & Private",
    "Extract colors from any image and get HEX, RGB, and HSL values instantly. Images stay in your browser.",
    ["color picker", "image color picker", "pick color from image", "hex color picker", "rgb color picker"]
  ),
  "watermark-remover": createSeo(
    "Watermark Remover — Free & Private",
    "Select an area of your image and blur, fill, or clone it out with a browser-based watermark editing tool.",
    ["watermark remover", "remove watermark from image", "image watermark eraser", "free watermark remover"]
  ),
  "video-to-frames": createSeo(
    "Video to Frames — Free & Private",
    "Extract individual frames from a video at any interval and download them as images or a ZIP archive.",
    ["video to frames", "extract video frames", "video frame extractor", "save video frames", "video screenshots"]
  ),
  "audio-cutter": createSeo(
    "Audio Cutter — Free & Private",
    "Trim audio files with start and end selection, live playback, and WAV export directly in your browser.",
    ["audio cutter", "cut audio online", "trim audio", "audio trimmer", "free audio cutter"]
  ),
  "video-to-audio": createSeo(
    "Video to Audio Converter — Extract MP3 & WAV",
    "Extract audio from video files online for free. Convert MP4, WebM, and MOV to MP3 or lossless WAV in your browser.",
    ["video to audio", "extract audio from video", "video to mp3", "convert video to audio", "mp4 to mp3 online", "video to wav converter"],
    "Extract audio from your videos securely in your browser. Convert common video files to MP3 and WAV."
  ),
  "screen-recorder": createSeo(
    "Screen Recorder — Free & Private",
    "Record your screen, window, or browser tab with optional microphone audio and download the recording without uploads.",
    ["screen recorder", "screen recording online", "record browser tab", "free screen recorder", "screen capture tool"]
  ),
  "word-counter": createSeo(
    "Word Counter Online — Free Character & Reading Time Counter",
    "Count words, characters, sentences, paragraphs, and reading time in real time with private browser-based text analysis.",
    ["word counter", "character counter", "count words online", "free word counter tool", "reading time calculator", "daily tools word counter"],
    "Instant word, character, sentence, and reading-time counter."
  ),
  "case-converter": createSeo(
    "Case Converter — Free & Private",
    "Convert text between UPPER, lower, Title Case, camelCase, snake_case, and more directly in your browser.",
    ["case converter", "uppercase lowercase converter", "title case converter", "camel case converter", "text case changer"]
  ),
  "compare-files": createSeo(
    "Compare Two Files — Free & Private",
    "Spot differences between two documents with line-by-line diff highlighting directly in your browser.",
    ["compare files", "file diff tool", "compare text files", "document comparison", "online diff checker"]
  ),
  "qr-code-generator": createSeo(
    "Free QR Code Generator — Create Custom QR Codes",
    "Generate custom QR codes for URLs, Wi-Fi networks, text, contacts, and emails for free with instant download.",
    ["qr code generator", "create qr code online", "free qr maker", "wifi qr code generator", "custom qr code generator", "daily tools qr code"],
    "Generate custom QR codes instantly for links, Wi-Fi, and text. No sign-up or expired links."
  ),
  "password-generator": createSeo(
    "Password Generator — Free & Private",
    "Create strong, random passwords in one click. Password generation runs in your browser and nothing is uploaded.",
    ["password generator", "strong password generator", "random password maker", "secure password generator", "free password tool"]
  ),
  "icon-kitchen": createSeo(
    "Icon Kitchen — App Icon & Favicon Generator",
    "Generate Android adaptive icons, iOS AppIcon sets, and web favicons in all required sizes and formats.",
    ["app icon generator", "favicon generator", "android icon generator", "ios app icon generator", "web icon maker"]
  ),
  "lorem-ipsum-generator": createSeo(
    "Lorem Ipsum Generator — Free & Private",
    "Generate placeholder text for mockups, prototypes, and design layouts with a simple browser-based generator.",
    ["lorem ipsum generator", "placeholder text generator", "dummy text generator", "design filler text"]
  ),
  "percentage-calculator": createSeo(
    "Percentage Calculator Online — Free Percentage Increase & Discount Math",
    "Calculate percentage increase, discount savings, percentage difference, and fraction ratios with instant results.",
    ["percentage calculator", "calculate percentage online", "percentage increase calculator", "discount calculator", "percent difference calculator", "daily tools percentage calculator"],
    "Calculate percentage discounts, increases, and ratios instantly with zero mental math."
  ),
  "unit-converter": createSeo(
    "Unit Converter — Free & Private",
    "Convert length, weight, volume, temperature, and more in seconds with a fast everyday unit conversion tool.",
    ["unit converter", "measurement converter", "length converter", "weight converter", "temperature converter"]
  ),
  "age-calculator": createSeo(
    "Age Calculator — Free & Private",
    "Find the exact age between two dates in years, months, and days with a simple date calculator.",
    ["age calculator", "calculate age online", "date of birth calculator", "exact age calculator", "birthday calculator"]
  ),
  "json-formatter": createSeo(
    "JSON Formatter & Validator Online — Free & Private",
    "Beautify, format, validate, and minify JSON data online for free. Fix syntax errors with private in-browser parsing.",
    ["json formatter", "json validator", "beautify json online", "json minifier", "format json code", "daily tools json formatter"],
    "Clean, format, and validate messy JSON data with zero data transmission."
  ),
  "html-viewer": createSeo(
    "HTML Viewer — Free & Live Preview",
    "Paste HTML and see it rendered live in a preview pane. No uploads and browser-based previewing.",
    ["html viewer", "html preview", "render html online", "html tester", "live html editor"]
  ),
  "markdown-viewer": createSeo(
    "Markdown Viewer — Free & Live Preview",
    "Edit and preview Markdown side by side in real time with support for GFM tables, code blocks, and more.",
    ["markdown viewer", "markdown preview", "markdown editor online", "github markdown preview", "gfm viewer"]
  ),
  "jwt-decoder": createSeo(
    "JWT Decoder — Free & Private",
    "Decode JWT headers and payloads instantly with readable claim timestamps. No server requests are required.",
    ["jwt decoder", "decode jwt online", "jwt token viewer", "jwt debugger", "json web token decoder"]
  ),
  "cron-generator": createSeo(
    "Cron Generator — Free & Private",
    "Build cron expressions with a visual editor, human-friendly explanations, and previews of upcoming run times.",
    ["cron generator", "cron expression builder", "cron schedule generator", "crontab generator", "cron syntax helper"]
  ),
  "base64-converter": createSeo(
    "Base64 / URL / HTML Converter — Free & Private",
    "Encode and decode Base64, URL-encoded strings, and HTML entities entirely in your browser.",
    ["base64 converter", "base64 encoder decoder", "url encoder decoder", "html entity encoder", "developer text converter"]
  ),
  "contrast-checker": createSeo(
    "WCAG Contrast Checker — Free & Private",
    "Check text and background color pairs against WCAG AA and AAA requirements with live previews.",
    ["wcag contrast checker", "color contrast checker", "accessibility checker", "wcag aa checker", "wcag aaa checker"]
  ),
  "instagram-post": createSeo(
    "Instagram Post Downloader",
    "Download public Instagram posts and carousels at full quality by pasting a supported post URL. Server processing is required.",
    ["instagram post downloader", "download instagram carousel", "instagram media downloader", "save instagram post"],
    "Download public Instagram posts and carousels from a supported URL."
  ),
  "youtube-downloader": createSeo(
    "YouTube Video Downloader",
    "Download public YouTube videos as MP4 or audio-only M4A when permitted. Server processing is required and no sign-up is needed.",
    ["youtube downloader", "download youtube video", "youtube to mp4", "youtube audio downloader", "youtube m4a downloader"],
    "Download public YouTube videos in supported formats when permitted."
  ),
};

export const tools: Tool[] = baseTools.map((tool) => ({
  ...tool,
  seo: seoBySlug[tool.slug],
}));

export const featuredSlugs = [
  "compress-pdf",
  "remove-background",
  "word-counter",
  "qr-code-generator",
  "percentage-calculator",
  "convert-image-format",
];

export function monogram(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
