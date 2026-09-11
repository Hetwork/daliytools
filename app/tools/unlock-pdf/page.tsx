import type { Metadata } from "next";
import UnlockPdfContent from "./unlock-pdf-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "Unlock PDF Online — Remove Password Protection Privately | Daliy.Tools",
  description:
    "Remove password protection from a PDF when you know the password. Create an unlocked PDF in your browser without uploading your file.",
  keywords: [
    "unlock pdf",
    "remove pdf password",
    "decrypt pdf online",
    "password remover pdf",
    "private pdf unlocker",
  ],
  alternates: { canonical: "https://daliy.tools/tools/unlock-pdf" },
  openGraph: {
    title: "Unlock PDF Online — Free & Private | Daliy.Tools",
    description:
      "Create an unlocked copy of a password-protected PDF in your browser. No uploads and no password bypassing.",
    url: "https://daliy.tools/tools/unlock-pdf",
    siteName: "Daliy.Tools",
    type: "website",
  },
  ...createToolMetadata("unlock-pdf"),
};

export default function UnlockPdfPage() {
  return <UnlockPdfContent />;
}
