import CompressImageContent from "./compress-image-content";
import { createToolMetadata } from "../../_lib/tool-metadata";

export const metadata = createToolMetadata("compress-image");

export default function CompressImagePage() {
  return <CompressImageContent />;
}
