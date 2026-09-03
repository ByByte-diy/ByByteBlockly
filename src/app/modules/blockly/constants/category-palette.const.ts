import { categoryHue, CategoryHue } from "./category-colour.const";

/**
 * Colorblind-friendly toolbox palette (HSV hue only; S/V fixed by Blockly).
 *
 * Main categories are spaced ~15–30° apart on the hue wheel so adjacent
 * toolbox rows stay distinguishable for deuteranopia / protanopia.
 *
 * Preview hues: `node -e "const B=require('blockly'); console.log(B.utils.colour.hueToHex(HUE))"`
 */
export const CATEGORY_PALETTE = {
  /** Logic, conditions */
  LOGIC: 0,
  /** Keyboard / mouse (communication subcategory) */
  KEYBOARD: 340,
  /** Motors, servos, steppers */
  MOTORS: 30,
  /** Math, numbers */
  MATH: 45,
  /** GPIO, pins, ports */
  PORTS: 55,
  /** Arrays / lists */
  ARRAYS: 75,
  /** Control flow loops (standard Blockly) */
  LOOPS: 90,
  /** LED blocks */
  LED: 120,
  /** OLED, LCD, TFT */
  DISPLAYS: 140,
  /** Text / strings */
  TEXT: 170,
  /** Delay, millis, pulse */
  TIME: 180,
  /** EEPROM, persistent storage */
  STORAGE: 200,
  /** Serial, BT, IR, Mu Vision */
  COMMUNICATION: 215,
  /** Robot container + movement blocks */
  ROBOT: 230,
  /** Program structure, setup/loop */
  GENERIC: 245,
  /** WiFi, MQTT, cloud */
  IOT: 265,
  /** Distance, temperature, sensors */
  SENSING: 285,
  /** User functions (custom category) */
  FUNCTIONS: 300,
  /** Variables */
  VARIABLES: 315,
  /** Buzzer, MP3, radio */
  AUDIO: 330,
  /** ByByte robot platform */
  BYBYTE: 350,

  /** Otto / escornabot block-type accents (inside robot flyouts) */
  ROBOT_SOUND: 330,
  ROBOT_EEPROM: 100,
  ROBOT_SENSOR: 160,
  ROBOT_ESCORNABOT_SENSOR: 285,

  /** IoT HTML builder block accents */
  IOT_HTML_VAR: 45,
  IOT_HTML_TEXT: 330,
  IOT_HTML_ELEMENT: 245,
  IOT_HTML_TABLE: 200,
  IOT_HTML_STYLE: 120,
  IOT_HTML_FORM: 180,

  /** WiFi server async blocks (legacy accent) */
  IOT_WIFI_SERVER_ASYNC: 180,
} as const satisfies Record<string, CategoryHue>;

/** Normalize a palette entry (handy when deriving shades). */
export function paletteHue(key: keyof typeof CATEGORY_PALETTE): CategoryHue {
  return categoryHue(CATEGORY_PALETTE[key]);
}
