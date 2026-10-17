import type { HomeAssistant, SmartAcAction, SmartAcActionConfig } from "./types";

export async function executeActions(
  hass: HomeAssistant,
  actionConfig?: SmartAcActionConfig,
): Promise<void> {
  if (!actionConfig) {
    return;
  }

  const actions = Array.isArray(actionConfig) ? actionConfig : [actionConfig];
  for (const action of actions) {
    await executeAction(hass, action);
  }
}

async function executeAction(hass: HomeAssistant, action: SmartAcAction): Promise<void> {
  const serviceAction = action.perform_action ?? action.service ?? action.action;
  const isServiceAction =
    action.action === "call-service" || action.action === "perform-action" || serviceAction.includes(".");

  if (!isServiceAction || !serviceAction.includes(".")) {
    throw new Error(`Invalid action "${action.action}". Expected "domain.service".`);
  }

  const [domain, service] = serviceAction.split(".", 2) as [string, string];
  const serviceData = { ...(action.data ?? action.service_data ?? {}) };
  const entityId = action.target?.entity_id;

  if (entityId !== undefined && serviceData.entity_id === undefined) {
    serviceData.entity_id = entityId;
  }

  if (domain === "script" && service === "turn_on") {
    normalizeScriptTurnOnData(serviceData);
  }

  await hass.callService(domain, service, serviceData, action.target);
}

function normalizeScriptTurnOnData(serviceData: Record<string, any>): void {
  const variableKeys = Object.keys(serviceData).filter(
    (key) => key !== "entity_id" && key !== "variables",
  );
  if (variableKeys.length === 0) {
    return;
  }

  serviceData.variables = {
    ...(typeof serviceData.variables === "object" && serviceData.variables ? serviceData.variables : {}),
    ...Object.fromEntries(variableKeys.map((key) => [key, serviceData[key]])),
  };

  variableKeys.forEach((key) => {
    delete serviceData[key];
  });
}
