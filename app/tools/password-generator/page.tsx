import type { Metadata } from "next";
import PasswordGeneratorContent from "./password-generator-content";

export const metadata: Metadata = {
  title: "Password Generator — Free & Private : Daliy.Tools",
  description: "Create strong, random passwords in one click. Runs entirely in your browser — nothing is uploaded.",
};

export default function PasswordGeneratorPage() {
  return <PasswordGeneratorContent />;
}
