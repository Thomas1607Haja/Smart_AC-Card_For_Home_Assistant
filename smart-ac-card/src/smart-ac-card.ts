import { LitElement, html, nothing, type PropertyValues } from "lit";
import { state } from "lit/decorators.js";
import { executeActions } from "./actions";
import {
  CARD_TYPE,
  CARD_VERSION,
  EDITOR_TAG,
  getActionForButton,
  normalizeAnimations,
  normalizeConfig,
  statusLabel,
} from "./config";
import {
  fireEvent,
  formatTargetTemperature,
  formatTemperature,
  resolveStatus,
  setCssVars,
  showSmartAcDialog,
  targetTemperatureValue,
} from "./helpers";
import { iconFor } from "./icons";
import { localize } from "./localize";
import { cardStyles } from "./styles";
import type {
  HomeAssistant,
  LovelaceCardEditor,
  SmartAcButtonConfig,
  SmartAcCardConfig,
  SmartAcStatus,
} from "./types";

import "./editor";

declare global {
  interface Window {
    customCards?: Array<Record<string, string | boolean>>;
  }

  interface HTMLElementTagNameMap {
    "smart-ac-card": SmartAcCard;
  }
}

class SmartAcCard extends LitElement {
  static override styles = cardStyles;

  @state() private _hass?: HomeAssistant;
  @state() private _config?: SmartAcCardConfig;
  @state() private _runningButton?: string;
  @state() private _openSelectButtonId?: string;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  static getConfigElement(): LovelaceCardEditor {
    return document.createElement(EDITOR_TAG) as LovelaceCardEditor;
  }

  static getStubConfig(): Partial<SmartAcCardConfig> {
    return {
      type: `custom:${CARD_TYPE}`,
      room: "Bedroom",
      name: "Air conditioner",
      temperature_entity: "sensor.bedroom_temperature",
      status_entity: "sensor.bedroom_ac_status",
      animations: true,
    };
  }

  setConfig(config: SmartAcCardConfig): void {
    this._config = normalizeConfig(config);
  }

  getCardSize(): number {
    return 5;
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._config || !this._hass) {
      return;
    }

    const status = resolveStatus(this._hass, this._config);
    const colors = this._config.colors ?? {};
    const activeColor = colors[status] ?? colors.online;

    setCssVars(this, {
      "--smart-ac-active-color": activeColor,
      "--smart-ac-active-tint": activeColor ? `color-mix(in srgb, ${activeColor} 14%, transparent)` : undefined,
      "--smart-ac-button-background": colors.button_background,
      "--smart-ac-button-text": colors.button_text,
      "--smart-ac-window-open-color": colors.window_open,
      "--smart-ac-feature-active-color": colors.feature_active,
      "--smart-ac-feature-inactive-color": colors.feature_inactive,
    });

    this.toggleAttribute("wide", this.offsetWidth > 430);
  }

  protected override render() {
    if (!this._config || !this._hass) {
      return nothing;
    }

    const status = resolveStatus(this._hass, this._config);
    const temperature = formatTemperature(
      this._hass,
      this._config.temperature_entity,
      this._config.unit,
    );
    const targetTemperature = formatTargetTemperature(this._hass, this._config);
    const targetTemperatureNumber = targetTemperatureValue(this._hass, this._config);
    const statusHints = this._statusHints(status);
    const windowOpen = this._windowOpen();

    return html`
      <ha-card>
        <div class=${this._config.compact ? "wrap compact" : "wrap"}>
          <div class="header">
            <div>
              <div class="room">${this._config.room ?? ""}</div>
              <div class="name">${this._config.name ?? ""}</div>
            </div>
            ${this._config.window_entity
              ? html`
                  <button
                    class=${windowOpen ? "window-indicator open" : "window-indicator"}
                    title=${windowOpen ? localize(this._hass, "window_open") : localize(this._hass, "window_closed")}
                    aria-label=${windowOpen ? localize(this._hass, "window_open") : localize(this._hass, "window_closed")}
                    @click=${this._openWindowDetails}
                  >
                    <ha-icon
                      .icon=${iconFor(this._config, windowOpen ? "window_open" : "window_closed")}
                    ></ha-icon>
                  </button>
                `
              : nothing}
            <button
              class="settings-button"
              title="Settings"
              aria-label="Settings"
              @click=${this._openDialog}
            >
              <ha-icon .icon=${iconFor(this._config, "settings")}></ha-icon>
            </button>
          </div>

          <div class="temperature-row">
            <button
              class="temperature temperature-button"
              aria-label="Show temperature details"
              @click=${this._openTemperatureDetails}
            >
              ${temperature}
            </button>
            <div class="status">${statusLabel(status)}</div>
          </div>

          ${targetTemperature
            ? html`
                <div class="setpoint-row">
                  <span class="setpoint-label">${this._config.target_temperature_label ?? "Target"}</span>
                  <div class="setpoint-control">
                    <button
                      class="setpoint-button"
                      aria-label="Decrease target temperature"
                      ?disabled=${targetTemperatureNumber === undefined}
                      @click=${() => this._changeTargetTemperature(-1)}
                    >
                      <ha-icon .icon=${"mdi:chevron-left"}></ha-icon>
                    </button>
                    <span class="setpoint-value">${targetTemperature}</span>
                    <button
                      class="setpoint-button"
                      aria-label="Increase target temperature"
                      ?disabled=${targetTemperatureNumber === undefined}
                      @click=${() => this._changeTargetTemperature(1)}
                    >
                      <ha-icon .icon=${"mdi:chevron-right"}></ha-icon>
                    </button>
                  </div>
                </div>
              `
            : nothing}

          <div class="buttons">
            ${(this._config.buttons ?? [])
              .filter((button) => button.visible !== false)
              .map((button) => this._renderButton(button, status))}
          </div>
          ${statusHints.length > 0
            ? html`<div class="schedule-hint">${statusHints.map((hint) => html`<div>${hint}</div>`)}</div>`
            : nothing}
          <div class="version">v${CARD_VERSION}</div>
        </div>
      </ha-card>
    `;
  }

  private _renderButton(button: SmartAcButtonConfig, status: SmartAcStatus) {
    if (!this._config) {
      return nothing;
    }

    const buttonId = button.id ?? button.name ?? "custom";
    const action = getActionForButton(this._config, button);
    const selectOptions = this._selectOptions(button);
    const active = this._buttonActive(button, status);
    const isFeatureButton = ["sleep", "display", "buzzer"].includes(button.id ?? "");
    const animationClass = this._animationClass(button, status, active);
    const style = [
      button.color
        ? `${isFeatureButton ? "--smart-ac-feature-active-color" : "--smart-ac-button-color"}:${button.color}`
        : "",
      active && !isFeatureButton ? "--smart-ac-button-active-background: var(--smart-ac-active-tint)" : "",
    ]
      .filter(Boolean)
      .join(";");

    return html`
      <div class="button-cell">
        <button
          class=${`action-button ${isFeatureButton ? "feature-button" : ""} ${animationClass}`}
          style=${style}
          aria-pressed=${active ? "true" : "false"}
          ?data-active=${active}
          ?disabled=${this._runningButton === buttonId || (!action && !button.select_entity)}
          @click=${() => this._handleButton(button)}
        >
          <ha-icon .icon=${button.icon ?? this._fallbackButtonIcon(button)}></ha-icon>
          <span class="action-label">${button.name ?? button.id}</span>
        </button>
        ${button.select_entity && this._openSelectButtonId === buttonId
          ? html`
              <select
                class="button-select"
                .value=${this._selectValue(button) ?? ""}
                @change=${(event: Event) =>
                  this._setSelectButtonValue(button, (event.currentTarget as HTMLSelectElement).value)}
              >
                <option value="" disabled>Select value</option>
                ${selectOptions.map((option) => html`<option value=${option}>${option}</option>`)}
              </select>
            `
          : nothing}
      </div>
    `;
  }

  private _animationClass(button: SmartAcButtonConfig, status: SmartAcStatus, active: boolean): string {
    if (!this._config) {
      return "";
    }

    const animations = normalizeAnimations(this._config.animations);
    if (!animations.enabled) {
      return "";
    }

    const id = button.id;
    if (animations.cool && id === "cool" && (active || status === "cool")) {
      return "animate-cool";
    }
    if (animations.heat && id === "heat" && (active || status === "heat")) {
      return "animate-heat";
    }
    if (animations.fan && id === "fan" && (active || status === "fan")) {
      return "animate-fan";
    }
    if (animations.swing && id === "swing_vertical" && active) {
      return "animate-swing";
    }
    if (animations.sleep && id === "sleep" && (active || status === "sleep")) {
      return "animate-sleep";
    }

    return "";
  }

  private _buttonActive(button: SmartAcButtonConfig, cardStatus: SmartAcStatus): boolean {
    if (!this._hass) {
      return false;
    }

    if (!button.status_entity && button.select_entity) {
      return this._selectButtonActive(button);
    }

    if (!button.status_entity) {
      return this._statusMatchesButton(button, cardStatus);
    }

    const stateObj = this._hass.states[button.status_entity];
    if (!stateObj) {
      return false;
    }

    const configuredStatusValue =
      button.status_attribute && button.status_attribute !== "state"
        ? stateObj.attributes[button.status_attribute]
        : stateObj.state;
    const statusValue = Array.isArray(configuredStatusValue) ? stateObj.state : configuredStatusValue;
    const activeStates = button.active_state
      ? Array.isArray(button.active_state)
        ? button.active_state
        : [button.active_state]
      : ["on", "true", "active", "cool", "heat", "fan", "sleep", "boost", "eco"];

    const normalizedActiveStates = activeStates.map((value) => String(value).toLowerCase());
    return normalizedActiveStates.includes(String(statusValue).toLowerCase());
  }

  private _statusMatchesButton(button: SmartAcButtonConfig, cardStatus: SmartAcStatus): boolean {
    switch (button.id) {
      case "cool":
        return cardStatus === "cool";
      case "heat":
        return cardStatus === "heat";
      case "sleep":
        return cardStatus === "sleep";
      case "power_off":
        return cardStatus === "off";
      case "fan":
        return cardStatus === "fan";
      default:
        return false;
    }
  }

  private _fallbackButtonIcon(button: SmartAcButtonConfig): string {
    if (!this._config) {
      return "mdi:circle";
    }

    const id = button.id ?? "";
    if (id === "fan") {
      return iconFor(this._config, "fan");
    }

    return iconFor(this._config, id, "mdi:circle");
  }

  private async _handleButton(button: SmartAcButtonConfig): Promise<void> {
    if (!this._hass || !this._config) {
      return;
    }

    const buttonId = button.id ?? button.name ?? "custom";
    const action = getActionForButton(this._config, button);
    if (button.select_entity) {
      this._openSelectButtonId = this._openSelectButtonId === buttonId ? undefined : buttonId;
      return;
    }

    if (!action) {
      return;
    }

    if (this._needsOpenWindowConfirmation(button) && !window.confirm("Fenster ist auf!!!")) {
      return;
    }

    this._runningButton = buttonId;
    try {
      await executeActions(this._hass, action);
    } catch (error) {
      // Surface action failures without leaving the button in a busy state.
      console.error("Smart AC Card action failed", { button, action, error });
    } finally {
      this._runningButton = undefined;
    }
  }

  private _selectButtonActive(button: SmartAcButtonConfig): boolean {
    if (!this._hass || !button.select_entity) {
      return false;
    }

    const value = this._hass.states[button.select_entity]?.state;
    return Boolean(value && !["off", "none", "unknown", "unavailable"].includes(value.toLowerCase()));
  }

  private _selectOptions(button: SmartAcButtonConfig): string[] {
    if (!this._hass || !button.select_entity) {
      return [];
    }

    const stateObj = this._hass.states[button.select_entity];
    const options = stateObj?.attributes.options;
    return Array.isArray(options) ? options.map((option) => String(option)) : [];
  }

  private _selectValue(button: SmartAcButtonConfig): string | undefined {
    return button.select_entity ? this._hass?.states[button.select_entity]?.state : undefined;
  }

  private async _setSelectButtonValue(button: SmartAcButtonConfig, option: string): Promise<void> {
    if (!this._hass || !button.select_entity || !option) {
      return;
    }

    const entityId = button.select_entity;
    const domain = entityId.split(".")[0] ?? "";
    this._openSelectButtonId = undefined;

    if (domain === "select" || domain === "input_select") {
      await this._hass.callService(domain, "select_option", { option }, { entity_id: entityId });
      return;
    }

    await this._hass.callService(domain, "set_value", { value: option }, { entity_id: entityId });
  }

  private _needsOpenWindowConfirmation(button: SmartAcButtonConfig): boolean {
    return this._windowOpen() && ["power_on", "cool", "heat"].includes(String(button.id));
  }

  private async _changeTargetTemperature(direction: -1 | 1): Promise<void> {
    if (!this._hass || !this._config) {
      return;
    }

    const entityId = this._config.target_temperature_entity ?? this._config.status_entity;
    const stateObj = entityId ? this._hass.states[entityId] : undefined;
    const currentValue = targetTemperatureValue(this._hass, this._config);
    if (!entityId || !stateObj || currentValue === undefined) {
      return;
    }

    const step = this._config.target_temperature_step ?? 0.5;
    const nextValue = Math.round((currentValue + direction * step) * 10) / 10;
    const domain = entityId.split(".")[0] ?? "";
    const attribute = this._config.target_temperature_attribute ?? "temperature";

    if (domain === "input_number" || domain === "number") {
      await this._hass.callService(domain, "set_value", { value: nextValue }, { entity_id: entityId });
      return;
    }

    if (domain === "climate") {
      await this._hass.callService(
        "climate",
        "set_temperature",
        { [attribute === "state" ? "temperature" : attribute]: nextValue },
        { entity_id: entityId },
      );
      return;
    }

    await this._hass.callService(domain, "set_value", { value: nextValue }, { entity_id: entityId });
  }

  private _openTemperatureDetails(): void {
    if (!this._config?.temperature_entity) {
      return;
    }

    fireEvent(this, "hass-more-info", { entityId: this._config.temperature_entity });
  }

  private _openWindowDetails(): void {
    if (!this._config?.window_entity) {
      return;
    }

    fireEvent(this, "hass-more-info", { entityId: this._config.window_entity });
  }

  private _statusHints(status: SmartAcStatus): string[] {
    const hints: string[] = [];
    const scheduleHint = this._scheduleHint(status);
    if (scheduleHint) {
      hints.push(scheduleHint);
    }

    if (this._windowOpen()) {
      hints.push(localize(this._hass, "window_is_open"));
    }

    return hints;
  }

  private _scheduleHint(status: SmartAcStatus): string | undefined {
    if (!this._hass || !this._config?.popup) {
      return undefined;
    }

    const popup = this._config.popup;
    if (
      status === "off" &&
      this._entityIsOn(popup.autostart_entity) &&
      popup.autostart_time_entity
    ) {
      const time = this._formattedTime(popup.autostart_time_entity);
      return time ? `${localize(this._hass, "starts_at")} ${time}` : undefined;
    }

    const isRunning = !["off", "offline", "unknown"].includes(status);
    if (isRunning && this._entityIsOn(popup.sleep_auto_entity) && popup.sleep_time_entity) {
      const time = this._formattedTime(popup.sleep_time_entity);
      return time ? `${localize(this._hass, "sleep_starts_at")} ${time}` : undefined;
    }

    return undefined;
  }

  private _windowOpen(): boolean {
    if (!this._hass || !this._config?.window_entity) {
      return false;
    }

    const state = this._hass.states[this._config.window_entity]?.state.toLowerCase();
    return Boolean(state && ["on", "open", "opening", "tilted"].includes(state));
  }

  private _entityIsOn(entityId?: string): boolean {
    const state = entityId ? this._hass?.states[entityId]?.state : undefined;
    return state === "on";
  }

  private _formattedTime(entityId: string): string | undefined {
    const stateObj = this._hass?.states[entityId];
    const raw = stateObj?.state.includes(" ") ? stateObj.state.split(" ").at(-1) : stateObj?.state;
    const match = raw?.match(/^(\d{1,2}):(\d{2})/);
    if (!match) {
      return undefined;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return undefined;
    }

    return minutes === 0
      ? `${hours.toString()} Uhr`
      : `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} Uhr`;
  }

  private _openDialog(): void {
    if (!this._hass || !this._config) {
      return;
    }

    showSmartAcDialog(this, this._hass, this._config);
  }
}

customElements.define(CARD_TYPE, SmartAcCard);

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: CARD_TYPE,
  name: "Smart AC Card",
  description: "Configurable air conditioner control card.",
  preview: true,
});

export { SmartAcCard };
