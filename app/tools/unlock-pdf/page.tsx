import type { Metadata } from "next";
import UnlockPdfContent from "./unlock-pdf-content";

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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Unlock PDF - Daliy.Tools",
  url: "https://daliy.tools/tools/unlock-pdf",
  description:
    "A browser-based PDF password removal tool for documents the user is authorized to access.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function UnlockPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UnlockPdfContent />
    </>
  );
}
