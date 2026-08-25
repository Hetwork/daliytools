import type { Metadata } from "next";
import JwtDecoderContent from "./jwt-decoder-content";

export const metadata: Metadata = {
  title: "JWT Decoder — Free & Private : Daliy.Tools",
  description:
    "Decode JWT header and payload instantly in your browser with readable claim timestamps. No server requests.",
};

export default function JwtDecoderPage() {
  return <JwtDecoderContent />;
}
