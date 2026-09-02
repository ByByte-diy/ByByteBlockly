import * as Blockly from "blockly";
import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import { BlockLevelE, PlatformT } from "../../types";
import { initBlockLabel } from "../../lib/helpers/block-label.helper";
import {
  applyDefaultDropdownFields,
  getDigitalPins,
} from "@app/modules/device/helpers/device-board-globals.helper";

export const CATEGORY_NAME = "%{BKY_CAT_COMMUNICATION}";
export const CATEGORY_COLOUR = "#0060aa";
export const CATEGORY_PLATFORMS: PlatformT[] = ["arduino"];
export const TOOLBOX_LEVEL = BlockLevelE.INTERMEDIATE;
export const KEYBOARD_LEVEL = BlockLevelE.ADVANCED;
export const MUVISION_LEVEL = BlockLevelE.ADVANCED;
export const CATEGORY_ORDER = 10;

export const SERIAL_CATEGORY = "%{BKY_CAT_COMMUNICATION_SERIAL}";
export const SOFT_SERIAL_CATEGORY = "%{BKY_CAT_COMMUNICATION_SOFTSERIAL}";
export const BLUETOOTH_CATEGORY = "%{BKY_CAT_COMMUNICATION_BLUETOOTH}";
export const REMOTE_CATEGORY = "%{BKY_CAT_COMMUNICATION_REMOTE}";
export const KEYBOARD_CATEGORY = "%{BKY_CAT_COMMUNICATION_KEYBOARD}";
export const MUVISION_CATEGORY = "%{BKY_CAT_COMMUNICATION_MUVISION}";

/** Legacy keyboard/mouse category colour */
export const KEYBOARD_COLOUR = "#54BCF7";

/** Mu Vision blocks are available on all registered boards */
export const MUVISION_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];

/** Native USB HID keyboard/mouse (32u4 / SAMD) */
export const KEYBOARD_HID_BOARD_IDS = [
  "leonardo",
  "micro",
  "mkrwifi1010",
  "yun",
  "uno_bt",
  "mrtx",
  "uno_mrtx",
] as const;

/** BLE keyboard/mouse via BleKeyboard / BleMouse (ESP32) */
export const KEYBOARD_BLE_BOARD_IDS = [
  "esp32",
  "MRTnode",
  "Ottoky",
  "OttoESP",
] as const;

export const DEFAULT_BAUD_RATE = "9600";
/** Standard HC-05/HC-06 SoftwareSerial wiring on Uno (logical D2/D3) */
export const DEFAULT_BT_TX_PIN = "D2";
export const DEFAULT_BT_RX_PIN = "D3";
/** Default IR receiver pin (logical D10) */
export const DEFAULT_IR_PIN = "D10";

export const BAUD_OPTIONS: [string, string][] = [
  ["1200", "1200"],
  ["2400", "2400"],
  ["4800", "4800"],
  ["9600", "9600"],
  ["19200", "19200"],
  ["38400", "38400"],
  ["57600", "57600"],
  ["115200", "115200"],
];

/** Baud dropdown with 9600 selected by default. */
export function createBaudDropdownField(): Blockly.FieldDropdown {
  const field = new Blockly.FieldDropdown(BAUD_OPTIONS);
  field.setValue(DEFAULT_BAUD_RATE);
  return field;
}

export const PRINT_FORMAT_OPTIONS: [string, string][] = [
  ["DEC", "DEC"],
  ["HEX", "HEX"],
  ["BIN", "BIN"],
  ["OCT", "OCT"],
];

export const MRT_CHANNEL_OPTIONS: [string, string][] = [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
  ["5", "5"],
  ["6", "6"],
  ["7", "7"],
  ["8", "8"],
];

export const IR_REMOTE_KEY_OPTIONS: [string, string][] = [
  ["⬆", "0x00FF629D"],
  ["⬇", "0x00FFA857"],
  ["⬅", "0x00FF22DD"],
  ["➡", "0x00FFC23D"],
  ["OK", "0x00FF02FD"],
  ["1", "0x00FF6897"],
  ["2", "0x00FF9867"],
  ["3", "0x00FFB04F"],
  ["4", "0x00FF30CF"],
  ["5", "0x00FF18E7"],
  ["6", "0x00FF7A85"],
  ["7", "0x00FF10EF"],
  ["8", "0x00FF38C7"],
  ["9", "0x00FF5AA5"],
  ["0", "0x00FF4AB5"],
  ["*", "0x00FF42BD"],
  ["#", "0x00FF52AD"],
];

/** Localized block label with English fallback. */
export function commBlockLabel(key: string, fallback: string): string {
  return initBlockLabel(key, fallback);
}

export { createBlockIconField } from "../../lib/helpers/block-icon.helper";

/** Apply digital pin defaults using D-labels (D2, D10, …). */
export function applyCommDefaultPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getDigitalPins);
}

export const IR_MRT_KEY_OPTIONS: [string, string][] = [
  ["UP", "0x1FC3"],
  ["DOWN", "0x1F"],
  ["LEFT", "0x07"],
  ["RIGHT", "0x73"],
  ["UP and LEFT", "0x7C3"],
  ["UP and RIGHT", "0x7F"],
  ["DOWN and LEFT", "0x70F"],
  ["DOWN and RIGHT", "0x1CF"],
  ["F1", "0x7CF"],
  ["F2", "0x1C3F"],
  ["F3", "0x7F3"],
  ["F4", "0x1CCF"],
  ["F5", "0x1F0F"],
  ["F6", "0x703"],
  ["OFF", "0x733"],
];
