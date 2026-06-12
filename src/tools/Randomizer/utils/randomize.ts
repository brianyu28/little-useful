import type { ListPreset } from "../types/ListPreset";
import type { RandomizerMode } from "../types/RandomizerMode";

const CAPITAL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LETTERS_AND_NUMBERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");

export interface RandomizerOptions {
  readonly count: number;
  readonly listInput: string;
  readonly listPreset: ListPreset;
  readonly max: number;
  readonly min: number;
  readonly mode: RandomizerMode;
}

export function randomize(options: RandomizerOptions): string[] {
  const count = Math.max(1, Math.floor(options.count));

  return Array.from({ length: count }, () => randomizeOne(options));
}

export function getListItems(preset: ListPreset, input: string): string[] {
  if (preset === "capital-letters") return CAPITAL_LETTERS;
  if (preset === "letters-numbers") return LETTERS_AND_NUMBERS;

  return input
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function randomizeOne(options: RandomizerOptions) {
  if (options.mode === "coin") {
    return randomInteger(0, 1) === 0 ? "Heads" : "Tails";
  }

  if (options.mode === "number") {
    const min = Math.min(options.min, options.max);
    const max = Math.max(options.min, options.max);

    return String(randomInteger(min, max));
  }

  const items = getListItems(options.listPreset, options.listInput);
  if (items.length === 0) return "";

  return items[randomInteger(0, items.length - 1)] ?? "";
}

function randomInteger(min: number, max: number) {
  const floorMin = Math.ceil(min);
  const floorMax = Math.floor(max);
  const range = floorMax - floorMin + 1;

  if (range <= 1) return floorMin;

  return floorMin + randomBelow(range);
}

function randomBelow(exclusiveMax: number) {
  const maxUint = 0xffffffff;
  const limit = maxUint - (maxUint % exclusiveMax);
  const values = new Uint32Array(1);

  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);

  return values[0] % exclusiveMax;
}
