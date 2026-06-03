import { describe, expect, it } from "vitest";
import { formatContrastRatio } from "./formatContrastRatio";
import { getContrastRatio } from "./getContrastRatio";

describe("contrast", () => {
  it("returns 21:1 for black and white", () => {
    expect(formatContrastRatio(getContrastRatio("#000000", "#ffffff"))).toBe(
      "21.00:1",
    );
  });

  it("returns 1:1 for identical colors", () => {
    expect(formatContrastRatio(getContrastRatio("#4f46e5", "#4f46e5"))).toBe(
      "1.00:1",
    );
  });

  it("returns the same ratio regardless of color order", () => {
    expect(getContrastRatio("#ffffff", "#172033")).toBeCloseTo(
      getContrastRatio("#172033", "#ffffff"),
    );
  });
});
