import type { RgbColor } from "../types/RgbColor";

export function getColorForHex(hex: string): RgbColor {
  return {
    red: parseInt(hex.slice(1, 3), 16),
    green: parseInt(hex.slice(3, 5), 16),
    blue: parseInt(hex.slice(5, 7), 16),
  };
}
