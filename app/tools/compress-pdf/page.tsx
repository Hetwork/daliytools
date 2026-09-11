import CompressPdfContent from "./compress-pdf-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata = createToolMetadata("compress-pdf");

export default function CompressPdfPage() {
  return <CompressPdfContent />;
}
