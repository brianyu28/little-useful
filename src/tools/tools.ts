import type { ToolConfig } from "../types/ToolConfig";
import { ColorPickerConfig } from "./ColorPicker/ColorPickerConfig";
import { ScratchpadConfig } from "./Scratchpad/ScratchpadConfig";
import { TimerConfig } from "./Timer/TimerConfig";
import { TimestampConfig } from "./Timestamp/TimestampConfig";

export const tools: ToolConfig[] = [
  TimerConfig,
  ColorPickerConfig,
  ScratchpadConfig,
  TimestampConfig,
];
