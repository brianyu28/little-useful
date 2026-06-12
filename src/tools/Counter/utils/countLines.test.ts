import { describe, expect, it } from "vitest";
import { countLines } from "./countLines";

describe("countLines", () => {
  it("sorts counted lines by frequency", () => {
    const counts = countLines("Beta\nAlpha\nbeta\nBeta\n", {
      caseSensitive: false,
      trimLines: true,
    });

    expect(counts).toEqual([
      { count: 3, displayValue: "Beta", key: "beta" },
      { count: 1, displayValue: "Alpha", key: "alpha" },
    ]);
  });

  it("can count lines with surrounding spaces separately", () => {
    const counts = countLines("Alpha\n Alpha ", {
      caseSensitive: true,
      trimLines: false,
    });

    expect(counts).toHaveLength(2);
  });
});
