import { BlockLevelE, PlatformT } from "../../types";
import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";

export const CATEGORY_NAME = "%{BKY_CAT_PORTS}";
export const CATEGORY_COLOR = 180;
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.BEGINNER;
export const CATEGORY_ORDER = 2;

/** HIGH/LOW dropdown for inout_onoff shadow block */
export function getHighLowOptions(): [string, string][] {
  return [
    ["1 HIGH", "HIGH"],
    ["0 LOW", "LOW"],
  ];
}

/** Interrupt mode dropdown options */
export function getInterruptModeOptions(): [string, string][] {
  return [
    ["rising edge", "RISING"],
    ["falling edge", "FALLING"],
    ["changing state", "CHANGE"],
    ["HIGH state", "HIGH"],
    ["LOW state", "LOW"],
  ];
}

/** Pulse direction dropdown (UP/DOWN) */
export function getPulseDirectionOptions(): [string, string][] {
  return [
    ["UP", "HIGH"],
    ["DOWN", "LOW"],
  ];
}
