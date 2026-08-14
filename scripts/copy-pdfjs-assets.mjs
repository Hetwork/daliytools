// pdf.js needs its standard font metrics and CJK cmaps served as static
// files at runtime (not bundled) to render non-embedded fonts accurately.
// This copies them from node_modules into public/ so Next.js serves them
// at a stable URL. Runs on postinstall so it stays in sync across installs.
import { cpSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const targets = [
  { from: join(root, "node_modules/pdfjs-dist/standard_fonts"), to: join(root, "public/pdfjs/standard_fonts") },
  { from: join(root, "node_modules/pdfjs-dist/cmaps"), to: join(root, "public/pdfjs/cmaps") },
];

for (const { from, to } of targets) {
  if (!existsSync(from)) {
    console.warn(`[copy-pdfjs-assets] skipping, not found: ${from}`);
    continue;
  }
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
  console.log(`[copy-pdfjs-assets] copied ${from} -> ${to}`);
}
