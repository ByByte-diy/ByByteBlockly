import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import { BlockDefinition } from "../../../types/block.types";
import {
  KEYBOARD_BLE_BOARD_IDS,
  KEYBOARD_CATEGORY,
  KEYBOARD_COLOUR,
  KEYBOARD_HID_BOARD_IDS,
  KEYBOARD_LEVEL,
} from "../config";
import {
  createKeyboardIconField,
  KEY_FUNCTION_OPTIONS,
  KEY_PRESSED_OPTIONS,
  keyboardActionCode,
  keyboardLabel,
  MOUSE_BUTTON_ACTION_OPTIONS,
  MOUSE_BUTTON_SIDE_OPTIONS,
  mouseButtonCode,
} from "./keyboard.helper";

const HID_TOOLTIP =
  "These core libraries allow 32u4 and SAMD boards to appear as a native Mouse and/or Keyboard.";
const BLE_KEYBOARD_TOOLTIP =
  "ESP32 BLE keyboard library — appears as a native keyboard to a connected computer.";
const BLE_MOUSE_TOOLTIP =
  "ESP32 BLE mouse library — appears as a native mouse to a connected computer.";

function applyKeyboardColour(block: BlockDefinition): void {
  const originalInit = block.init;
  block.init = function (this: Blockly.Block) {
    originalInit.call(this);
    this.setColour(KEYBOARD_COLOUR);
  };
}

function ensureHidKeyboard(generator: any): void {
  registerInclude(generator, "Keyboard.h", "Native USB keyboard library.");
  generator.setups_["keyboard_begin"] = "Keyboard.begin();\n";
}

function ensureHidMouse(generator: any): void {
  registerInclude(generator, "Mouse.h", "Native USB mouse library.");
  generator.setups_["mouse_begin"] = "Mouse.begin();\n";
}

function ensureBleKeyboard(generator: any): void {
  registerInclude(generator, "BleKeyboard.h", "BLE keyboard library for ESP32.");
  registerGlobalVariable(
    generator,
    "define_keyboard",
    "BleKeyboard Keyboard;",
    "BLE keyboard instance."
  );
  generator.setups_["keyboard_begin"] = "Keyboard.begin();\n";
}

function ensureBleMouse(generator: any): void {
  registerInclude(generator, "BleMouse.h", "BLE mouse library for ESP32.");
  registerGlobalVariable(
    generator,
    "define_mouse",
    "BleMouse Mouse;;",
    "BLE mouse instance (legacy typo preserved)."
  );
  generator.setups_["mouse_begin"] = "Mouse.begin();\n";
}

function buildKeyboardFunction(typeId: string, ble: boolean) {
  const block = new BlockBuilder(typeId)
    .setCategory(KEYBOARD_CATEGORY)
    .setColor(180)
    .setBoards([...(ble ? KEYBOARD_BLE_BOARD_IDS : KEYBOARD_HID_BOARD_IDS)])
    .setLevel(KEYBOARD_LEVEL)
    .setTags(["communication", "keyboard", ble ? "esp32" : "hid"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const keyFun = b.getFieldValue("KEY_FUN");
      const selectedKey =
        generator.valueToCode(b, "SelectedKey", generator.ORDER_ATOMIC) || "0";
      if (ble) {
        ensureBleKeyboard(generator);
      } else {
        ensureHidKeyboard(generator);
      }
      return keyboardActionCode(keyFun, selectedKey);
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createKeyboardIconField("keyboard.png"))
      .appendField(keyboardLabel("KeyboardFunction", "keyboard"))
      .appendField(new Blockly.FieldDropdown(KEY_FUNCTION_OPTIONS), "KEY_FUN");
    this.appendValueInput("SelectedKey").setCheck("String");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(ble ? BLE_KEYBOARD_TOOLTIP : HID_TOOLTIP);
  };
  applyKeyboardColour(block);
  return block;
}

function buildKeyPressed(typeId: string) {
  const block = new BlockBuilder(typeId)
    .setCategory(KEYBOARD_CATEGORY)
    .setColor(180)
    .setBoards([...KEYBOARD_HID_BOARD_IDS, ...KEYBOARD_BLE_BOARD_IDS])
    .setLevel(KEYBOARD_LEVEL)
    .setTags(["communication", "keyboard"])
    .setOutput("String")
    .setArduinoGenerator((b, generator) => [
      b.getFieldValue("KEY_PRESSED"),
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(keyboardLabel("KeyPressed", "key"))
      .appendField(
        new Blockly.FieldDropdown(KEY_PRESSED_OPTIONS),
        "KEY_PRESSED"
      );
    this.setOutput(true, "String");
    this.setInputsInline(true);
    this.setTooltip(HID_TOOLTIP);
  };
  applyKeyboardColour(block);
  return block;
}

function buildKeyboardText(typeId: string, ble: boolean) {
  const block = new BlockBuilder(typeId)
    .setCategory(KEYBOARD_CATEGORY)
    .setColor(180)
    .setBoards([...(ble ? KEYBOARD_BLE_BOARD_IDS : KEYBOARD_HID_BOARD_IDS)])
    .setLevel(KEYBOARD_LEVEL)
    .setTags(["communication", "keyboard", ble ? "esp32" : "hid"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const text =
        generator.valueToCode(b, "texttoprint", generator.ORDER_ATOMIC) || '""';
      const withLineFeed = b.getFieldValue("LOGIC") === "TRUE";
      if (ble) {
        ensureBleKeyboard(generator);
      } else {
        ensureHidKeyboard(generator);
      }
      return withLineFeed
        ? `Keyboard.println(String(${text}));\n`
        : `Keyboard.print(String(${text}));\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createKeyboardIconField("keyboard.png"))
      .appendField(keyboardLabel("KeyboardFunction", "keyboard"));
    this.appendValueInput("texttoprint")
      .setCheck(null)
      .appendField(keyboardLabel("WriteText", "write text"));
    this.appendDummyInput().appendField(
      new Blockly.FieldCheckbox("FALSE"),
      "LOGIC"
    );
    this.appendDummyInput().appendField(
      keyboardLabel("LineFeed", "line feed")
    );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(ble ? BLE_KEYBOARD_TOOLTIP : HID_TOOLTIP);
  };
  applyKeyboardColour(block);
  return block;
}

function buildMouseFunction(typeId: string, ble: boolean) {
  const block = new BlockBuilder(typeId)
    .setCategory(KEYBOARD_CATEGORY)
    .setColor(180)
    .setBoards([...(ble ? KEYBOARD_BLE_BOARD_IDS : KEYBOARD_HID_BOARD_IDS)])
    .setLevel(KEYBOARD_LEVEL)
    .setTags(["communication", "mouse", ble ? "esp32" : "hid"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      if (ble) {
        ensureBleMouse(generator);
      } else {
        ensureHidMouse(generator);
      }
      return mouseButtonCode(
        b.getFieldValue("MOUSE_BUTTON"),
        b.getFieldValue("MOUSE_BUTTON2")
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createKeyboardIconField("mouse.png"))
      .appendField(keyboardLabel("MouseFunction", "mouse"))
      .appendField(
        new Blockly.FieldDropdown(MOUSE_BUTTON_ACTION_OPTIONS),
        "MOUSE_BUTTON"
      );
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(MOUSE_BUTTON_SIDE_OPTIONS),
      "MOUSE_BUTTON2"
    );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(ble ? BLE_MOUSE_TOOLTIP : HID_TOOLTIP);
  };
  applyKeyboardColour(block);
  return block;
}

function buildMouseMove(typeId: string, ble: boolean) {
  const block = new BlockBuilder(typeId)
    .setCategory(KEYBOARD_CATEGORY)
    .setColor(180)
    .setBoards([...(ble ? KEYBOARD_BLE_BOARD_IDS : KEYBOARD_HID_BOARD_IDS)])
    .setLevel(KEYBOARD_LEVEL)
    .setTags(["communication", "mouse", ble ? "esp32" : "hid"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const x =
        generator.valueToCode(b, "axis_x", generator.ORDER_ATOMIC) || "0";
      const y =
        generator.valueToCode(b, "axis_y", generator.ORDER_ATOMIC) || "0";
      const w =
        generator.valueToCode(b, "wheel", generator.ORDER_ATOMIC) || "0";
      if (ble) {
        ensureBleMouse(generator);
      } else {
        ensureHidMouse(generator);
      }
      return `Mouse.move(${x},${y},${w});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendValueInput("axis_x")
      .appendField(createKeyboardIconField("mouse.png"))
      .appendField(keyboardLabel("MouseMoveX", "X position"))
      .setCheck("Number");
    this.appendValueInput("axis_y")
      .appendField(keyboardLabel("MouseMoveY", "Y position"))
      .setCheck("Number");
    this.appendValueInput("wheel")
      .appendField(keyboardLabel("MouseMoveW", "wheel"))
      .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(ble ? BLE_MOUSE_TOOLTIP : HID_TOOLTIP);
  };
  applyKeyboardColour(block);
  return block;
}

export const keyboardFunctionBlock = buildKeyboardFunction("keyboard_function", false);
export const keyPressedBlock = buildKeyPressed("key_pressed");
export const keyboardTextBlock = buildKeyboardText("keyboard_text", false);
export const mouseFunctionBlock = buildMouseFunction("mouse_function", false);
export const mouseMoveBlock = buildMouseMove("mouse_move", false);

export const keyboardFunctionEsp32Block = buildKeyboardFunction(
  "keyboard_function_esp32",
  true
);
export const keyPressedEsp32Block = buildKeyPressed("key_pressed_esp32");
export const keyboardTextEsp32Block = buildKeyboardText(
  "keyboard_text_esp32",
  true
);
export const mouseFunctionEsp32Block = buildMouseFunction(
  "mouse_function_esp32",
  true
);
export const mouseMoveEsp32Block = buildMouseMove("mouse_move_esp32", true);

export const KEYBOARD_BLOCKS = [
  keyboardFunctionBlock,
  keyPressedBlock,
  keyboardTextBlock,
  mouseFunctionBlock,
  mouseMoveBlock,
  keyboardFunctionEsp32Block,
  keyPressedEsp32Block,
  keyboardTextEsp32Block,
  mouseFunctionEsp32Block,
  mouseMoveEsp32Block,
];
