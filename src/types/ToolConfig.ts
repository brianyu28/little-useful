import type { LucideIcon } from "lucide-react";

export interface ToolConfig {
  description: string;
  icon: LucideIcon;
  /** Search terms beyond title and description. */
  keywords?: string[];
  path: string;
  /** Importance of the tool, generally on a 0-10 scale (larger is more important). */
  priority?: number;
  title: string;
}
