export function getRawMinutes(entry: string): string {
  const separator = entry.indexOf(":");
  return separator === -1 ? entry : entry.slice(0, separator);
}
