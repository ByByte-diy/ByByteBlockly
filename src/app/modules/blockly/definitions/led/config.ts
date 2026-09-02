import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import { BLOCK_COLORS } from "../../constants/blockly.constants";
import { BlockLevelE, PlatformT } from "../../types";

export const CATEGORY_NAME = "%{BKY_CAT_LED}";
export const BASIC_CATEGORY = "%{BKY_CAT_LED_BASIC}";
export const RGB_CATEGORY = "%{BKY_CAT_LED_RGB}";
export const NEOPIXEL_CATEGORY = "%{BKY_CAT_LED_NEOPIXEL}";
export const NEOMATRIX_CATEGORY = "%{BKY_CAT_LED_NEOMATRIX}";
export const MATRIX_CATEGORY = "%{BKY_CAT_LED_MATRIX}";

export const CATEGORY_COLOR = BLOCK_COLORS.DISPLAY;
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.BEGINNER;
export const BASIC_LEVEL = BlockLevelE.INTERMEDIATE;
export const RGB_LEVEL = BlockLevelE.ADVANCED;
export const NEOPIXEL_LEVEL = BlockLevelE.ADVANCED;
export const NEOMATRIX_LEVEL = BlockLevelE.BEGINNER;
export const MATRIX_LEVEL = BlockLevelE.BEGINNER;
export const CATEGORY_ORDER = 13;

export const MRTX_BOARD_IDS = ["uno_mrtx", "mrtx"] as const;

export const LED_NUMBER_OPTIONS: [string, string][] = [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
  ["5", "5"],
  ["6", "6"],
  ["7", "7"],
  ["8", "8"],
  ["9", "9"],
  ["10", "10"],
];

export const MAX7219_DISPLAY_COUNT_OPTIONS: [string, string][] = [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
];

export const MAX7219_DISPLAY_INDEX_OPTIONS: [string, string][] = [
  ["1", "0"],
  ["2", "1"],
  ["3", "2"],
  ["4", "3"],
];

export const ON_OFF_OPTIONS: [string, string][] = [
  ["ON", "HIGH"],
  ["OFF", "LOW"],
];

export const BLINK_SPEED_OPTIONS: [string, string][] = [
  ["normal", "1000"],
  ["slow", "2000"],
  ["very slow", "5000"],
  ["fast", "500"],
  ["very fast", "200"],
];

export const MAX7219_SHUTDOWN_OPTIONS: [string, string][] = [
  ["ON", "false"],
  ["OFF", "true"],
];

export const MAX7219_LED_POWER_OPTIONS: [string, string][] = [
  ["ON", "true"],
  ["OFF", "false"],
];

export const OTTO_MOVE_SPEED_OPTIONS: [string, string][] = [
  ["normal", "1000"],
  ["slow", "2000"],
  ["very slow", "3000"],
  ["fast", "750"],
  ["very fast", "500"],
  ["way to fast", "250"],
];

/** Typical MAX7219 wiring on Uno (DIN, CLK, CS) */
export const DEFAULT_MAX7219_PINS = {
  CLK: "D13",
  CS: "D10",
  DAT: "D11",
} as const;
