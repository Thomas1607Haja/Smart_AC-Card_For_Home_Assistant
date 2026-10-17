import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ACTION_KEYS, CARD_TYPE, DEFAULT_BUTTONS, DEFAULT_COLORS, DEFAULT_ICONS, EDITOR_TAG } from "./config";
import { cloneConfig, fireEvent } from "./helpers";
import { editorStyles } from "./styles";
import { localize } from "./localize";
import type { HomeAssistant, SmartAcAction, SmartAcButtonConfig, SmartAcButtonId, SmartAcCardConfig } from "./types";

declare global {
  interface HTMLElementTagNameMap {
    "smart-ac-card-editor": SmartAcCardEditor;
  }
}

type ConfigValue =
  | string
  | boolean
  | number
  | Record<string, unknown>
  | Array<Record<string, unknown>>
  | undefined;

const ALWAYS_VISIBLE_BUTTONS = new Set<SmartAcButtonId>(["power_on", "power_off", "cool", "heat"]);

@customElement(EDITOR_TAG)
class SmartAcCardEditor extends LitElement {
  static override styles = editorStyles;

  @state() private _hass?: HomeAssistant;
  @state() private _config?: SmartAcCardConfig;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  setConfig(config: SmartAcCardConfig): void {
    this._config = { ...config, type: config.type || `custom:${CARD_TYPE}` };
  }

  protected override render() {
    if (!this._config) {
      return nothing;
    }

    return html`
      <div class="editor">
        <div class="group">
          <div class="title">Basics</div>
          ${this._textField("room", localize(this._hass, "room"))}
          ${this._textField("name", localize(this._hass, "name"))}
          ${this._entityField("temperature_entity", localize(this._hass, "temperature_entity"))}
          ${this._entityField("window_entity", "Window entity")}
          ${this._textField("target_temperature_label", "Target temperature label", "Target")}
          ${this._entityField("target_temperature_entity", "Target temperature entity")}
          ${this._textField("target_temperature_attribute", "Target temperature attribute", "temperature")}
          ${this._numberField("target_temperature_step", "Target temperature step", 0.5)}
          ${this._entityField("status_entity", localize(this._hass, "status_entity"))}
          ${this._textField("status_attribute", localize(this._hass, "status_attribute"))}
        </div>

        <div class="group">
          <div class="title">Popup helpers</div>
          ${this._entityField("popup.cool_temperature_entity", localize(this._hass, "cool_temperature"))}
          ${this._entityField("popup.heat_temperature_entity", localize(this._hass, "heat_temperature"))}
          ${this._entityField("popup.autostart_entity", localize(this._hass, "autostart"))}
          ${this._entityField("popup.autostart_time_entity", localize(this._hass, "autostart_time"))}
          ${this._entityField("popup.sleep_auto_entity", localize(this._hass, "sleep_auto"))}
          ${this._entityField("popup.sleep_time_entity", localize(this._hass, "sleep_time"))}
        </div>

        <div class="group">
          <div class="title">Icons</div>
          ${Object.entries(DEFAULT_ICONS).map(([key, value]) =>
            this._iconField(`icons.${key}`, key.replaceAll("_", " "), String(value)),
          )}
        </div>

        <div class="group">
          <div class="title">Colors</div>
          ${["cool", "heat", "off", "sleep", "online", "offline", "window_open", "feature_active", "feature_inactive"].map((key) =>
            this._colorField(`colors.${key}`, key, DEFAULT_COLORS[key as keyof typeof DEFAULT_COLORS]),
          )}
          ${this._textField("colors.button_background", "button background")}
          ${this._textField("colors.button_text", "button text")}
        </div>

        <div class="group">
          <div class="title">Buttons</div>
          ${DEFAULT_BUTTONS.map((button) => this._buttonVisibilityField(button))}
        </div>

        <div class="group">
          <div class="title">Actions</div>
          ${DEFAULT_BUTTONS.map((button) => this._actionEditor(button))}
        </div>

        <div class="group">
          <div class="title">Options</div>
          ${this._checkboxField("animations", "Animations")}
          ${this._checkboxField("compact", "Compact layout")}
        </div>
      </div>
    `;
  }

  private _textField(path: string, label: string, fallback = "") {
    const value = this._get(path) ?? fallback;
    return html`
      <div class="field">
        <label>${label}</label>
        <input
          type="text"
          .value=${String(value)}
          @input=${(event: Event) =>
            this._valueChanged(path, (event.currentTarget as HTMLInputElement).value || undefined)}
        />
      </div>
    `;
  }

  private _entityField(path: string, label: string) {
    const value = this._get(path) as string | undefined;
    return html`
      <div class="field">
        <label>${label}</label>
        <ha-entity-picker
          .hass=${this._hass}
          .value=${value}
          allow-custom-entity
          @value-changed=${(event: CustomEvent<{ value?: string }>) =>
            this._valueChanged(path, event.detail.value)}
        ></ha-entity-picker>
      </div>
    `;
  }

  private _iconField(path: string, label: string, fallback: string) {
    const value = (this._get(path) as string | undefined) ?? fallback;
    return html`
      <div class="field">
        <label>${label}</label>
        <ha-icon-picker
          .hass=${this._hass}
          .value=${value}
          @value-changed=${(event: CustomEvent<{ value?: string }>) =>
            this._valueChanged(path, event.detail.value)}
        ></ha-icon-picker>
      </div>
    `;
  }

  private _colorField(path: string, label: string, fallback: string) {
    const value = (this._get(path) as string | undefined) ?? fallback;
    const isHex = /^#[0-9a-f]{6}$/i.test(value);
    return html`
      <div class="field">
        <label>${label}</label>
        <input
          type=${isHex ? "color" : "text"}
          .value=${value}
          @input=${(event: Event) =>
            this._valueChanged(path, (event.currentTarget as HTMLInputElement).value || undefined)}
        />
      </div>
    `;
  }

  private _checkboxField(path: string, label: string) {
    return html`
      <div class="field">
        <label>${label}</label>
        <ha-switch
          .checked=${Boolean(this._get(path))}
          @change=${(event: Event) =>
            this._valueChanged(path, (event.currentTarget as HTMLInputElement).checked)}
        ></ha-switch>
      </div>
    `;
  }

  private _numberField(path: string, label: string, fallback: number) {
    const value = this._get(path) ?? fallback;
    return html`
      <div class="field">
        <label>${label}</label>
        <input
          type="number"
          step="0.1"
          .value=${String(value)}
          @input=${(event: Event) =>
            this._valueChanged(path, Number((event.currentTarget as HTMLInputElement).value))}
        />
      </div>
    `;
  }

  private _buttonVisibilityField(button: SmartAcButtonConfig) {
    const id = button.id as SmartAcButtonId | undefined;
    if (!id) {
      return nothing;
    }

    const locked = ALWAYS_VISIBLE_BUTTONS.has(id);
    return html`
      <div class="button-config">
        <div class="field">
          <label>${button.name ?? id}</label>
          <input
            type="text"
            .value=${String(this._buttonValue(id, "name") ?? button.name ?? id)}
            @input=${(event: Event) =>
              this._setButtonField(id, "name", (event.currentTarget as HTMLInputElement).value)}
          />
        </div>
        <div class="field">
          <label>Visible</label>
          <ha-switch
            .checked=${locked || this._buttonVisible(id)}
            .disabled=${locked}
            @change=${(event: Event) =>
              this._setButtonVisible(id, (event.currentTarget as HTMLInputElement).checked)}
          ></ha-switch>
        </div>
        ${this._buttonSelectEntityField(id)}
      </div>
    `;
  }

  private _buttonSelectEntityField(id: SmartAcButtonId) {
    if (id !== "fan" && id !== "swing_vertical") {
      return nothing;
    }

    const selectEntity = this._buttonValue(id, "select_entity") as string | undefined;
    return html`
      <div class="field">
        <label>Select value entity</label>
        <ha-entity-picker
          .hass=${this._hass}
          .value=${selectEntity}
          allow-custom-entity
          @value-changed=${(event: CustomEvent<{ value?: string }>) =>
            this._setButtonField(id, "select_entity", event.detail.value)}
        ></ha-entity-picker>
      </div>
    `;
  }

  private _actionEditor(button: SmartAcButtonConfig) {
    const id = button.id as SmartAcButtonId | undefined;
    if (!id) {
      return nothing;
    }

    const actionKey = ACTION_KEYS[id];
    const actions = this._actionsFor(actionKey);
    const statusEntity = this._buttonValue(id, "status_entity") as string | undefined;
    const statusAttribute = this._buttonValue(id, "status_attribute") as string | undefined;
    const activeState = this._buttonValue(id, "active_state") as string | undefined;

    return html`
      <div class="action-editor">
        <div class="action-title">${this._buttonValue(id, "name") ?? button.name ?? id}</div>
        <div class="field">
          <label>Status entity</label>
          <ha-entity-picker
            .hass=${this._hass}
            .value=${statusEntity}
            allow-custom-entity
            @value-changed=${(event: CustomEvent<{ value?: string }>) =>
              this._setButtonField(id, "status_entity", event.detail.value)}
          ></ha-entity-picker>
        </div>
        <div class="field">
          <label>Status attribute</label>
          <input
            type="text"
            .value=${statusAttribute ?? ""}
            placeholder="state"
            @input=${(event: Event) =>
              this._setButtonField(id, "status_attribute", (event.currentTarget as HTMLInputElement).value)}
          />
        </div>
        <div class="field">
          <label>Active state</label>
          <input
            type="text"
            .value=${activeState ?? ""}
            placeholder="on"
            @input=${(event: Event) =>
              this._setButtonField(id, "active_state", (event.currentTarget as HTMLInputElement).value)}
          />
        </div>
        <div class="interaction-list">
          ${actions.length === 0
            ? html`<div class="hint">No interactions configured.</div>`
            : actions.map(
                (action, index) => html`
                  <div class="interaction-item">
                    <div class="interaction-header">
                      <span>Interaction ${index + 1}</span>
                      <button class="remove-action" @click=${() => this._removeAction(actionKey, index)}>
                        Remove
                      </button>
                    </div>
                    <hui-action-editor
                      .hass=${this._hass}
                      .config=${this._toHaAction(action)}
                      @config-changed=${(event: CustomEvent<{ config?: SmartAcAction }>) =>
                        this._setActionAt(actionKey, index, event.detail.config)}
                      @value-changed=${(event: CustomEvent<{ value?: SmartAcAction }>) =>
                        this._setActionAt(actionKey, index, event.detail.value)}
                      @action-changed=${(event: CustomEvent<{ action?: SmartAcAction }>) =>
                        this._setActionAt(actionKey, index, event.detail.action)}
                    ></hui-action-editor>
                    <div class="field interaction-field">
                      <label>Action service</label>
                      <input
                        type="text"
                        placeholder="script.turn_on"
                        .value=${this._serviceAction(action)}
                        @input=${(event: Event) =>
                          this._setActionService(
                            actionKey,
                            index,
                            (event.currentTarget as HTMLInputElement).value,
                          )}
                      />
                    </div>
                    <div class="field interaction-field">
                      <label>Target entity</label>
                      <ha-entity-picker
                        .hass=${this._hass}
                        .value=${this._targetEntity(action)}
                        allow-custom-entity
                        @value-changed=${(event: CustomEvent<{ value?: string }>) =>
                          this._setActionTarget(actionKey, index, event.detail.value)}
                      ></ha-entity-picker>
                    </div>
                    <div class="field interaction-field">
                      <label>Data JSON</label>
                      <textarea
                        rows="3"
                        placeholder='{"temperature": 23}'
                        .value=${this._actionData(action)}
                        @change=${(event: Event) =>
                          this._setActionData(
                            actionKey,
                            index,
                            (event.currentTarget as HTMLTextAreaElement).value,
                          )}
                      ></textarea>
                    </div>
                  </div>
                `,
              )}
          <button class="add-action" @click=${() => this._addAction(actionKey)}>
            + Add interaction
          </button>
        </div>
      </div>
    `;
  }

  private _buttonValue(id: SmartAcButtonId, key: keyof SmartAcButtonConfig): ConfigValue {
    return this._config?.buttons?.find((button) => button.id === id)?.[key] as ConfigValue;
  }

  private _setButtonField(id: SmartAcButtonId, key: keyof SmartAcButtonConfig, value: ConfigValue): void {
    if (!this._config) {
      return;
    }

    const nextConfig = cloneConfig(this._config);
    const buttons = [...(nextConfig.buttons ?? [])];
    const index = buttons.findIndex((button) => button.id === id);
    const defaultButton = DEFAULT_BUTTONS.find((button) => button.id === id);
    const nextButton = { ...(defaultButton ?? { id }), ...(index >= 0 ? buttons[index] : {}), id };

    if (value === undefined || value === "") {
      delete nextButton[key];
    } else {
      nextButton[key] = value as never;
    }

    if (index >= 0) {
      buttons[index] = nextButton;
    } else {
      buttons.push(nextButton);
    }

    nextConfig.buttons = buttons;
    this._config = nextConfig;
    fireEvent(this, "config-changed", { config: nextConfig });
  }

  private _actionsFor(path: keyof SmartAcCardConfig): SmartAcAction[] {
    const value = this._config?.[path];
    if (Array.isArray(value)) {
      return value as SmartAcAction[];
    }

    if (value && typeof value === "object" && "action" in value) {
      return [value as SmartAcAction];
    }

    return [];
  }

  private _toHaAction(action: SmartAcAction): SmartAcAction {
    if (action.action === "call-service" || action.action === "perform-action") {
      return action;
    }

    if (action.action.includes(".")) {
      return {
        ...action,
        action: "perform-action",
        perform_action: action.action,
      };
    }

    return action;
  }

  private _targetEntity(action: SmartAcAction): string | undefined {
    const entityId = action.target?.entity_id;
    return typeof entityId === "string" ? entityId : undefined;
  }

  private _serviceAction(action: SmartAcAction): string {
    return action.perform_action ?? action.service ?? (action.action.includes(".") ? action.action : "");
  }

  private _actionData(action: SmartAcAction): string {
    const data = action.data ?? action.service_data;
    return data ? JSON.stringify(data, null, 2) : "";
  }

  private _setActionTarget(path: keyof SmartAcCardConfig, index: number, entityId?: string): void {
    const actions = this._actionsFor(path);
    const action = { ...(actions[index] ?? { action: "perform-action" }) };
    if (entityId) {
      action.target = { ...(action.target ?? {}), entity_id: entityId };
    } else {
      delete action.target;
    }

    actions[index] = action;
    this._setActions(path, actions);
  }

  private _setActionService(path: keyof SmartAcCardConfig, index: number, serviceAction: string): void {
    const actions = this._actionsFor(path);
    const action = { ...(actions[index] ?? { action: "perform-action" }) };
    const trimmed = serviceAction.trim();

    if (trimmed) {
      action.action = "perform-action";
      action.perform_action = trimmed;
      delete action.service;
    } else {
      action.action = "perform-action";
      delete action.perform_action;
      delete action.service;
    }

    actions[index] = action;
    this._setActions(path, actions);
  }

  private _setActionData(path: keyof SmartAcCardConfig, index: number, value: string): void {
    const actions = this._actionsFor(path);
    const action = { ...(actions[index] ?? { action: "perform-action" }) };
    if (!value.trim()) {
      delete action.data;
    } else {
      action.data = JSON.parse(value) as Record<string, unknown>;
    }

    actions[index] = action;
    this._setActions(path, actions);
  }

  private _addAction(path: keyof SmartAcCardConfig): void {
    const actions = this._actionsFor(path);
    this._setActions(path, [...actions, { action: "perform-action" }]);
  }

  private _removeAction(path: keyof SmartAcCardConfig, index: number): void {
    const actions = this._actionsFor(path).filter((_, actionIndex) => actionIndex !== index);
    this._setActions(path, actions);
  }

  private _setActionAt(
    path: keyof SmartAcCardConfig,
    index: number,
    action: SmartAcAction | undefined,
  ): void {
    const actions = this._actionsFor(path);
    if (!action) {
      this._removeAction(path, index);
      return;
    }

    actions[index] = action;
    this._setActions(path, actions);
  }

  private _setActions(path: keyof SmartAcCardConfig, actions: SmartAcAction[]): void {
    if (actions.length === 0) {
      this._valueChanged(path, undefined);
      return;
    }

    this._valueChanged(path, actions.length === 1 ? actions[0] : actions);
  }

  private _get(path: string): ConfigValue {
    return path.split(".").reduce<any>((value, key) => value?.[key], this._config);
  }

  private _buttonVisible(id: SmartAcButtonId): boolean {
    const configured = this._config?.buttons?.find((button) => button.id === id);
    if (configured?.visible !== undefined) {
      return configured.visible;
    }

    const defaultButton = DEFAULT_BUTTONS.find((button) => button.id === id);
    if (defaultButton?.visible !== undefined) {
      return defaultButton.visible;
    }

    return true;
  }

  private _setButtonVisible(id: SmartAcButtonId, visible: boolean): void {
    if (!this._config || ALWAYS_VISIBLE_BUTTONS.has(id)) {
      return;
    }

    const nextConfig = cloneConfig(this._config);
    const buttons = [...(nextConfig.buttons ?? [])];
    const index = buttons.findIndex((button) => button.id === id);
    const defaultButton = DEFAULT_BUTTONS.find((button) => button.id === id);
    const nextButton = { ...(defaultButton ?? { id }), ...(index >= 0 ? buttons[index] : {}), id, visible };

    if (index >= 0) {
      buttons[index] = nextButton;
    } else {
      buttons.push(nextButton);
    }

    nextConfig.buttons = buttons;
    this._config = nextConfig;
    fireEvent(this, "config-changed", { config: nextConfig });
  }

  private _valueChanged(path: string, value: ConfigValue): void {
    if (!this._config) {
      return;
    }

    const nextConfig = cloneConfig(this._config);
    const parts = path.split(".");
    let cursor: Record<string, any> = nextConfig;

    parts.slice(0, -1).forEach((part) => {
      cursor[part] = cursor[part] ?? {};
      cursor = cursor[part];
    });

    const key = parts[parts.length - 1];
    if (!key) {
      return;
    }

    if (value === undefined || value === "") {
      delete cursor[key];
    } else {
      cursor[key] = value;
    }

    this._config = nextConfig;
    fireEvent(this, "config-changed", { config: nextConfig });
  }
}

export { SmartAcCardEditor };
