import type { CSSProperties } from "react";

const paths: Record<string, string> = {
  arrow: "M7 17 17 7M7 7h10v10",
  right: "M4 12h16m-6-6 6 6-6 6",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  moon: "M20.5 13A9 9 0 0 1 11 3.5 9 9 0 1 0 20.5 13Z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  pdf: "M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 13h8m-8 4h5",
  image: "M3 3h18v18H3zM3 16l6-6 12 11M16 6v3m-1.5-1.5h3",
  media: "M4 3h16v18H4zM4 7h16M4 17h16m-10-7 5 2-5 2v-4Z",
  text: "M4 4h16M12 4v16m-5 0h10M4 4v4m16-4v4",
  spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z",
  calculator: "M5 2h14v20H5zM8 6h8m-8 5h1m6 0h1m-8 4h1m6 0h1m-8 4h1m6 0h1",
  code: "m8 5-6 7 6 7m8-14 6 7-6 7M14 3l-4 18",
  social: "M17 5a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM1 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm16 7a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM7 11l10-5M7 13l10 5",
  shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Zm-4 10 3 3 5-6",
  bolt: "m13 2-9 12h7l-1 8L21 9h-8l1-7Z",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  menu: "M4 6h16M4 12h16M4 18h16",
};
export const categoryIcons: Record<string, string> = {
  "PDF Tools": "pdf", "Image Tools": "image", "Media Tools": "media",
  "Text Tools": "text", "Generators": "spark", "Calculators & Converters": "calculator",
  "Developer Tools": "code", "Social Media": "social",
};
export default function Icon({ name, size = 20, style, className }: {
  name: string; size?: number; style?: CSSProperties; className?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style} className={className}><path d={paths[name] || paths.spark} /></svg>;
}
