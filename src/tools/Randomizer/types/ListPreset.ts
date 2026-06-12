export const LIST_PRESETS = [
  "custom",
  "capital-letters",
  "letters-numbers",
] as const;

export type ListPreset = (typeof LIST_PRESETS)[number];

export const LIST_PRESET_LABELS = {
  "capital-letters": "Capital letters",
  custom: "Custom",
  "letters-numbers": "Letters and numbers",
} as const satisfies Record<ListPreset, string>;
