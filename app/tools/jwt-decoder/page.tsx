import type { Metadata } from "next";
import JwtDecoderContent from "./jwt-decoder-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata: Metadata = {
  title: "JWT Decoder — Free & Private : Daliy.Tools",
  description:
    "Decode JWT header and payload instantly in your browser with readable claim timestamps. No server requests.",
  ...createToolMetadata("jwt-decoder"),
};

export default function JwtDecoderPage() {
  return <JwtDecoderContent />;
}
