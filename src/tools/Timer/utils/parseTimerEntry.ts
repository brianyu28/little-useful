export function parseTimerEntry(entry: string): number {
  if (!entry) return 0;

  const separator = entry.indexOf(":");
  const minutes =
    separator === -1
      ? Number(entry) * 60
      : Number(entry.slice(0, separator) || 0) * 60 +
        Number(entry.slice(separator + 1) || 0);

  return minutes * 1000;
}
