import { z } from "zod";
import { RgbScale } from "../types/RgbScale";

export const colorPreferencesSchema = z.object({
  palette: z.array(z.string().regex(/^#[\da-f]{6}$/i)),
  rgbScale: z.enum([RgbScale.BYTE, RgbScale.UNIT]),
});

export const colorDefaults = colorPreferencesSchema.parse({
  palette: [],
  rgbScale: RgbScale.BYTE,
});
