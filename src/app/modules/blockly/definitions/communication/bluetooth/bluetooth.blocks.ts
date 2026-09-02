import * as Blockly from "blockly";
import { getDigitalPins } from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import { BlockDefinition } from "../../../types/block.types";
import {
  BLUETOOTH_CATEGORY,
  CATEGORY_COLOUR,
  CATEGORY_PLATFORMS,
  commBlockLabel,
  applyCommDefaultPinFields,
  createBaudDropdownField,
  createBlockIconField,
  DEFAULT_BT_RX_PIN,
  DEFAULT_BT_TX_PIN,
  PRINT_FORMAT_OPTIONS,
  TOOLBOX_LEVEL,
} from "../config";

function msg(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

function applyCommColour(block: BlockDefinition): void {
  const originalInit = block.init;
  block.init = function (this: Blockly.Block) {
    originalInit.call(this);
    this.setColour(CATEGORY_COLOUR);
  };
}

export const softBtInitBlock = new BlockBuilder("soft_bt_init")
  .setCategory(BLUETOOTH_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "bluetooth", "init"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const rx = block.getFieldValue("PIN_RX");
    const tx = block.getFieldValue("PIN_TX");
    const baud = block.getFieldValue("PINBAUDIOS");
    registerInclude(
      generator,
      "SoftwareSerial.h",
      "SoftwareSerial library — Bluetooth HC-05/HC-06."
    );
    registerGlobalVariable(
      generator,
      "define_ssBT",
      `SoftwareSerial mySerialBT(${rx}, ${tx});`,
      `Bluetooth serial object (RX=${rx}, TX=${tx}).`
    );
    return `mySerialBT.begin(${baud});\n`;
  })
  .build();

softBtInitBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("bt.png", "serial"))
    .appendField(
      commBlockLabel("COMM_BLUETOOTH_INIT", "Initialize Bluetooth module")
    )
    .appendField(msg("SSERIAL_BT_TX", "TX"))
    .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN_TX")
    .appendField(msg("SSERIAL_BT_RX", "RX"))
    .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN_RX")
    .appendField(msg("SSERIAL_BT_BAUD", "bauds"))
    .appendField(createBaudDropdownField(), "PINBAUDIOS");
  applyCommDefaultPinFields(this, {
    PIN_TX: DEFAULT_BT_TX_PIN,
    PIN_RX: DEFAULT_BT_RX_PIN,
  });
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
};

export const softBtAvailableBlock = new BlockBuilder("soft_bt_available")
  .setCategory(BLUETOOTH_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "bluetooth"])
  .setOutput("Boolean")
  .setArduinoGenerator((_block, generator) => [
    "mySerialBT.available()",
    generator.ORDER_ATOMIC,
  ])
  .build();

softBtAvailableBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("bt.png", "serial"))
    .appendField(msg("SSERIAL_BT_Avai", "serial BT available?"));
  this.setOutput(true, "Boolean");
};

export const softBtReadBlock = new BlockBuilder("soft_bt_read")
  .setCategory(BLUETOOTH_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "bluetooth"])
  .setOutput("Number")
  .setArduinoGenerator((_block, generator) => [
    "(mySerialBT.read())",
    generator.ORDER_ATOMIC,
  ])
  .build();

softBtReadBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("bt.png", "serial"))
    .appendField(msg("SSERIAL_BT_Read", "serial BT read byte"));
  this.setOutput(true, "Number");
};

export const softBtReadStringBlock = new BlockBuilder("soft_bt_read_string")
  .setCategory(BLUETOOTH_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "bluetooth"])
  .setOutput("String")
  .setArduinoGenerator((block, generator) => {
    const untilNewline = block.getFieldValue("LOGIC") === "TRUE";
    const code = untilNewline
      ? "mySerialBT.readStringUntil('\\n')"
      : "mySerialBT.readString()";
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

softBtReadStringBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("bt.png", "serial"))
    .appendField(msg("SSERIAL_BT_ReadString", "serial BT read string"))
    .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC")
    .appendField(msg("SSERIAL_BT_Readlf", "until line feed"));
  this.setOutput(true, "String");
};

export const softBtReadNumberBlock = new BlockBuilder("soft_bt_read_number")
  .setCategory(BLUETOOTH_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "bluetooth"])
  .setOutput("Number")
  .setArduinoGenerator((block, generator) => {
    const untilNewline = block.getFieldValue("LOGIC") === "TRUE";
    const code = untilNewline
      ? "atof((mySerialBT.readStringUntil('\\n')).c_str())"
      : "mySerialBT.parseFloat()";
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

softBtReadNumberBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("bt.png", "serial"))
    .appendField(msg("SSERIAL_BT_ReadNum", "serial BT read as number"))
    .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC")
    .appendField(msg("SSERIAL_BT_Readlf", "until line feed"));
  this.setOutput(true, "Number");
};

export const softBtPrintForBlock = new BlockBuilder("soft_bt_printfor")
  .setCategory(BLUETOOTH_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "bluetooth"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const content =
      generator.valueToCode(block, "CONTENT", generator.ORDER_NONE) || "0";
    const type = block.getFieldValue("TYPE");
    return `mySerialBT.print(${content}, ${type});\n`;
  })
  .build();

softBtPrintForBlock.init = function (this: Blockly.Block) {
  this.appendValueInput("CONTENT")
    .setCheck("Number")
    .appendField(createBlockIconField("bt.png", "serial"))
    .appendField(msg("SSerial_BT_Print_Format", "serial BT print format"))
    .appendField(new Blockly.FieldDropdown(PRINT_FORMAT_OPTIONS), "TYPE");
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const softBtPrintBlock = new BlockBuilder("soft_bt_print")
  .setCategory(BLUETOOTH_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "bluetooth"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const content =
      generator.valueToCode(block, "CONTENT", generator.ORDER_ATOMIC) || "0";
    return `mySerialBT.print(${content});\n`;
  })
  .build();

softBtPrintBlock.init = function (this: Blockly.Block) {
  this.appendValueInput("CONTENT")
    .appendField(createBlockIconField("bt.png", "serial"))
    .appendField(msg("SSERIAL_BT_Print", "serial BT print on same line"));
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const softBtPrintlnBlock = new BlockBuilder("soft_bt_println")
  .setCategory(BLUETOOTH_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "bluetooth"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const content =
      generator.valueToCode(block, "CONTENT", generator.ORDER_ATOMIC) || "0";
    return `mySerialBT.println(${content});\n`;
  })
  .build();

softBtPrintlnBlock.init = function (this: Blockly.Block) {
  this.appendValueInput("CONTENT")
    .appendField(createBlockIconField("bt.png", "serial"))
    .appendField(msg("SSERIAL_BT_Println", "serial BT print on new line"));
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const softBtWriteBlock = new BlockBuilder("soft_bt_write")
  .setCategory(BLUETOOTH_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "bluetooth"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const content =
      generator.valueToCode(block, "CONTENT", generator.ORDER_ATOMIC) || "0";
    return `mySerialBT.write(${content});\n`;
  })
  .build();

softBtWriteBlock.init = function (this: Blockly.Block) {
  this.appendValueInput("CONTENT")
    .appendField(createBlockIconField("bt.png", "serial"))
    .appendField(msg("SSERIAL_BT_Write", "serial BT write"));
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const BLUETOOTH_BLOCKS = [
  softBtInitBlock,
  softBtAvailableBlock,
  softBtReadBlock,
  softBtReadStringBlock,
  softBtReadNumberBlock,
  softBtPrintForBlock,
  softBtPrintBlock,
  softBtPrintlnBlock,
  softBtWriteBlock,
].map((block) => {
  applyCommColour(block);
  return block;
});
