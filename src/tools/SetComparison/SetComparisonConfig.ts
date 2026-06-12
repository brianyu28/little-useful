import { Columns3 } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const SetComparisonConfig = defineTool({
  title: "Set Comparison",
  description: "Compare two lists of lines and find unique or shared entries",
  icon: Columns3,
  keywords: ["set", "diff", "compare", "lines", "intersection", "unique"],
  path: "/sets",
});
