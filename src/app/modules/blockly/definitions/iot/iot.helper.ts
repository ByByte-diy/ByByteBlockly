import * as Blockly from "blockly";
import { getCurrentBoardId } from "@app/modules/device/helpers/device-board-globals.helper";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
} from "../../lib/generators/codegen-sections.helper";

export { registerDefinition } from "../../lib/generators/codegen-sections.helper";
export { createBlockIconField } from "../../lib/helpers/block-icon.helper";

export function iotLabel(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

export function isOttoEspBoard(): boolean {
  return getCurrentBoardId() === "OttoESP";
}

export function ensureWifiInclude(generator: any): void {
  if (isOttoEspBoard() || getCurrentBoardId() === "esp8266") {
    registerInclude(generator, "ESP8266WiFi.h", "WiFi library for ESP8266.");
  } else {
    registerInclude(generator, "WiFi.h", "WiFi library for ESP32.");
  }
}

export function ensureHttpClientInclude(generator: any): void {
  registerInclude(generator, "WiFiClient.h", "WiFi client for HTTP requests.");
  registerInclude(
    generator,
    "ArduinoJson.h",
    "ArduinoJson for parsing API responses."
  );
  if (isOttoEspBoard()) {
    registerInclude(generator, "ESP8266HTTPClient.h", "HTTP client for ESP8266.");
  } else {
    registerInclude(generator, "HTTPClient.h", "HTTP client for ESP32.");
  }
}

/** Legacy OpenWeather API lang param from localStorage with English fallback. */
export function getOpenWeatherApiLang(): string {
  try {
    return (window.localStorage as Storage & { lang?: string }).lang || "en";
  } catch {
    return "en";
  }
}

/** Merge or replace a definition body entry. */
export function appendToDefinitionBody(
  generator: { definitions_: Record<string, string> },
  key: string,
  line: string,
  initialBody: string,
  comment: string
): void;
export function appendToDefinitionBody(
  generator: { definitions_: Record<string, string> },
  key: string,
  code: string,
  comment?: string
): void;
export function appendToDefinitionBody(
  generator: { definitions_: Record<string, string> },
  key: string,
  lineOrBody: string,
  initialBodyOrComment?: string,
  comment?: string
): void {
  if (comment !== undefined) {
    if (typeof generator.definitions_[key] === "undefined") {
      registerDefinition(generator, key, initialBodyOrComment!, comment);
      return;
    }
    const parts = generator.definitions_[key].split("}", 1);
    generator.definitions_[key] = parts[0] + lineOrBody + "}\n";
    return;
  }
  registerDefinition(
    generator,
    key,
    lineOrBody,
    initialBodyOrComment ?? ""
  );
}

export function registerSetup(
  generator: { setups_: Record<string, string> },
  key: string,
  code: string
): void {
  generator.setups_[key] = code;
}

export function registerGlobal(
  generator: { variables_: Record<string, string> },
  key: string,
  code: string,
  comment = ""
): void {
  if (comment) {
    registerGlobalVariable(generator, key, code, comment);
  } else {
    generator.variables_[key] = code;
  }
}

export function looseEscape(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/á/g, "&aacute;")
    .replace(/é/g, "&eacute;")
    .replace(/í/g, "&iacute;")
    .replace(/ó/g, "&oacute;")
    .replace(/ú/g, "&uacute;")
    .replace(/Á/g, "&Aacute;")
    .replace(/É/g, "&Eacute;")
    .replace(/Í/g, "&Iacute;")
    .replace(/Ó/g, "&Oacute;")
    .replace(/Ú/g, "&Uacute;")
    .replace(/Ñ/g, "&Ntilde;")
    .replace(/ñ/g, "&ntilde;")
    .replace(/Ú/g, "&Uacute;")
    .replace(/º/g, "&deg;");
}

export function CSSEscape(input: string): string {
  return input
    .replace(/;/g, "")
    .replace(/{/g, "")
    .replace(/}/g, "")
    .replace(/</g, "")
    .replace(/:/g, "");
}
