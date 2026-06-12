import type { SetComparisonOptions } from "../types/SetComparisonOptions";

export interface SetComparisonEntry {
  readonly displayValue: string;
  readonly key: string;
}

export interface SetComparisonResult {
  readonly both: SetComparisonEntry[];
  readonly leftOnly: SetComparisonEntry[];
  readonly rightOnly: SetComparisonEntry[];
}

export function compareLineSets(
  leftInput: string,
  rightInput: string,
  options: SetComparisonOptions,
): SetComparisonResult {
  const left = normalizeLines(leftInput, options);
  const right = normalizeLines(rightInput, options);
  const rightKeys = new Set(right.map(({ key }) => key));
  const leftKeys = new Set(left.map(({ key }) => key));

  const leftOnly = left.filter(({ key }) => !rightKeys.has(key));
  const rightOnly = right.filter(({ key }) => !leftKeys.has(key));
  const both = left.filter(({ key }) => rightKeys.has(key));

  return {
    both: formatEntries(both, options.sortResults),
    leftOnly: formatEntries(leftOnly, options.sortResults),
    rightOnly: formatEntries(rightOnly, options.sortResults),
  };
}

function normalizeLines(input: string, options: SetComparisonOptions) {
  const entries = new Map<string, SetComparisonEntry>();

  for (const rawLine of input.split(/\r?\n/)) {
    const displayValue = options.trimLines ? rawLine.trim() : rawLine;
    if (!displayValue) continue;

    const key = options.caseSensitive
      ? displayValue
      : displayValue.toLocaleLowerCase();

    if (!entries.has(key)) {
      entries.set(key, { displayValue, key });
    }
  }

  return [...entries.values()];
}

function formatEntries(
  entries: SetComparisonEntry[],
  sortResults: boolean,
): SetComparisonEntry[] {
  if (!sortResults) return entries;

  return [...entries].sort((first, second) =>
    first.displayValue.localeCompare(second.displayValue, undefined, {
      sensitivity: "base",
    }),
  );
}
