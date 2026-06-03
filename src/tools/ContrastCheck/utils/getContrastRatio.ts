import type { RgbColor } from "../../ColorPicker/types/RgbColor";
import { getColorForHex } from "../../ColorPicker/utils/getColorForHex";

export function getContrastRatio(foreground: string, background: string) {
  const foregroundLuminance = getRelativeLuminance(getColorForHex(foreground));
  const backgroundLuminance = getRelativeLuminance(getColorForHex(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function getLinearChannelValue(channel: number) {
  const scaled = channel / 255;
  return scaled <= 0.04045
    ? scaled / 12.92
    : Math.pow((scaled + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(color: RgbColor) {
  return (
    0.2126 * getLinearChannelValue(color.red) +
    0.7152 * getLinearChannelValue(color.green) +
    0.0722 * getLinearChannelValue(color.blue)
  );
}
