import { FileText } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const MarkdownPreviewConfig = defineTool({
  title: "Markdown Preview",
  description: "Write Markdown and preview the rendered result",
  icon: FileText,
  keywords: ["markdown", "md", "render", "preview", "text"],
  path: "/markdown",
});
