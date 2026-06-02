import React from "react";
import { z } from "zod";

export function useToolState<TShape extends z.ZodRawShape>(
  toolName: string,
  defaults: z.infer<z.ZodObject<TShape>>,
  schema: z.ZodObject<TShape>,
  saveState: (
    toolName: string,
    state: z.infer<z.ZodObject<TShape>>,
  ) => void = saveToolState,
) {
  const defaultsRef = React.useRef(defaults);
  const schemaRef = React.useRef(schema);
  const [loaded, setLoaded] = React.useState(false);
  const [state, setState] = React.useState(defaults);

  React.useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(`littleuseful/${toolName}`) ?? "{}",
      );
      if (!stored || typeof stored !== "object" || Array.isArray(stored))
        return;

      const restored: Record<string, unknown> = { ...defaultsRef.current };
      for (const [key, fieldSchema] of Object.entries(
        schemaRef.current.shape,
      )) {
        const result = z.safeParse(fieldSchema, stored[key]);
        if (result.success) restored[key] = result.data;
      }
      setState(restored as z.infer<z.ZodObject<TShape>>);
    } catch {
      // Ignore unavailable storage and stale JSON.
    } finally {
      setLoaded(true);
    }
  }, [toolName]);

  React.useEffect(() => {
    if (!loaded) return;
    saveState(toolName, state);
  }, [loaded, saveState, state, toolName]);

  return [state, setState] as const;
}

export function saveToolState(toolName: string, state: unknown) {
  try {
    localStorage.setItem(`littleuseful/${toolName}`, JSON.stringify(state));
  } catch {
    // Ignore unavailable storage.
  }
}
