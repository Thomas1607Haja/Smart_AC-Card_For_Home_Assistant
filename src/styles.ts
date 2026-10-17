import { css } from "lit";
import { animationStyles } from "./animations";

export const cardStyles = [
  animationStyles,
  css`
    :host {
      display: block;
      --smart-ac-border-radius: var(--ha-card-border-radius, 12px);
      --smart-ac-card-padding: 18px;
      --smart-ac-gap: 12px;
      --smart-ac-button-radius: 10px;
      --smart-ac-active-color: var(--primary-color);
      --smart-ac-active-tint: color-mix(in srgb, var(--smart-ac-active-color) 14%, transparent);
      --smart-ac-button-background: var(--ha-card-background, var(--card-background-color));
      --smart-ac-button-text: var(--primary-text-color);
    }

    ha-card {
      overflow: hidden;
      border-radius: var(--smart-ac-border-radius);
      background:
        linear-gradient(135deg, var(--smart-ac-active-tint), transparent 58%),
        var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      transition:
        background 180ms ease,
        border-color 180ms ease,
        box-shadow 180ms ease;
    }

    .wrap {
      padding: var(--smart-ac-card-padding);
    }

    .header {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px;
      align-items: start;
      min-height: 42px;
    }

    .room {
      font-size: 0.92rem;
      color: var(--secondary-text-color);
      line-height: 1.2;
      overflow-wrap: anywhere;
    }

    .name {
      margin-top: 3px;
      font-size: 1.1rem;
      font-weight: 600;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }

    .settings-button {
      appearance: none;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--secondary-text-color);
      inline-size: 42px;
      block-size: 42px;
      display: inline-grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
    }

    .settings-button:hover {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .settings-button ha-icon {
      --mdc-icon-size: 24px;
    }

    .window-indicator {
      appearance: none;
      position: absolute;
      inset-block-start: 0;
      inset-inline-start: 50%;
      transform: translateX(-50%);
      inline-size: 42px;
      block-size: 42px;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--secondary-text-color);
      display: inline-grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
    }

    .window-indicator.open {
      color: var(--smart-ac-window-open-color, var(--warning-color, #ff9800));
      background: color-mix(in srgb, var(--smart-ac-window-open-color, var(--warning-color, #ff9800)) 12%, transparent);
    }

    .window-indicator:hover {
      background: var(--secondary-background-color);
    }

    .window-indicator ha-icon {
      --mdc-icon-size: 24px;
    }

    .temperature-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 14px;
      align-items: end;
      margin-top: 18px;
    }

    .temperature {
      font-size: clamp(2.8rem, 9vw, 4.7rem);
      line-height: 0.95;
      font-weight: 650;
      letter-spacing: 0;
      font-variant-numeric: tabular-nums;
    }

    .temperature-button {
      appearance: none;
      border: 0;
      background: transparent;
      color: var(--primary-text-color);
      padding: 0;
      text-align: left;
      cursor: pointer;
      font-family: inherit;
    }

    .temperature-button:hover {
      color: var(--primary-color);
    }

    .status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 34px;
      padding: 0 12px;
      border-radius: 999px;
      background: var(--smart-ac-active-tint);
      color: var(--smart-ac-active-color);
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .buttons {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--smart-ac-gap);
      margin-top: 18px;
    }

    .setpoint-row {
      margin-top: 16px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      min-height: 42px;
      border-top: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-bottom: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    }

    .setpoint-label {
      color: var(--secondary-text-color);
      font-size: 0.82rem;
      font-weight: 700;
    }

    .setpoint-control {
      display: inline-grid;
      grid-template-columns: 34px minmax(72px, auto) 34px;
      gap: 6px;
      align-items: center;
    }

    .setpoint-button {
      appearance: none;
      width: 34px;
      height: 34px;
      border: 1px solid var(--divider-color);
      border-radius: 50%;
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--smart-ac-active-color);
      display: grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
    }

    .setpoint-button[disabled] {
      opacity: 0.45;
      cursor: default;
    }

    .setpoint-button ha-icon {
      --mdc-icon-size: 22px;
    }

    .setpoint-value {
      color: var(--primary-text-color);
      font-size: 1rem;
      font-weight: 800;
      text-align: center;
      white-space: nowrap;
    }

    :host([wide]) .buttons {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .button-cell {
      position: relative;
      min-width: 0;
      display: grid;
      gap: 6px;
    }

    .action-button {
      appearance: none;
      position: relative;
      width: 100%;
      border: 1px solid var(--divider-color);
      border-radius: var(--smart-ac-button-radius);
      background: var(--smart-ac-button-background);
      color: var(--smart-ac-button-text);
      min-height: 70px;
      padding: 10px 8px;
      display: grid;
      grid-template-rows: 28px auto;
      align-items: center;
      justify-items: center;
      gap: 6px;
      cursor: pointer;
      font: inherit;
      transition:
        transform 120ms ease,
        border-color 120ms ease,
        background 120ms ease;
    }

    .action-button:hover {
      border-color: var(--smart-ac-active-color);
      background: var(--smart-ac-active-tint);
    }

    .action-button[data-active] {
      border-color: var(--smart-ac-active-color);
      background: var(--smart-ac-button-active-background, var(--smart-ac-active-tint));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--smart-ac-active-color) 32%, transparent);
    }

    .action-button.feature-button[data-active] {
      border-color: var(--divider-color);
      background: var(--smart-ac-button-background);
      box-shadow: none;
    }

    .action-button.feature-button:hover {
      border-color: var(--divider-color);
      background: var(--smart-ac-button-background);
    }

    .action-button:active {
      transform: scale(0.985);
    }

    .action-button[disabled] {
      cursor: default;
      opacity: 0.45;
    }

    .action-button ha-icon {
      color: var(--smart-ac-button-color, var(--smart-ac-active-color));
      --mdc-icon-size: 27px;
      transform-origin: center;
    }

    .action-button.feature-button ha-icon {
      color: var(--smart-ac-feature-inactive-color, var(--disabled-text-color));
    }

    .action-button.feature-button[data-active] ha-icon {
      color: var(--smart-ac-feature-active-color, var(--warning-color, #ff9800));
    }

    .action-button.feature-button:not([data-active])::after {
      position: absolute;
      top: 25px;
      width: 34px;
      height: 2px;
      content: "";
      background: var(--smart-ac-feature-inactive-color, var(--disabled-text-color));
      border-radius: 1px;
      transform: rotate(-45deg);
      pointer-events: none;
    }

    .action-label {
      max-width: 100%;
      color: var(--smart-ac-button-text);
      font-size: 0.84rem;
      font-weight: 600;
      line-height: 1.2;
      text-align: center;
      overflow-wrap: anywhere;
    }

    .button-select {
      width: 100%;
      min-height: 36px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 8px;
      font: inherit;
      font-size: 0.84rem;
    }

    .compact .buttons {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .compact .action-button {
      min-height: 58px;
      grid-template-rows: 24px auto;
    }

    .version {
      margin-top: 10px;
      color: var(--secondary-text-color);
      font-size: 0.66rem;
      line-height: 1;
      text-align: right;
      opacity: 0.62;
      user-select: none;
    }

    .schedule-hint {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      color: var(--secondary-text-color);
      font-size: 0.78rem;
      line-height: 1.3;
      text-align: left;
    }

    @media (max-width: 420px) {
      .wrap {
        padding: 16px;
      }

      .temperature-row {
        grid-template-columns: 1fr;
        align-items: start;
      }

      .buttons,
      :host([wide]) .buttons {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `,
];

export const dialogStyles = css`
  ha-dialog {
    --mdc-dialog-min-width: min(560px, calc(100vw - 24px));
    --mdc-dialog-max-width: min(640px, calc(100vw - 24px));
  }

  .content {
    width: 100%;
    max-width: 592px;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .section {
    padding: 6px 0;
  }

  .section-title {
    margin: 18px 0 8px;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .entity-row {
    min-height: 52px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, auto);
    gap: 14px;
    align-items: center;
    border-top: 1px solid var(--divider-color);
    max-width: 100%;
  }

  .helper-label {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 14px;
  }

  .helper-label ha-icon {
    color: var(--state-icon-color);
    --mdc-icon-size: 22px;
  }

  .helper-label span {
    overflow-wrap: anywhere;
  }

  .helper-control {
    min-width: 0;
    max-width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .number-input,
  .time-input,
  .select-input {
    min-height: 36px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    padding: 0 8px;
    font: inherit;
  }

  .number-input {
    width: min(96px, 100%);
  }

  .time-control {
    display: inline-grid;
    grid-template-columns: 30px minmax(0, 96px) 30px;
    gap: 6px;
    align-items: center;
    max-width: 100%;
  }

  .step-button,
  .press-button {
    min-height: 34px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
  }

  .step-button {
    width: 30px;
    padding: 0;
    line-height: 1;
  }

  .step-button ha-icon {
    --mdc-icon-size: 18px;
  }

  .press-button {
    padding: 0 12px;
  }

  .state-value,
  .missing {
    color: var(--secondary-text-color);
  }

  .empty {
    color: var(--secondary-text-color);
    padding: 12px 0;
  }

  @media (max-width: 520px) {
    .entity-row {
      grid-template-columns: 1fr;
      gap: 8px;
      padding: 10px 0;
    }

    .helper-control {
      justify-content: flex-start;
    }
  }
`;

export const editorStyles = css`
  :host {
    display: block;
  }

  .editor {
    display: grid;
    gap: 16px;
  }

  ha-form {
    display: block;
  }

  .group {
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    padding: 14px;
    display: grid;
    gap: 12px;
  }

  .button-config {
    display: grid;
    gap: 10px;
    padding-block: 8px;
    border-top: 1px solid var(--divider-color);
  }

  .title {
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .hint {
    color: var(--secondary-text-color);
    font-size: 0.86rem;
  }

  .field {
    display: grid;
    grid-template-columns: minmax(120px, 1fr) minmax(160px, 2fr);
    gap: 10px;
    align-items: center;
  }

  .field label {
    color: var(--secondary-text-color);
  }

  input[type="text"],
  input[type="color"],
  textarea {
    width: 100%;
    min-height: 40px;
    box-sizing: border-box;
  }

  textarea {
    resize: vertical;
    min-height: 72px;
    font-family: var(--code-font-family, monospace);
  }

  .action-editor {
    border-top: 1px solid var(--divider-color);
    padding-top: 12px;
    display: grid;
    gap: 10px;
  }

  .action-title {
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .interaction-list {
    display: grid;
    gap: 12px;
  }

  .interaction-item {
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--secondary-background-color);
    padding: 12px;
    display: grid;
    gap: 10px;
  }

  .interaction-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-weight: 600;
  }

  .interaction-field {
    grid-template-columns: minmax(120px, 1fr) minmax(180px, 2fr);
  }

  .add-action,
  .remove-action {
    min-height: 34px;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    font: inherit;
  }

  .add-action {
    justify-self: start;
    padding: 0 14px;
    background: color-mix(in srgb, var(--primary-color) 16%, transparent);
    color: var(--primary-color);
    font-weight: 700;
  }

  .remove-action {
    padding: 0 12px;
    background: transparent;
    color: var(--secondary-text-color);
  }

  .remove-action:hover {
    color: var(--error-color);
  }

  @media (max-width: 560px) {
    .field {
      grid-template-columns: 1fr;
    }
  }
`;
