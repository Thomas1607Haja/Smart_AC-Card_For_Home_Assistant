import type {
  SmartAcActionConfig,
  SmartAcAnimationsConfig,
  SmartAcButtonConfig,
  SmartAcButtonId,
  SmartAcCardConfig,
  SmartAcColorsConfig,
  SmartAcIconsConfig,
  SmartAcStatus,
  SmartAcStatusMapEntry,
} from "./types";

export const CARD_TYPE = "smart-ac-card";
export const CARD_VERSION = "0.4.2";
export const EDITOR_TAG = "smart-ac-card-editor";
export const DIALOG_TAG = "smart-ac-card-dialog";

export const DEFAULT_COLORS: Required<SmartAcColorsConfig> = {
  off: "var(--disabled-text-color)",
  cool: "#2196f3",
  heat: "#ff7043",
  fan: "#26a69a",
  dry: "#7e57c2",
  auto: "#66bb6a",
  sleep: "#5c6bc0",
  boost: "#ffb300",
  eco: "#43a047",
  online: "var(--primary-color)",
  offline: "var(--error-color)",
  unknown: "var(--secondary-text-color)",
  window_open: "var(--warning-color, #ff9800)",
  feature_active: "var(--warning-color, #ff9800)",
  feature_inactive: "var(--disabled-text-color)",
  button_background: "var(--ha-card-background, var(--card-background-color))",
  button_text: "var(--primary-text-color)",
};

export const DEFAULT_ICONS: Required<SmartAcIconsConfig> = {
  power: "mdi:power",
  off: "mdi:power-off",
  cool: "mdi:snowflake",
  heat: "mdi:fire",
  sleep: "mdi:weather-night",
  fan: "mdi:fan",
  dry: "mdi:water-percent",
  auto: "mdi:autorenew",
  swing_vertical: "mdi:arrow-up-down",
  display: "mdi:monitor",
  buzzer: "mdi:bell-ring",
  settings: "mdi:cog",
  window_open: "mdi:window-open-variant",
  window_closed: "mdi:window-closed-variant",
};

export const DEFAULT_STATUS_MAP: SmartAcStatusMapEntry[] = [
  { state: ["off", "aus"], status: "off" },
  { state: ["cool", "cooling", "kühlen", "kuehlen"], status: "cool" },
  { state: ["heat", "heating", "heizen"], status: "heat" },
  { state: ["fan", "fan_only", "lüfter", "luefter"], status: "fan" },
  { state: ["dry", "dehumidify", "entfeuchten"], status: "dry" },
  { state: ["auto", "automatik"], status: "auto" },
  { state: ["sleep", "night", "nachtmodus"], status: "sleep" },
  { state: ["boost", "turbo"], status: "boost" },
  { state: ["eco", "economy"], status: "eco" },
  { state: ["unavailable", "offline"], status: "offline" },
];

export const DEFAULT_BUTTONS: SmartAcButtonConfig[] = [
  { id: "power_on", name: "On", icon: "mdi:power" },
  { id: "power_off", name: "Off", icon: "mdi:power-off" },
  { id: "cool", name: "Cool", icon: "mdi:snowflake" },
  { id: "heat", name: "Heat", icon: "mdi:fire" },
  { id: "sleep", name: "Night", icon: "mdi:weather-night" },
  { id: "swing_vertical", name: "Swing V", icon: "mdi:arrow-up-down" },
  { id: "fan", name: "Fan", icon: "mdi:fan" },
  { id: "display", name: "Display", icon: "mdi:monitor" },
  { id: "buzzer", name: "Buzzer", icon: "mdi:bell-ring" },
];

export const ACTION_KEYS: Record<SmartAcButtonId, keyof SmartAcCardConfig> = {
  power_on: "power_on_action",
  power_off: "power_off_action",
  cool: "cool_action",
  heat: "heat_action",
  sleep: "sleep_action",
  swing_vertical: "swing_vertical_action",
  fan: "fan_action",
  display: "display_action",
  buzzer: "buzzer_action",
};

export const DEFAULT_ANIMATIONS: Required<SmartAcAnimationsConfig> = {
  enabled: true,
  cool: true,
  heat: true,
  fan: true,
  swing: true,
  sleep: true,
};

export function normalizeConfig(config: SmartAcCardConfig): SmartAcCardConfig {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid Smart AC Card configuration.");
  }

  if (!config.temperature_entity) {
    throw new Error("Smart AC Card requires temperature_entity.");
  }

  return {
    ...config,
    type: config.type || `custom:${CARD_TYPE}`,
    buttons: mergeButtons(config),
    colors: { ...DEFAULT_COLORS, ...config.colors },
    icons: { ...DEFAULT_ICONS, ...config.icons },
    status_map: config.status_map ?? DEFAULT_STATUS_MAP,
  };
}

export function normalizeAnimations(
  animations: SmartAcCardConfig["animations"],
): Required<SmartAcAnimationsConfig> {
  if (typeof animations === "boolean") {
    return { ...DEFAULT_ANIMATIONS, enabled: animations };
  }

  return { ...DEFAULT_ANIMATIONS, ...(animations ?? {}) };
}

export function getActionForButton(
  config: SmartAcCardConfig,
  button: SmartAcButtonConfig,
): SmartAcActionConfig | undefined {
  if (button.action) {
    return button.action;
  }

  const id = button.id as SmartAcButtonId | undefined;
  if (!id || !(id in ACTION_KEYS)) {
    return undefined;
  }

  return config[ACTION_KEYS[id]] as SmartAcActionConfig | undefined;
}

function mergeButtons(config: SmartAcCardConfig): SmartAcButtonConfig[] {
  const configured = config.buttons ?? [];
  const byId = new Map(configured.filter((button) => button.id).map((button) => [button.id, button]));

  const defaultButtons: SmartAcButtonConfig[] = DEFAULT_BUTTONS.map((button) => {
    const override = byId.get(button.id);
    const visible = override?.visible ?? button.visible ?? true;

    return { ...button, ...override, visible };
  });

  return [...defaultButtons, ...configured.filter((button) => !button.id)];
}

export function statusLabel(status: SmartAcStatus): string {
  const labels: Record<SmartAcStatus, string> = {
    off: "Off",
    cool: "Cooling",
    heat: "Heating",
    fan: "Fan",
    dry: "Dry",
    auto: "Automatic",
    sleep: "Night",
    boost: "Boost",
    eco: "Eco",
    online: "Online",
    offline: "Offline",
    unknown: "Unknown",
  };

  return labels[status] ?? labels.unknown;
}
