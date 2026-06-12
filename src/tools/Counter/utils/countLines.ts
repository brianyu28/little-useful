import type { CounterOptions } from "../types/CounterOptions";

export interface LineCount {
  readonly count: number;
  readonly displayValue: string;
  readonly key: string;
}

export function countLines(
  input: string,
  options: CounterOptions,
): LineCount[] {
  const counts = new Map<string, LineCount>();

  for (const rawLine of input.split(/\r?\n/)) {
    const displayValue = options.trimLines ? rawLine.trim() : rawLine;
    if (!displayValue) continue;

    const key = options.caseSensitive
      ? displayValue
      : displayValue.toLocaleLowerCase();
    const existing = counts.get(key);

    counts.set(key, {
      count: (existing?.count ?? 0) + 1,
      displayValue: existing?.displayValue ?? displayValue,
      key,
    });
  }

  return [...counts.values()].sort((first, second) => {
    const frequencyDifference = second.count - first.count;
    if (frequencyDifference !== 0) return frequencyDifference;

    return first.displayValue.localeCompare(second.displayValue, undefined, {
      sensitivity: "base",
    });
  });
}
