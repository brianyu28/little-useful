export function getRawSeconds(entry: string): string {
  const separator = entry.indexOf(":");
  return separator === -1 ? "" : entry.slice(separator + 1);
}
