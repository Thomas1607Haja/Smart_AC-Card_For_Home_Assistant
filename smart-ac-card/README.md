# Smart AC Card

`smart-ac-card` is a modern Home Assistant custom card for air conditioner workflows. It is built with TypeScript and Lit, works without Browser Mod, and uses Home Assistant dialogs and entity rows for its popup UI.

## Features

- Home Assistant 2025.x compatible custom Lovelace card
- Fully configurable YAML setup
- Visual editor with entity, icon, and color pickers
- Visual editor support for button names, button visibility, per-button status entities, select-value buttons, and multiple interactions per built-in button
- Temperature source can be any entity, not only a climate entity
- Clicking the current temperature opens Home Assistant's native entity details dialog
- Optional target temperature setpoint row with inline step controls
- Optional schedule hint for autostart and automatic sleep mode based on popup helpers
- Optional window state indicator with configurable open/closed icons and open color
- Buttons execute arbitrary Home Assistant service actions or set values on select entities
- Multiple actions can run sequentially
- Native-looking Light and Dark theme support
- CSS variable based customization
- Optional animations for cooling, heating, fan, vertical swing, and night mode
- HACS compatible repository layout
- Small card version indicator in the lower-right corner

## Installation

### HACS

1. Add this repository as a custom repository in HACS.
2. Select category `Dashboard`.
3. Install `Smart AC Card`.
4. Add the resource if HACS does not add it automatically:

```yaml
url: /hacsfiles/smart-ac-card/dist/smart-ac-card.js
type: module
```

### Manual

1. Run `npm install`.
2. Run `npm run build`.
3. Copy `dist/smart-ac-card.js` to `www/community/smart-ac-card/smart-ac-card.js`.
4. Add the Lovelace resource:

```yaml
url: /local/community/smart-ac-card/smart-ac-card.js
type: module
```

## Full YAML Example

```yaml
type: custom:smart-ac-card
room: Bedroom
name: Mitsubishi AC
temperature_entity: sensor.bedroom_temperature
window_entity: binary_sensor.bedroom_window
status_entity: sensor.bedroom_ac_status
status_attribute: mode
target_temperature_label: Target
target_temperature_entity: climate.bedroom_ac
target_temperature_attribute: temperature
target_temperature_step: 0.5
unit: °C

colors:
  cool: "#2196f3"
  heat: "#ff7043"
  off: "#9e9e9e"
  sleep: "#5c6bc0"
  online: "var(--primary-color)"
  offline: "var(--error-color)"
  window_open: "var(--warning-color)"
  feature_active: "var(--warning-color)"
  feature_inactive: "var(--disabled-text-color)"
  button_background: "var(--ha-card-background, var(--card-background-color))"
  button_text: "var(--primary-text-color)"

icons:
  power: mdi:power
  off: mdi:power-off
  cool: mdi:snowflake
  heat: mdi:fire
  sleep: mdi:weather-night
  fan: mdi:fan
  swing_vertical: mdi:arrow-up-down
  display: mdi:monitor
  buzzer: mdi:bell-ring
  settings: mdi:cog
  window_open: mdi:window-open-variant
  window_closed: mdi:window-closed-variant

animations:
  enabled: true
  cool: true
  heat: true
  fan: true
  swing: true
  sleep: true

power_on_action:
  action: climate.turn_on
  target:
    entity_id: climate.bedroom_ac

power_off_action:
  action: climate.turn_off
  target:
    entity_id: climate.bedroom_ac

cool_action:
  - action: climate.set_hvac_mode
    target:
      entity_id: climate.bedroom_ac
    data:
      hvac_mode: cool
  - action: climate.set_temperature
    target:
      entity_id: climate.bedroom_ac
    data:
      temperature: 23

heat_action:
  - action: climate.set_hvac_mode
    target:
      entity_id: climate.bedroom_ac
    data:
      hvac_mode: heat
  - action: climate.set_temperature
    target:
      entity_id: climate.bedroom_ac
    data:
      temperature: 21

sleep_action:
  action: script.turn_on
  target:
    entity_id: script.bedroom_ac_sleep_mode

display_action:
  action: switch.toggle
  target:
    entity_id: switch.bedroom_ac_display

buzzer_action:
  action: switch.toggle
  target:
    entity_id: switch.bedroom_ac_buzzer

buttons:
  - id: power_on
    name: On
  - id: power_off
    name: Off
  - id: cool
    name: Cool
  - id: heat
    name: Heat
  - id: sleep
    name: Night
  - id: fan
    name: Fan
    select_entity: select.bedroom_ac_fan_mode
  - id: swing_vertical
    name: Swing
    select_entity: select.bedroom_ac_vertical_swing
  - id: display
    name: Display
  - id: buzzer
    name: Buzzer

popup:
  title: Bedroom AC Settings
  cool_temperature_entity: input_number.bedroom_ac_default_cool_temperature
  heat_temperature_entity: input_number.bedroom_ac_default_heat_temperature
  autostart_entity: input_boolean.bedroom_ac_autostart
  autostart_time_entity: input_datetime.bedroom_ac_autostart_time
  sleep_auto_entity: input_boolean.bedroom_ac_sleep_auto
  sleep_time_entity: input_datetime.bedroom_ac_sleep_time
  helpers:
    - entity: input_boolean.bedroom_ac_quiet_mode
      name: Quiet mode
      icon: mdi:volume-low
    - entity: select.bedroom_ac_profile
      name: Profile
      icon: mdi:tune
    - entity: switch.bedroom_ac_display
      name: Display light
      icon: mdi:television-ambient-light
    - entity: button.bedroom_ac_filter_reset
      name: Reset filter reminder
      icon: mdi:air-filter
```

## Actions

Every button can execute any Home Assistant service action. Use a single action object or a list of action objects. Lists run in order. The visual editor uses Home Assistant's action editor where available, so scripts can be selected as actions. Each visual-editor interaction also includes a target entity picker and optional JSON data field.

```yaml
cool_action:
  - action: climate.set_hvac_mode
    target:
      entity_id: climate.bedroom_ac
    data:
      hvac_mode: cool
  - action: scene.turn_on
    target:
      entity_id: scene.bedroom_cooling_lights
```

You can also define fully custom buttons:

```yaml
buttons:
  - id: party_mode
    name: Party
    icon: mdi:party-popper
    color: "#e91e63"
    action:
      action: script.turn_on
      target:
        entity_id: script.bedroom_ac_party_mode
```

Buttons can also use their own status entity. This is useful when the action starts a script, but a separate helper tracks whether the mode is active.

```yaml
buttons:
  - id: sleep
    status_entity: input_boolean.bedroom_ac_sleep_active
    active_state: "on"
  - id: fan
    status_entity: select.bedroom_ac_fan_mode
    active_state: high
```

Built-in buttons can be hidden by setting `visible: false`. `On`, `Off`, `Cool`, and `Heat` are intended as the core controls and stay visible in the visual editor.

```yaml
buttons:
  - id: swing_vertical
    visible: false
  - id: fan
    visible: false
  - id: display
    visible: false
  - id: buzzer
    visible: false
```

`fan` and `swing_vertical` can open an inline select menu on the card. Set `select_entity` to a Home Assistant `select` or `input_select` entity.

```yaml
buttons:
  - id: fan
    name: Fan
    select_entity: select.bedroom_ac_fan_mode
  - id: swing_vertical
    name: Swing
    select_entity: select.bedroom_ac_vertical_swing
```

## Popup Controls

The settings popup uses inline controls where possible:

- `input_boolean` and `switch` toggle directly.
- `input_datetime` renders an inline time field with up/down step buttons.
- `input_number` and `number` render direct number inputs.
- `select` renders an inline dropdown.
- `button` renders a direct press button.

## CSS Variables

The card exposes these variables:

```css
--smart-ac-border-radius
--smart-ac-card-padding
--smart-ac-gap
--smart-ac-button-radius
--smart-ac-active-color
--smart-ac-active-tint
--smart-ac-button-background
--smart-ac-button-text
--smart-ac-window-open-color
--smart-ac-animation-speed
```

## Development

```bash
npm install
npm run dev
npm run build
npm run check
npm run lint
```

The build output is `dist/smart-ac-card.js`.
