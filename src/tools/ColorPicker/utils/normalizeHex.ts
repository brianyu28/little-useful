export function normalizeHex(value: string): string | undefined {
  const match = value.trim().match(/^#?([\da-f]{6}|[\da-f]{3})$/i);
  if (match == null) {
    return;
  }

  const hex = match[1];
  return `#${hex.length === 3 ? [...hex].map((digit) => digit.repeat(2)).join("") : hex}`.toLowerCase();
}
