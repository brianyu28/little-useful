export const RANDOMIZER_MODES = ["coin", "number", "list"] as const;

export type RandomizerMode = (typeof RANDOMIZER_MODES)[number];

export const RANDOMIZER_MODE_LABELS = {
  coin: "Coin flip",
  list: "From list",
  number: "Number",
} as const satisfies Record<RandomizerMode, string>;
