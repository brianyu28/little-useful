import { Clock3 } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const TimestampConfig = defineTool({
  title: "Timestamp",
  description: "Convert between timestamps and dates across timezones",
  icon: Clock3,
  keywords: ["epoch", "time", "date", "seconds", "milliseconds", "utc"],
  path: "/timestamp",
});
