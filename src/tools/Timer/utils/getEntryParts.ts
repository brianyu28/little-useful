interface EntryParts {
  readonly minutes: string;
  readonly seconds: string;
}

export function getEntryParts(entry: string): EntryParts {
  const separator = entry.indexOf(":");
  return {
    minutes: (separator === -1 ? entry : entry.slice(0, separator)) || "0",
    seconds: separator === -1 ? "" : entry.slice(separator + 1) || "0",
  };
}
