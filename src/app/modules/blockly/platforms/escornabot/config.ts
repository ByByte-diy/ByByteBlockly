import { BlockLevelE, PlatformT } from "../../types";
import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";

/** Toolbox category (translation key added in a later phase). */
export const CATEGORY_NAME = "%{BKY_CAT_ROBOT_ESCORNABOT}";

/** Legacy: escornabot blocks live under CAT_OTTO in toolbox_arduino_all.xml for all AVR boards. */
export const ESCORNABOT_BOARD_IDS = ["OttoESP"] as const;

/** Legacy movement block colour from escornabot.js */
export const MOVEMENT_COLOR = "#4759F5";

/** Legacy sensor block colour from escornabot.js */
export const SENSOR_COLOR = "#C39BF2";

export const CATEGORY_COLOR = MOVEMENT_COLOR;
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.ADVANCED;
/** Same order as Otto robot container; subOrder set in pack registration. */
export const CATEGORY_ORDER = 14;
export const ESCORNABOT_SUB_ORDER = 5;

export const ROBOT_CONTAINER_CATEGORY = "%{BKY_CAT_ROBOT}";

/** From www/lang/Arduino_en.js Blockly.Msg.ESCORNABOT_MODE_CHOICE */
export const MODE_OPTIONS: [string, string][] = [
  ["Weak", ""],
  ["Strong", "(2)"],
  ["Medium", "(3)"],
];

/** From www/lang/Arduino_en.js Blockly.Msg.ESCORNABOT_SPIN_VELOCITY */
export const SPIN_VELOCITY_OPTIONS: [string, string][] = [
  ["Slow", "5"],
  ["Medium", "10"],
  ["Quick", "15"],
];

/** From www/lang/Arduino_en.js Blockly.Msg.ESCORNABOT_LED_CHOICE */
export const LED_OPTIONS: [string, string][] = [
  ["Forward", "1"],
  ["Backward", "3"],
  ["Left", "2"],
  ["Right", "4"],
];

/** From www/lang/Arduino_en.js Blockly.Msg.ESCORNABOT_BUTTON_SELECTED */
export const BUTTON_OPTIONS: [string, string][] = [
  ["Forward", "1"],
  ["Backward", "3"],
  ["Left", "2"],
  ["Right", "4"],
  ["Center", "5"],
];

export const ESCORNABOT_HELP_URL = "https://escornabot.com/es/index";
export const ESCORNABOT_APP_URL = "https://escornabot.com/es/descargas";
