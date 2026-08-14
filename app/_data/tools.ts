export type Tool = {
  slug: string;
  name: string;
  category: string;
  description: string;
  live?: boolean;
};

export const categories = [
  "PDF Tools",
  "Image Tools",
  "Text Tools",
  "Generators",
  "Calculators & Converters",
  "Developer Tools",
  "Social Media",
] as const;

export const tools: Tool[] = [
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    category: "PDF Tools",
    description: "Shrink file size without losing quality.",
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
