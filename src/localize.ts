import type { HomeAssistant } from "./types";

const STRINGS: Record<string, Record<string, string>> = {
  en: {
    room: "Room",
    name: "AC name",
    temperature_entity: "Temperature entity",
    status_entity: "Status entity",
    status_attribute: "Status attribute",
    settings: "Settings",
    helpers: "Helpers",
    cool_temperature: "Default cooling temperature",
    heat_temperature: "Default heating temperature",
    autostart: "Autostart active",
    autostart_time: "Autostart time",
    sleep_auto: "Automatic sleep mode",
    sleep_time: "Sleep mode time",
    no_helpers: "No helpers configured",
    actions_hint: "Actions can be edited in YAML.",
    starts_at: "Starts at",
    sleep_starts_at: "Night mode starts at",
    window_open: "Window open",
    window_closed: "Window closed",
    window_is_open: "Window is open",
  },
  de: {
    room: "Raum",
    name: "Klimageraetname",
    temperature_entity: "Temperatur-Entity",
    status_entity: "Status-Entity",
    status_attribute: "Status-Attribut",
    settings: "Einstellungen",
    helpers: "Helfer",
    cool_temperature: "Standardtemperatur Kuehlen",
    heat_temperature: "Standardtemperatur Heizen",
    autostart: "Autostart aktiv",
    autostart_time: "Autostart Uhrzeit",
    sleep_auto: "Schlafmodus automatisch",
    sleep_time: "Schlafmodus Uhrzeit",
    no_helpers: "Keine Helfer konfiguriert",
    actions_hint: "Actions koennen in YAML bearbeitet werden.",
    starts_at: "Startet um",
    sleep_starts_at: "Nachtmodus wird aktiviert um",
    window_open: "Fenster geoeffnet",
    window_closed: "Fenster geschlossen",
    window_is_open: "Fenster ist geoeffnet",
  },
};

export function localize(hass: HomeAssistant | undefined, key: string): string {
  const language = hass?.locale?.language ?? hass?.language ?? "en";
  const shortLanguage = language.split("-")[0] ?? "en";
  return STRINGS[shortLanguage]?.[key] ?? STRINGS["en"]?.[key] ?? key;
}
