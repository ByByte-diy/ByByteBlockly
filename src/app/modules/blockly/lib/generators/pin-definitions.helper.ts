/**
 * Pin constants for Arduino codegen.
 * Use #define (not const int) to avoid RAM usage on AVR MCUs.
 */

import { withSectionComment } from "./codegen-sections.helper";

export type PinDefineMap = Record<string, string>;

/** Single pin macro: `#define name value` */
export function formatPinDefine(name: string, pin: string): string {
  return `#define ${name} ${pin}`;
}

/** Multiple pin macros in a commented block */
export function formatPinDefines(
  pins: PinDefineMap,
  description = "Pin numbers for wiring (change to match your setup)."
): string {
  const body = Object.entries(pins)
    .map(([name, pin]) => formatPinDefine(name, pin))
    .join("\n");
  return withSectionComment(
    "--- Pin constants (#define) ---",
    description,
    body
  );
}

/** Register pin macros in generator definitions_ */
export function registerPinDefines(
  generator: any,
  key: string,
  pins: PinDefineMap,
  description?: string
): void {
  generator.definitions_[key] = formatPinDefines(pins, description);
}

/** Single pinMode() line for statement-block codegen. */
export function formatPinMode(
  pin: string,
  mode: "INPUT" | "OUTPUT" | "INPUT_PULLUP"
): string {
  return `pinMode(${pin}, ${mode});\n`;
}

/** pinMode() lines for pin macros (L298N, DRV8833, etc.). */
export function formatPinModesFromMacros(
  macroNames: readonly string[],
  mode: "INPUT" | "OUTPUT" | "INPUT_PULLUP"
): string {
  return macroNames.map((macro) => formatPinMode(macro, mode)).join("");
}
