import type { SmartAcCardConfig, SmartAcIconId } from "./types";
import { DEFAULT_ICONS } from "./config";

export function iconFor(config: SmartAcCardConfig, id: SmartAcIconId | string, fallback?: string): string {
  return config.icons?.[id] ?? DEFAULT_ICONS[id] ?? fallback ?? "mdi:circle";
}
