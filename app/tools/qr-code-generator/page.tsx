import type { Metadata } from "next";
import QrCodeGeneratorContent from "./qr-code-generator-content";

export const metadata: Metadata = {
  title: "QR Code Generator — Free & Private : Daliy.Tools",
  description: "Turn any link or text into a scannable QR code. Runs entirely in your browser — nothing is uploaded.",
};

export default function QrCodeGeneratorPage() {
  return <QrCodeGeneratorContent />;
}
