import { Contrast } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const ContrastCheckConfig = defineTool({
  title: "Contrast Check",
  description: "Check colors against WCAG contrast criteria",
  icon: Contrast,
  keywords: ["accessibility", "wcag", "color contrast", "a11y"],
  path: "/contrast",
});
