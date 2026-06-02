import { Pipette } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const ColorPickerConfig = defineTool({
  title: "Color Picker",
  description: "Pick a color and view its Hex and RGB values",
  icon: Pipette,
  keywords: ["color converter", "palette"],
  path: "/color",
});
