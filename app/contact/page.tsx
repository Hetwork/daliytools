import type { Metadata } from "next";
import ContactContent from "./contact-content";

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch | Daliy.Tools",
  description:
    "Have a question, feedback, or tool suggestion? Contact the Daliy.Tools team. We read every message and respond as quickly as possible.",
  alternates: {
    canonical: "https://daliy.tools/contact",
  },
  openGraph: {
    title: "Contact Us | Daliy.Tools",
    description:
      "Get in touch with the Daliy.Tools team for tool requests, feedback, or bug reports.",
    url: "https://daliy.tools/contact",
    siteName: "Daliy.Tools",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
