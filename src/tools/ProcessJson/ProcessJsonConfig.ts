import { Braces } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const ProcessJSONConfig = defineTool({
  title: "Process JSON",
  description: "Run jq expressions on JSON data",
  icon: Braces,
  keywords: ["jq", "json", "query", "filter", "transform"],
  path: "/jq",
});
