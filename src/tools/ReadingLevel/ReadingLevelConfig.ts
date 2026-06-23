import { BookOpenText } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const ReadingLevelConfig = defineTool({
  title: "Reading Level",
  description: "Estimate readability scores for a passage of text",
  icon: BookOpenText,
  keywords: [
    "readability",
    "writing",
    "grade",
    "flesch",
    "kincaid",
    "ari",
    "level",
    "coleman",
    "liau",
  ],
  path: "/readability",
});
