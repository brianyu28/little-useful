import { CaseSensitive } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const TitleCapitalizerConfig = defineTool({
  title: "Capitalize Title",
  description: "Format a title with appropriate capitalization",
  icon: CaseSensitive,
  keywords: [
    "title case",
    "capitalize",
    "headlines",
    "chicago",
    "ap",
    "mla",
    "apa",
  ],
  path: "/capitalize",
});
