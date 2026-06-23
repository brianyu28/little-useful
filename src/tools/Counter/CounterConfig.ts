import { ListOrdered } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const CounterConfig = defineTool({
  title: "Counter",
  description: "Count items in a list by frequency",
  icon: ListOrdered,
  keywords: ["count", "frequency", "duplicates", "lines", "tally"],
  path: "/counter",
});
