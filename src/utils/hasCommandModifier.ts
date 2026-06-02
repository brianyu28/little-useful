export function hasCommandModifier(event: KeyboardEvent): boolean {
  return event.altKey || event.ctrlKey || event.metaKey;
}
