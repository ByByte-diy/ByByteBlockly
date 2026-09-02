import * as Blockly from "blockly";
import { blockIconUrl } from "../../../lib/helpers/block-icon.helper";
import { commBlockLabel } from "../config";

export function keyboardLabel(key: string, fallback: string): string {
  return commBlockLabel(key, fallback);
}

export function createKeyboardIconField(
  filename: "keyboard.png" | "mouse.png"
): Blockly.FieldImage {
  return new Blockly.FieldImage(blockIconUrl(filename), 46, 38, "*");
}

export const KEY_FUNCTION_OPTIONS: [string, string][] = [
  ["Press key", "1"],
  ["Release", "2"],
  ["Only press", "3"],
];

export const MOUSE_BUTTON_ACTION_OPTIONS: [string, string][] = [
  ["Click", "1"],
  ["Press", "2"],
  ["Release", "3"],
];

export const MOUSE_BUTTON_SIDE_OPTIONS: [string, string][] = [
  ["Left", "1"],
  ["Right", "2"],
  ["Center", "3"],
];

/** Legacy key_pressed dropdown — values are C char/hex literals for Keyboard.write */
export const KEY_PRESSED_OPTIONS: [string, string][] = [
  ["A", "'A'"],
  ["B", "'B'"],
  ["C", "'C'"],
  ["D", "'D'"],
  ["E", "'E'"],
  ["F", "'F'"],
  ["G", "'G'"],
  ["H", "'H'"],
  ["I", "'I'"],
  ["J", "'J'"],
  ["K", "'K'"],
  ["L", "'L'"],
  ["M", "'M'"],
  ["N", "'N'"],
  ["Ñ", "'Ñ'"],
  ["O", "'O'"],
  ["P", "'P'"],
  ["Q", "'Q'"],
  ["R", "'R'"],
  ["S", "'S'"],
  ["T", "'T'"],
  ["U", "'U'"],
  ["V", "'V'"],
  ["W", "'W'"],
  ["X", "'X'"],
  ["Y", "'Y'"],
  ["Z", "'Z'"],
  ["a", "'a'"],
  ["b", "'b'"],
  ["c", "'c'"],
  ["d", "'d'"],
  ["e", "'e'"],
  ["f", "'f'"],
  ["g", "'g'"],
  ["h", "'h'"],
  ["i", "'i'"],
  ["j", "'j'"],
  ["k", "'k'"],
  ["l", "'l'"],
  ["m", "'m'"],
  ["n", "'n'"],
  ["ñ", "'ñ'"],
  ["o", "'o'"],
  ["p", "'p'"],
  ["q", "'q'"],
  ["r", "'r'"],
  ["s", "'s'"],
  ["t", "'t'"],
  ["u", "'u'"],
  ["v", "'v'"],
  ["w", "'w'"],
  ["x", "'x'"],
  ["y", "'y'"],
  ["z", "'z'"],
  ["1", "'1'"],
  ["2", "'2'"],
  ["3", "'3'"],
  ["4", "'4'"],
  ["5", "'5'"],
  ["6", "'6'"],
  ["7", "'7'"],
  ["8", "'8'"],
  ["9", "'9'"],
  ["0", "'0'"],
  ["!", "'!'"],
  ['"', '\'"\''],
  ["·", "'·'"],
  ["$", "'$'"],
  ["%", "'%'"],
  ["&", "'&'"],
  ["/", "'/'"],
  ["(", "'('"],
  [")", "')'"],
  ["=", "'='"],
  ["?", "'?'"],
  ["¿", "'¿'"],
  [";", "';'"],
  [":", "':'"],
  ["-", "'-'"],
  [",", "','"],
  [".", "'.'"],
  ["_", "'_'"],
  ["{", "'{'"],
  ["}", "'}'"],
  ["[", "'['"],
  ["]", "']'"],
  ["¡", "'¡'"],
  ["LEFT_CTRL", "0x80"],
  ["LEFT_SHIFT", "0x81"],
  ["LEFT_ALT", "0x82"],
  ["LEFT_GUI", "0x83"],
  ["RIGHT_CTRL", "0x84"],
  ["RIGHT_SHIFT", "0x85"],
  ["RIGHT_ALT", "0x86"],
  ["RIGHT_GUI", "0x87"],
  ["UP_ARROW", "0xDA"],
  ["DOWN_ARROW", "0xD9"],
  ["LEFT_ARROW", "0xD8"],
  ["RIGHT_ARROW", "0xD7"],
  ["BACKSPACE", "0xB2"],
  ["TAB", "0xB3"],
  ["RETURN", "0xB0"],
  ["ESC", "0xB1"],
  ["INSERT", "0xD1"],
  ["DELETE", "0xD4"],
  ["PAGE_UP", "0xD3"],
  ["PAGE_DOWN", "0xD6"],
  ["HOME", "0xD2"],
  ["END", "0xD5"],
  ["CAPS_LOCK", "0xC1"],
  ["F1", "0xC2"],
  ["F2", "0xC3"],
  ["F3", "0xC4"],
  ["F4", "0xC5"],
  ["F5", "0xC6"],
  ["F6", "0xC7"],
  ["F7", "0xC8"],
  ["F8", "0xC9"],
  ["F9", "0xCA"],
  ["F10", "0xCB"],
  ["F11", "0xCC"],
  ["F12", "0xCD"],
];

export function mouseButtonCode(
  action: string,
  side: string
): string {
  const sideConst =
    side === "1"
      ? "MOUSE_LEFT"
      : side === "2"
        ? "MOUSE_RIGHT"
        : "MOUSE_MIDDLE";
  if (action === "1") {
    return `Mouse.click(${sideConst});\n`;
  }
  if (action === "2") {
    return `Mouse.press(${sideConst});\n`;
  }
  return `Mouse.release(${sideConst});\n`;
}

export function keyboardActionCode(
  keyFun: string,
  selectedKey: string
): string {
  if (keyFun === "1") {
    return `Keyboard.write(${selectedKey});\n`;
  }
  if (keyFun === "2") {
    return `Keyboard.release(${selectedKey});\n`;
  }
  return `Keyboard.press(${selectedKey});\n`;
}
