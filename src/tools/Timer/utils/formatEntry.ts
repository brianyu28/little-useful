export function formatEntry(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return remainder === 0
    ? String(minutes)
    : `${minutes}:${String(remainder).padStart(2, "0")}`;
}
