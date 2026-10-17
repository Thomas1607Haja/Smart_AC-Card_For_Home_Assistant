import type { TemplateResult } from "lit";

export type HassEntityState = {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed?: string;
  last_updated?: string;
};

export type HomeAssistant = {
  states: Record<string, HassEntityState>;
  language?: string;
  locale?: {
    language?: string;
  };
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, any>,
    target?: Record<string, any>,
  ) => Promise<unknown>;
  formatEntityState?: (stateObj: HassEntityState) => string;
  formatEntityAttributeValue?: (
    stateObj: HassEntityState,
    attribute: string,
    value?: any,
  ) => string;
  localize?: (key: string, ...args: any[]) => string;
};

export type LovelaceCardEditor = HTMLElement & {
  hass?: HomeAssistant;
  setConfig(config: SmartAcCardConfig): void;
};

export type LovelaceCard = HTMLElement & {
  hass?: HomeAssistant;
  setConfig(config: SmartAcCardConfig): void;
  getCardSize?(): number | Promise<number>;
};

export type SmartAcStatus =
  | "off"
  | "cool"
  | "heat"
  | "fan"
  | "dry"
  | "auto"
  | "sleep"
  | "boost"
  | "eco"
  | "online"
  | "offline"
  | "unknown";

export type SmartAcButtonId =
  | "power_on"
  | "power_off"
  | "cool"
  | "heat"
  | "sleep"
  | "swing_vertical"
  | "fan"
  | "display"
  | "buzzer";

export type SmartAcIconId =
  | "power"
  | "off"
  | "cool"
  | "heat"
  | "sleep"
  | "fan"
  | "dry"
  | "auto"
  | "swing_vertical"
  | "display"
  | "buzzer"
  | "settings"
  | "window_open"
  | "window_closed";

export type SmartAcAction = {
  action: string;
  service?: string;
  perform_action?: string;
  target?: Record<string, any>;
  data?: Record<string, any>;
  service_data?: Record<string, any>;
};

export type SmartAcActionConfig = SmartAcAction | SmartAcAction[];

export type SmartAcButtonConfig = {
  id?: SmartAcButtonId | string;
  name?: string;
  icon?: string;
  action?: SmartAcActionConfig;
  status_entity?: string;
  status_attribute?: string;
  active_state?: string | string[];
  select_entity?: string;
  visible?: boolean;
  color?: string;
};

export type SmartAcHelperType =
  | "input_boolean"
  | "input_number"
  | "input_datetime"
  | "select"
  | "number"
  | "switch"
  | "button";

export type SmartAcHelperConfig = {
  entity: string;
  name?: string;
  icon?: string;
  type?: SmartAcHelperType;
};

export type SmartAcStatusMapEntry = {
  state: string | string[];
  status: SmartAcStatus;
};

export type SmartAcColorsConfig = Partial<
  Record<
    SmartAcStatus | "button_background" | "button_text" | "window_open" | "feature_active" | "feature_inactive",
    string
  >
>;

export type SmartAcIconsConfig = Partial<Record<SmartAcIconId | string, string>>;

export type SmartAcAnimationsConfig = {
  enabled?: boolean;
  cool?: boolean;
  heat?: boolean;
  fan?: boolean;
  swing?: boolean;
  sleep?: boolean;
};

export type SmartAcPopupConfig = {
  title?: string;
  cool_temperature_entity?: string;
  heat_temperature_entity?: string;
  autostart_entity?: string;
  autostart_time_entity?: string;
  sleep_auto_entity?: string;
  sleep_time_entity?: string;
  helpers?: SmartAcHelperConfig[];
};

export type SmartAcCardConfig = {
  type: string;
  room?: string;
  name?: string;
  temperature_entity: string;
  target_temperature_label?: string;
  target_temperature_entity?: string;
  target_temperature_attribute?: string;
  target_temperature_step?: number;
  status_entity?: string;
  status_attribute?: string;
  window_entity?: string;
  status_map?: SmartAcStatusMapEntry[];
  unit?: string;
  buttons?: SmartAcButtonConfig[];
  colors?: SmartAcColorsConfig;
  icons?: SmartAcIconsConfig;
  animations?: boolean | SmartAcAnimationsConfig;
  popup?: SmartAcPopupConfig;
  show_boost?: boolean;
  show_eco?: boolean;
  compact?: boolean;
  power_on_action?: SmartAcActionConfig;
  power_off_action?: SmartAcActionConfig;
  cool_action?: SmartAcActionConfig;
  heat_action?: SmartAcActionConfig;
  sleep_action?: SmartAcActionConfig;
  boost_action?: SmartAcActionConfig;
  eco_action?: SmartAcActionConfig;
  swing_horizontal_action?: SmartAcActionConfig;
  swing_vertical_action?: SmartAcActionConfig;
  fan_action?: SmartAcActionConfig;
  display_action?: SmartAcActionConfig;
  buzzer_action?: SmartAcActionConfig;
  fan_low_action?: SmartAcActionConfig;
  fan_medium_action?: SmartAcActionConfig;
  fan_high_action?: SmartAcActionConfig;
  fan_auto_action?: SmartAcActionConfig;
};

export type DialogShowEventDetail = {
  dialogTag: string;
  dialogImport: () => Promise<unknown>;
  dialogParams: SmartAcPopupDialogParams;
};

export type SmartAcPopupDialogParams = {
  hass: HomeAssistant;
  config: SmartAcCardConfig;
};

export type RenderableHelper = SmartAcHelperConfig & {
  stateObj?: HassEntityState;
  content: TemplateResult | string;
};
