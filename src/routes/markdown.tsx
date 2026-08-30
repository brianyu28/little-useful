import { createFileRoute } from "@tanstack/react-router";
import MarkdownPreview from "../tools/MarkdownPreview/MarkdownPreview";
import { MarkdownPreviewConfig } from "../tools/MarkdownPreview/MarkdownPreviewConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/markdown")({
  component: MarkdownPreview,
  head: () => createPageHead(MarkdownPreviewConfig.title),
});
