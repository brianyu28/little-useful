import { createFileRoute } from "@tanstack/react-router";
import ColorPicker from "../tools/ColorPicker/ColorPicker";
import { ColorPickerConfig } from "../tools/ColorPicker/ColorPickerConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/color")({
  component: ColorPicker,
  head: () => createPageHead(ColorPickerConfig.title),
});
