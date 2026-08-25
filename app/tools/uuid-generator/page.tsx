import type { Metadata } from "next";
import UuidGeneratorContent from "./uuid-generator-content";

export const metadata: Metadata = {
  title: "UUID & Hash Generator — Free & Private : Daliy.Tools",
  description:
    "Generate UUIDs and Nano IDs, plus SHA-256, SHA-512, and MD5 hashes for text or files in your browser.",
};

export default function UuidGeneratorPage() {
  return <UuidGeneratorContent />;
}
