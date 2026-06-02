export function ensureSecondsEntry(entry: string): string {
  return entry.includes(":") ? entry : `${entry || "0"}:`;
}
