import type { ToolConfig } from "../types/ToolConfig";
import { BmiCalculatorConfig } from "./BmiCalculator/BmiCalculatorConfig";
import { ColorPickerConfig } from "./ColorPicker/ColorPickerConfig";
import { ContrastCheckConfig } from "./ContrastCheck/ContrastCheckConfig";
import { CounterConfig } from "./Counter/CounterConfig";
import { EventCountdownConfig } from "./EventCountdown/EventCountdownConfig";
import { MarkdownPreviewConfig } from "./MarkdownPreview/MarkdownPreviewConfig";
import { MoonPhaseCalculatorConfig } from "./MoonPhaseCalculator/MoonPhaseCalculatorConfig";
import { ProcessJSONConfig } from "./ProcessJson/ProcessJsonConfig";
import { QRCodeConfig } from "./QRCode/QRCodeConfig";
import { RandomizerConfig } from "./Randomizer/RandomizerConfig";
import { ReadingLevelConfig } from "./ReadingLevel/ReadingLevelConfig";
import { RegexTestConfig } from "./RegexTest/RegexTestConfig";
import { ScratchpadConfig } from "./Scratchpad/ScratchpadConfig";
import { SetComparisonConfig } from "./SetComparison/SetComparisonConfig";
import { TimerConfig } from "./Timer/TimerConfig";
import { TimestampConfig } from "./Timestamp/TimestampConfig";
import { TitleCapitalizerConfig } from "./TitleCapitalizer/TitleCapitalizerConfig";

export const tools: ToolConfig[] = [
  QRCodeConfig,
  ColorPickerConfig,
  ReadingLevelConfig,
  TimestampConfig,
  ScratchpadConfig,
  MarkdownPreviewConfig,
  TitleCapitalizerConfig,
  EventCountdownConfig,
  TimerConfig,
  ProcessJSONConfig,
  ContrastCheckConfig,
  RegexTestConfig,
  SetComparisonConfig,
  CounterConfig,
  RandomizerConfig,
  BmiCalculatorConfig,
  MoonPhaseCalculatorConfig,
];
