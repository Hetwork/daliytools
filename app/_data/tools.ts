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
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "PDF Tools",
    description: "Combine multiple PDFs into one file.",
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "PDF Tools",
    description: "Pull specific pages out of a PDF.",
  },
  {
    slug: "resize-image",
    name: "Resize Image",
    category: "Image Tools",
    description: "Resize photos to the exact dimensions you need.",
  },
  {
    slug: "remove-background",
    name: "Remove Background",
    category: "Image Tools",
    description: "Cut backgrounds out of images automatically.",
  },
  {
    slug: "convert-image-format",
    name: "Convert Image Format",
    category: "Image Tools",
    description: "Switch between JPG, PNG, WebP, and more.",
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    category: "Text Tools",
    description: "Count words, characters, and reading time instantly.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Text Tools",
    description: "Flip text between UPPER, lower, and Title Case.",
  },
  {
    slug: "compare-files",
    name: "Compare Two Files",
    category: "Text Tools",
    description: "Spot the differences between two documents.",
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    category: "Generators",
    description: "Turn any link or text into a scannable QR code.",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Generators",
    description: "Create strong, random passwords in one click.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "Generators",
    description: "Generate placeholder text for mockups.",
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "Calculators & Converters",
    description: "Work out percentages without the mental math.",
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    category: "Calculators & Converters",
    description: "Convert length, weight, and volume in seconds.",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "Calculators & Converters",
    description: "Find the exact age between two dates.",
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
