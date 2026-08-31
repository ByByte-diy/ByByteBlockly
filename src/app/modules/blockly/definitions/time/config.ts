import { BlockLevelE, PlatformT } from "../../types";
import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";

export const CATEGORY_NAME = "%{BKY_CAT_TIME}";
export const CATEGORY_COLOR = 180;
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.BEGINNER;
export const CATEGORY_ORDER = 1;

/** Time unit dropdown options (label, value) */
export function getTimeUnitOptions(): [string, string][] {
  return [
    ["seconds", "s"],
    ["milliseconds", "m"],
    ["microseconds", "u"],
  ];
}

/** Pulse direction dropdown (UP/DOWN) */
export function getPulseDirectionOptions(): [string, string][] {
  return [
    ["UP", "HIGH"],
    ["DOWN", "LOW"],
  ];
}
