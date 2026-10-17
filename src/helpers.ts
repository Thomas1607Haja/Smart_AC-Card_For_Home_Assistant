import type {
  DialogShowEventDetail,
  HassEntityState,
  HomeAssistant,
  SmartAcCardConfig,
  SmartAcStatus,
} from "./types";
import { DEFAULT_STATUS_MAP, DIALOG_TAG } from "./config";

export function fireEvent<T = any>(
  node: HTMLElement,
  type: string,
  detail?: T,
  options?: EventInit,
): CustomEvent<T> {
  const event = new CustomEvent<T>(type, {
    bubbles: options?.bubbles ?? true,
    cancelable: options?.cancelable ?? false,
    composed: options?.composed ?? true,
    detail,
  });
  node.dispatchEvent(event);
  return event;
}

export function entityState(hass: HomeAssistant, entityId?: string): HassEntityState | undefined {
  return entityId ? hass.states[entityId] : undefined;
}

export function formatTemperature(
  hass: HomeAssistant,
  entityId: string,
  unitOverride?: string,
): string {
  const stateObj = entityState(hass, entityId);
  if (!stateObj) {
    return "--";
  }

  const formatted = hass.formatEntityState?.(stateObj) ?? stateObj.state;
  const unit = unitOverride ?? stateObj.attributes.unit_of_measurement ?? "";
  return unit && !formatted.includes(unit) ? `${formatted}${unit}` : formatted;
}

export function formatTargetTemperature(hass: HomeAssistant, config: SmartAcCardConfig): string | undefined {
  const value = targetTemperatureValue(hass, config);
  if (value === undefined) {
    return undefined;
  }

  const stateObj = entityState(hass, config.target_temperature_entity ?? config.status_entity);
  const unit = stateObj?.attributes.unit_of_measurement ?? "°C";
  return `${value}${unit}`;
}

export function targetTemperatureValue(
  hass: HomeAssistant,
  config: SmartAcCardConfig,
): number | undefined {
  const entityId = config.target_temperature_entity ?? config.status_entity;
  const stateObj = entityState(hass, entityId);
  if (!entityId || !stateObj) {
    return undefined;
  }

  const attribute = config.target_temperature_attribute ?? "temperature";
  const rawValue = attribute === "state" ? stateObj.state : stateObj.attributes[attribute];
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return undefined;
  }

  const value = Number(rawValue);
  return Number.isFinite(value) ? value : undefined;
}

export function resolveStatus(hass: HomeAssistant, config: SmartAcCardConfig): SmartAcStatus {
  const stateObj = entityState(hass, config.status_entity);
  if (!config.status_entity || !stateObj) {
    return "unknown";
  }

  const raw = String(
    config.status_attribute ? stateObj.attributes[config.status_attribute] : stateObj.state,
  ).toLowerCase();

  const statusMap = config.status_map ?? DEFAULT_STATUS_MAP;
  for (const entry of statusMap) {
    const values = Array.isArray(entry.state) ? entry.state : [entry.state];
    if (values.map((value) => value.toLowerCase()).includes(raw)) {
      return entry.status;
    }
  }

  if (stateObj.state === "unavailable" || stateObj.state === "unknown") {
    return "offline";
  }

  return "online";
}

export function dialogImport(): Promise<unknown> {
  return import("./popup");
}

export function showSmartAcDialog(node: HTMLElement, hass: HomeAssistant, config: SmartAcCardConfig): void {
  fireEvent<DialogShowEventDetail>(node, "show-dialog", {
    dialogTag: DIALOG_TAG,
    dialogImport,
    dialogParams: { hass, config },
  });
}

export function colorToAlpha(color: string, alpha = 0.14): string {
  if (color.startsWith("#") && (color.length === 7 || color.length === 4)) {
    const hex =
      color.length === 4
        ? color
            .slice(1)
            .split("")
            .map((part) => `${part}${part}`)
            .join("")
        : color.slice(1);
    const value = Number.parseInt(hex, 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
}

export function setCssVars(element: HTMLElement, vars: Record<string, string | undefined>): void {
  Object.entries(vars).forEach(([key, value]) => {
    if (value) {
      element.style.setProperty(key, value);
    }
  });
}

export function parseJsonObject(value: string): any {
  if (!value.trim()) {
    return undefined;
  }

  return JSON.parse(value);
}

export function cloneConfig(config: SmartAcCardConfig): SmartAcCardConfig {
  return JSON.parse(JSON.stringify(config)) as SmartAcCardConfig;
}
