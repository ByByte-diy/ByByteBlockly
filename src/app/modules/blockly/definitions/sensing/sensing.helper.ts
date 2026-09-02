import * as Blockly from "blockly";
import {
  applyDefaultDropdownFields,
  getAllPins,
  getAnalogPins,
  getCurrentBoardId,
  getDigitalPins,
  getInterruptPins,
} from "@app/modules/device/helpers/device-board-globals.helper";
import { createBlockIconField as createBlockIconFieldImpl } from "../../lib/helpers/block-icon.helper";
import type { BlockIconSize } from "../../lib/helpers/block-icon.helper";
import { MRTNODE_BOARD_IDS } from "./config";

export { createBlockIconFieldImpl as createBlockIconField };
export type { BlockIconSize };

/** Localized sensing block label with English fallback. */
export function sensingLabel(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

export function valuePercentOptions(): [string, string][] {
  return [
    [sensingLabel("VALUE", "0-1023"), "1"],
    [sensingLabel("PERCENT", "0-100%"), "0"],
  ];
}

export function createAnalogPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getAnalogPins);
}

export function createDigitalPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getDigitalPins);
}

export function createAllPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getAllPins);
}

export function createInterruptPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getInterruptPins);
}

export function applyDefaultInterruptPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getInterruptPins);
}

/** True when block is chained under base_setup / base_setup_loop DO input. */
export function isInSetupSection(block: Blockly.Block): boolean {
  const root = block.getSurroundParent();
  if (!root || (root.type !== "base_setup_loop" && root.type !== "base_setup")) {
    return false;
  }
  let sibling = root.getInputTargetBlock("DO");
  while (sibling) {
    if (sibling.id === block.id) {
      return true;
    }
    sibling = sibling.getNextBlock();
  }
  return false;
}

export function applyDefaultAnalogPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getAnalogPins);
}

export function applyDefaultAllPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getAllPins);
}

/** ESP32 MRTnode uses 10-bit analog resolution (legacy sensors.js). */
export function ensureMrtnodeAnalogResolution(generator: any): void {
  if (MRTNODE_BOARD_IDS.includes(getCurrentBoardId() as (typeof MRTNODE_BOARD_IDS)[number])) {
    generator.setups_["setup_analogResolutionESP32"] =
      "analogReadResolution(10);\n";
  }
}

export function analogReadExpression(pin: string, outputValue: string): string {
  if (outputValue === "0") {
    return `map(analogRead(${pin}),0,1023,0,100)`;
  }
  return `analogRead(${pin})`;
}

/** Inverted 0–100% mapping (water level, soil moisture, vapor). */
export function analogReadInvertedExpression(
  pin: string,
  outputValue: string
): string {
  if (outputValue === "0") {
    return `map(analogRead(${pin}),0,1023,100,0)`;
  }
  return `analogRead(${pin})`;
}

export function registerDigitalInputSetup(
  generator: any,
  prefix: string,
  pin: string
): void {
  generator.setups_[`${prefix}_${pin}`] = `pinMode(${pin}, INPUT);`;
}

export function registerPullupInputSetup(
  generator: any,
  prefix: string,
  pin: string
): void {
  generator.setups_[`${prefix}_${pin}`] = `pinMode(${pin}, INPUT_PULLUP);`;
}
