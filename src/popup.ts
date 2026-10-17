import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { DIALOG_TAG } from "./config";
import { dialogStyles } from "./styles";
import { localize } from "./localize";
import type {
  HassEntityState,
  HomeAssistant,
  SmartAcCardConfig,
  SmartAcHelperConfig,
  SmartAcHelperType,
  SmartAcPopupDialogParams,
} from "./types";

declare global {
  interface HTMLElementTagNameMap {
    "smart-ac-card-dialog": SmartAcCardDialog;
  }
}

@customElement(DIALOG_TAG)
class SmartAcCardDialog extends LitElement {
  static override styles = dialogStyles;

  @state() private _hass?: HomeAssistant;
  @state() private _config?: SmartAcCardConfig;
  @state() private _open = false;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  showDialog(params: SmartAcPopupDialogParams): void {
    this._hass = params.hass;
    this._config = params.config;
    this._open = true;
  }

  closeDialog(): void {
    if (!this._open) {
      return;
    }

    this._open = false;
    this._config = undefined;
    this.dispatchEvent(
      new CustomEvent("dialog-closed", {
        bubbles: true,
        composed: true,
        detail: { dialog: DIALOG_TAG },
      }),
    );
  }

  protected override render() {
    if (!this._open || !this._hass || !this._config) {
      return nothing;
    }

    const popup = this._config.popup ?? {};
    const title = popup.title ?? `${this._config.room ?? ""} ${this._config.name ?? ""}`.trim();
    const standardHelpers: SmartAcHelperConfig[] = [
      {
        entity: popup.cool_temperature_entity,
        name: localize(this._hass, "cool_temperature"),
      },
      {
        entity: popup.heat_temperature_entity,
        name: localize(this._hass, "heat_temperature"),
      },
      {
        entity: popup.autostart_entity,
        name: localize(this._hass, "autostart"),
      },
      {
        entity: popup.autostart_time_entity,
        name: localize(this._hass, "autostart_time"),
      },
      {
        entity: popup.sleep_auto_entity,
        name: localize(this._hass, "sleep_auto"),
      },
      {
        entity: popup.sleep_time_entity,
        name: localize(this._hass, "sleep_time"),
      },
    ]
      .filter((helper) => Boolean(helper.entity))
      .map((helper) => ({ entity: helper.entity as string, name: helper.name }));

    const extraHelpers = popup.helpers ?? [];

    return html`
      <ha-dialog
        open
        .heading=${title || localize(this._hass, "settings")}
        @closed=${this.closeDialog}
      >
        <div class="content">
          ${this._renderHelperSection(standardHelpers, false)}
          ${extraHelpers.length > 0
            ? html`
                <div class="section-title">${localize(this._hass, "helpers")}</div>
                ${this._renderHelperSection(extraHelpers, true)}
              `
            : nothing}
        </div>
        <mwc-button slot="primaryAction" dialogAction="close">Close</mwc-button>
      </ha-dialog>
    `;
  }

  private _renderHelperSection(helpers: SmartAcHelperConfig[], showEmpty = true) {
    if (!this._hass || helpers.length === 0) {
      return showEmpty ? html`<div class="empty">${localize(this._hass, "no_helpers")}</div>` : nothing;
    }

    return html`
      <div class="section">
        ${helpers.map((helper) => {
          const stateObj = this._hass?.states[helper.entity];
          return html`
            <div class="entity-row">
              <div class="helper-label">
                ${helper.icon ? html`<ha-icon .icon=${helper.icon}></ha-icon>` : nothing}
                <span>${helper.name ?? stateObj?.attributes.friendly_name ?? helper.entity}</span>
              </div>
              <div class="helper-control">${this._renderControl(helper, stateObj)}</div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderControl(helper: SmartAcHelperConfig, stateObj?: HassEntityState) {
    if (!stateObj) {
      return html`<span class="missing">${helper.entity}</span>`;
    }

    const type = helper.type ?? this._domain(helper.entity);
    if (type === "input_boolean" || type === "switch") {
      return html`
        <ha-switch
          .checked=${stateObj.state === "on"}
          @change=${(event: Event) =>
            this._setBoolean(helper.entity, (event.currentTarget as HTMLInputElement).checked)}
        ></ha-switch>
      `;
    }

    if (type === "input_datetime") {
      return this._renderTimeControl(helper.entity, stateObj);
    }

    if (type === "input_number" || type === "number") {
      return html`
        <input
          class="number-input"
          type="number"
          .value=${stateObj.state}
          min=${stateObj.attributes.min ?? nothing}
          max=${stateObj.attributes.max ?? nothing}
          step=${stateObj.attributes.step ?? 1}
          @change=${(event: Event) =>
            this._setNumber(helper.entity, Number((event.currentTarget as HTMLInputElement).value))}
        />
      `;
    }

    if (type === "select") {
      const options = (stateObj.attributes.options ?? []) as string[];
      return html`
        <select
          class="select-input"
          .value=${stateObj.state}
          @change=${(event: Event) =>
            this._setSelect(helper.entity, (event.currentTarget as HTMLSelectElement).value)}
        >
          ${options.map((option) => html`<option value=${option}>${option}</option>`)}
        </select>
      `;
    }

    if (type === "button") {
      return html`<button class="press-button" @click=${() => this._pressButton(helper.entity)}>Press</button>`;
    }

    return html`<span class="state-value">${this._hass?.formatEntityState?.(stateObj) ?? stateObj.state}</span>`;
  }

  private _renderTimeControl(entity: string, stateObj: HassEntityState) {
    const value = this._timeFromState(stateObj);
    return html`
      <div class="time-control">
        <button class="step-button" @click=${() => this._stepTime(entity, value, 5)}>▲</button>
        <input
          class="time-input"
          type="time"
          .value=${value}
          @change=${(event: Event) =>
            this._setTime(entity, (event.currentTarget as HTMLInputElement).value)}
        />
        <button class="step-button" @click=${() => this._stepTime(entity, value, -5)}>▼</button>
      </div>
    `;
  }

  private _domain(entity: string): SmartAcHelperType | string {
    return entity.split(".", 1)[0] ?? "";
  }

  private async _setBoolean(entity: string, checked: boolean): Promise<void> {
    const domain = this._domain(entity);
    await this._hass?.callService(domain, checked ? "turn_on" : "turn_off", {}, { entity_id: entity });
  }

  private async _setNumber(entity: string, value: number): Promise<void> {
    if (!Number.isFinite(value)) {
      return;
    }

    const domain = this._domain(entity);
    await this._hass?.callService(domain, "set_value", { value }, { entity_id: entity });
  }

  private async _setSelect(entity: string, option: string): Promise<void> {
    await this._hass?.callService("select", "select_option", { option }, { entity_id: entity });
  }

  private async _pressButton(entity: string): Promise<void> {
    await this._hass?.callService("button", "press", {}, { entity_id: entity });
  }

  private async _setTime(entity: string, time: string): Promise<void> {
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return;
    }

    await this._hass?.callService("input_datetime", "set_datetime", { time: `${time}:00` }, { entity_id: entity });
  }

  private _stepTime(entity: string, value: string, minutes: number): void {
    const [hoursText, minutesText] = value.split(":");
    const hours = Number(hoursText);
    const currentMinutes = Number(minutesText);
    if (!Number.isFinite(hours) || !Number.isFinite(currentMinutes)) {
      return;
    }

    const dayMinutes = 24 * 60;
    const next = (hours * 60 + currentMinutes + minutes + dayMinutes) % dayMinutes;
    const nextHours = Math.floor(next / 60)
      .toString()
      .padStart(2, "0");
    const nextMinutes = (next % 60).toString().padStart(2, "0");
    void this._setTime(entity, `${nextHours}:${nextMinutes}`);
  }

  private _timeFromState(stateObj: HassEntityState): string {
    const raw = stateObj.state.includes(" ") ? stateObj.state.split(" ").at(-1) : stateObj.state;
    const match = raw?.match(/^(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : "00:00";
  }
}

export { SmartAcCardDialog };
