import { z } from "zod";
import { TimeFormat } from "../types/TimeFormat";

export const timestampPreferencesSchema = z.object({
  timeFormat: z.enum([TimeFormat.TWELVE, TimeFormat.TWENTY_FOUR]),
  timeZones: z.array(z.string()),
});

export const timestampDefaults = timestampPreferencesSchema.parse({
  timeFormat: TimeFormat.TWENTY_FOUR,
  timeZones: ["UTC"],
});
