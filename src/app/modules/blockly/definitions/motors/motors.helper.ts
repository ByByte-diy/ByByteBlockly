import * as Blockly from "blockly";
import {
  applyDefaultDropdownFields,
  getAllPins,
  getAnalogPins,
  getDigitalPins,
  getPWMPins,
  resolveDropdownPinValue,
} from "@app/modules/device/helpers/device-board-globals.helper";
import {
  INIT_BLOCK_PREFIX,
  initBlockLabel,
} from "../../lib/helpers/block-label.helper";
import {
  registerGlobalVariable,
  registerInclude,
} from "../../lib/generators/codegen-sections.helper";

export { INIT_BLOCK_PREFIX, initBlockLabel };
export { createBlockIconField } from "../../lib/helpers/block-icon.helper";

/** Localized motor block label with English fallback. */
export function motorLabel(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

export function createPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getAllPins);
}

export function createPwmPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getPWMPins);
}

/** PWM pin dropdown with a pre-selected default (logical pin ref, e.g. D5). */
export function createDefaultPwmPinField(defaultPin: string): Blockly.FieldDropdown {
  const options = getPWMPins();
  const field = new Blockly.FieldDropdown(options);
  const resolved = resolveDropdownPinValue(options, defaultPin);
  if (resolved !== null) {
    field.setValue(resolved);
  }
  return field;
}

/** Apply PWM pin defaults (D5, D6, …) after fields are on the block. */
export function applyDefaultPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getPWMPins);
}

export function createAnalogPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getAnalogPins);
}

/** Apply digital pin defaults after fields are on the block. */
export function applyDefaultDigitalPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getDigitalPins);
}

/** L298N: PWM fields (ENA/ENB) + direction pins (IN1–IN4) with D-label defaults. */
export function applyDefaultL298nPinFields(
  block: Blockly.Block,
  defaults: {
    ENA: string;
    ENB: string;
    IN1: string;
    IN2: string;
    IN3: string;
    IN4: string;
  }
): void {
  applyDefaultDropdownFields(
    block,
    { ENA: defaults.ENA, ENB: defaults.ENB },
    getPWMPins
  );
  applyDefaultDropdownFields(
    block,
    {
      IN1: defaults.IN1,
      IN2: defaults.IN2,
      IN3: defaults.IN3,
      IN4: defaults.IN4,
    },
    getAllPins
  );
}

/** Register Servo.h and per-pin Servo instance; returns optional attach line for statements. */
export function ensureServoInstance(
  generator: any,
  pin: string,
  setupAttach?: string
): string {
  registerInclude(generator, "Servo.h", "Servo.h library — control a servo motor.");
  registerGlobalVariable(
    generator,
    `var_servo${pin}`,
    `Servo servo_${pin};`,
    `Servo object on pin ${pin}.`
  );
  return setupAttach ? `${setupAttach}\n` : "";
}
