import * as Blockly from "blockly";
import {
  applyDefaultDropdownFields,
  getAllPins,
  getDigitalPins,
} from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockDefinition } from "../../types/block.types";
import { CategoryHue } from "../../constants/category-colour.const";
import { OTTO_DIY_URL } from "./config";

export { createBlockIconField } from "../../lib/helpers/block-icon.helper";

export function ottoLabel(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

export function createOttoPinDropdown(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getAllPins);
}

export function createOttoDigitalPinDropdown(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getDigitalPins);
}

export function applyOttoDefaultPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getAllPins);
}

export function applyOttoDefaultDigitalPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getDigitalPins);
}

export function registerSetup(
  generator: { setups_: Record<string, string> },
  key: string,
  code: string
): void {
  generator.setups_[key] = code;
}

export function wrapOttoBlock(
  block: BlockDefinition,
  colour: CategoryHue,
  tooltip?: { key: string; fallback: string }
): void {
  const originalInit = block.init;
  block.init = function (this: Blockly.Block) {
    originalInit.call(this);
    this.setColour(colour);
    if (tooltip) {
      this.setTooltip(ottoLabel(tooltip.key, tooltip.fallback));
    }
    this.setHelpUrl(OTTO_DIY_URL);
  };
}
