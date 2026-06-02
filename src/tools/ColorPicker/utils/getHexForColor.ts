import type { RgbColor } from "../types/RgbColor";

export function getHexForColor({ red, green, blue }: RgbColor): string {
  return `#${[red, green, blue]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}
