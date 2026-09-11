import type { Metadata } from "next";
import QrCodeGeneratorContent from "./qr-code-generator-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Free QR Code Generator — Create Custom QR Codes | Daliy.Tools",
  description:
    "Generate custom, high-resolution QR codes for URLs, Wi-Fi networks, text, contacts, and emails for free. 100% private, instant download with zero tracking.",
  keywords: [
    "qr code generator",
    "create qr code online",
    "free qr maker",
    "wifi qr code generator",
    "custom qr code generator",
    "daily tools qr code",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/qr-code-generator",
  },
  openGraph: {
    title: "Free QR Code Generator — Instant & Private | Daliy.Tools",
    description:
      "Generate custom QR codes instantly for links, Wi-Fi, and text. No sign-up, no expired links, completely free.",
    url: "https://daliy.tools/tools/qr-code-generator",
    siteName: "Daliy.Tools",
    type: "website",
  },
  ...createToolMetadata("qr-code-generator"),
};

export default function QrCodeGeneratorPage() {
  return <QrCodeGeneratorContent />;
}
