export const RgbScale = {
  BYTE: "255",
  UNIT: "1",
} as const;

export type RgbScale = (typeof RgbScale)[keyof typeof RgbScale];
