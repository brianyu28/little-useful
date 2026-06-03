import { afterEach, describe, expect, it, vi } from "vitest";
import { getTimeZones, getUniqueTimeZones } from "./getTimeZones";

describe("getUniqueTimeZones", () => {
  it("keeps the first instance of each time zone", () => {
    expect(getUniqueTimeZones(["UTC", "America/New_York", "UTC"])).toEqual([
      "UTC",
      "America/New_York",
    ]);
  });
});

describe("getTimeZones", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not duplicate UTC when the browser already reports it", () => {
    vi.spyOn(Intl, "supportedValuesOf").mockReturnValue([
      "UTC",
      "America/New_York",
    ]);

    expect(getTimeZones()).toEqual(["UTC", "America/New_York"]);
  });

  it("falls back to UTC when supported time zones are unavailable", () => {
    vi.spyOn(Intl, "supportedValuesOf").mockImplementation(() => {
      throw new Error("unsupported");
    });

    expect(getTimeZones()).toEqual(["UTC"]);
  });
});
