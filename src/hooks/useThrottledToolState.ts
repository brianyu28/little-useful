import throttle from "lodash-es/throttle";
import React from "react";
import type { z } from "zod";
import { saveToolState, useToolState } from "./useToolState";

export function useThrottledToolState<TShape extends z.ZodRawShape>(
  toolName: string,
  defaults: z.infer<z.ZodObject<TShape>>,
  schema: z.ZodObject<TShape>,
  saveInterval = 1000,
) {
  const saveState = React.useMemo(
    () => throttle(saveToolState, saveInterval),
    [saveInterval],
  );

  React.useEffect(() => () => saveState.flush(), [saveState]);

  return useToolState(toolName, defaults, schema, saveState);
}
