import { saveToolState } from "../../../hooks/useToolState";

export const scratchpadDefaults = { saveNote: true, text: "" };

export function saveScratchpadState(
  toolName: string,
  scratchpad: typeof scratchpadDefaults,
): void {
  saveToolState(
    toolName,
    scratchpad.saveNote ? scratchpad : { saveNote: false },
  );
}
