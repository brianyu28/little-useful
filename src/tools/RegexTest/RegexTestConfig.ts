import { Regex } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const RegexTestConfig = defineTool({
  title: "Regex Test",
  description: "Test regular expressions against lines of text",
  icon: Regex,
  keywords: ["regular expression", "regexp", "pattern", "match", "text"],
  path: "/regex",
});
