import { describe, expect, it } from "vitest";
import { compareLineSets } from "./compareLineSets";

describe("compareLineSets", () => {
  it("compares normalized unique lines", () => {
    const result = compareLineSets(" Alpha \nBeta\nBeta", "alpha\nGamma", {
      caseSensitive: false,
      sortResults: true,
      trimLines: true,
    });

    expect(result.leftOnly.map(({ displayValue }) => displayValue)).toEqual([
      "Beta",
    ]);
    expect(result.rightOnly.map(({ displayValue }) => displayValue)).toEqual([
      "Gamma",
    ]);
    expect(result.both.map(({ displayValue }) => displayValue)).toEqual([
      "Alpha",
    ]);
  });

  it("can preserve surrounding spaces", () => {
    const result = compareLineSets("Alpha", " Alpha ", {
      caseSensitive: true,
      sortResults: true,
      trimLines: false,
    });

    expect(result.leftOnly).toHaveLength(1);
    expect(result.rightOnly).toHaveLength(1);
    expect(result.both).toHaveLength(0);
  });
});
