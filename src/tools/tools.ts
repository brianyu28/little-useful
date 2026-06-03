import type { ToolConfig } from "../types/ToolConfig";
import { ColorPickerConfig } from "./ColorPicker/ColorPickerConfig";
import { ContrastCheckConfig } from "./ContrastCheck/ContrastCheckConfig";
import { EventCountdownConfig } from "./EventCountdown/EventCountdownConfig";
import { QRCodeConfig } from "./QRCode/QRCodeConfig";
import { RegexTestConfig } from "./RegexTest/RegexTestConfig";
import { ScratchpadConfig } from "./Scratchpad/ScratchpadConfig";
import { TimerConfig } from "./Timer/TimerConfig";
import { TimestampConfig } from "./Timestamp/TimestampConfig";

export const tools: ToolConfig[] = [
  TimerConfig,
  EventCountdownConfig,
  ColorPickerConfig,
  QRCodeConfig,
  ScratchpadConfig,
  TimestampConfig,
  ContrastCheckConfig,
  RegexTestConfig,
];
