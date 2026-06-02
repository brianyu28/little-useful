import { NotebookPen } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const ScratchpadConfig = defineTool({
  title: "Scratchpad",
  description: "Write a quick note to yourself",
  icon: NotebookPen,
  keywords: ["notes", "notepad", "text", "write"],
  path: "/scratchpad",
});
