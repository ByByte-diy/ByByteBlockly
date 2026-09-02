import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { BlockDefinition } from "../../../types/block.types";
import {
  CATEGORY_COLOUR,
  CATEGORY_PLATFORMS,
  commBlockLabel,
  createBaudDropdownField,
  createBlockIconField,
  PRINT_FORMAT_OPTIONS,
  SERIAL_CATEGORY,
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

export const serialInitBlock = new BlockBuilder("serial_init")
  .setCategory(SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "serial", "init"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((_block, generator) => {
    const baud = _block.getFieldValue("PINBAUDIOS");
    return `Serial.begin(${baud});\n`;
  })
  .build();

serialInitBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(
      commBlockLabel("COMM_SERIAL_INIT", "Initialize USB serial")
    )
    .appendField(msg("SERIAL_BAUD", "baud"))
    .appendField(createBaudDropdownField(), "PINBAUDIOS");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip("Initialize USB Serial communication.");
};

export const serialAvailableBlock = new BlockBuilder("serial_available")
  .setCategory(SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "serial"])
  .setOutput("Boolean")
  .setArduinoGenerator((_block, generator) => [
    "Serial.available()",
    generator.ORDER_ATOMIC,
  ])
  .build();

serialAvailableBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SERIAL_Avai", "serial available?"));
  this.setOutput(true, "Boolean");
};

export const serialReadBlock = new BlockBuilder("serial_read")
  .setCategory(SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "serial"])
  .setOutput("Number")
  .setArduinoGenerator((_block, generator) => [
    "(Serial.read())",
    generator.ORDER_ATOMIC,
  ])
  .build();

serialReadBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SERIAL_Read", "serial read byte"));
  this.setOutput(true, "Number");
};

export const serialReadStringBlock = new BlockBuilder("serial_read_string")
  .setCategory(SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "serial"])
  .setOutput("String")
  .setArduinoGenerator((block, generator) => {
    const untilNewline = block.getFieldValue("LOGIC") === "TRUE";
    const code = untilNewline
      ? "Serial.readStringUntil('\\n')"
      : "Serial.readString()";
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

serialReadStringBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SERIAL_ReadString", "serial read string"))
    .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC")
    .appendField(msg("SERIAL_Readlf", "until line feed"));
  this.setOutput(true, "String");
};

export const serialReadNumberBlock = new BlockBuilder("serial_read_number")
  .setCategory(SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "serial"])
  .setOutput("Number")
  .setArduinoGenerator((block, generator) => {
    const untilNewline = block.getFieldValue("LOGIC") === "TRUE";
    const code = untilNewline
      ? "atof((Serial.readStringUntil('\\n')).c_str())"
      : "Serial.parseFloat()";
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

serialReadNumberBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SERIAL_ReadNum", "serial read as number"))
    .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC")
    .appendField(msg("SERIAL_Readlf", "until line feed"));
  this.setOutput(true, "Number");
};

export const serialPrintForBlock = new BlockBuilder("serial_printfor")
  .setCategory(SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "serial"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const content =
      generator.valueToCode(block, "CONTENT", generator.ORDER_NONE) || "0";
    const type = block.getFieldValue("TYPE");
    return `Serial.print(${content}, ${type});\n`;
  })
  .build();

serialPrintForBlock.init = function (this: Blockly.Block) {
  this.appendValueInput("CONTENT")
    .setCheck("Number")
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("Serial_Print_Format", "serial print format"))
    .appendField(new Blockly.FieldDropdown(PRINT_FORMAT_OPTIONS), "TYPE");
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const serialPrintBlock = new BlockBuilder("serial_print")
  .setCategory(SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "serial"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const content =
      generator.valueToCode(block, "CONTENT", generator.ORDER_ATOMIC) || "0";
    return `Serial.print(${content});\n`;
  })
  .build();

serialPrintBlock.init = function (this: Blockly.Block) {
  this.appendValueInput("CONTENT")
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SERIAL_Print", "serial print on same line"));
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const serialPrintlnBlock = new BlockBuilder("serial_println")
  .setCategory(SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "serial"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const content =
      generator.valueToCode(block, "CONTENT", generator.ORDER_ATOMIC) || "0";
    return `Serial.println(${content});\n`;
  })
  .build();

serialPrintlnBlock.init = function (this: Blockly.Block) {
  this.appendValueInput("CONTENT")
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SERIAL_Println", "serial print on new line"));
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const serialWriteBlock = new BlockBuilder("serial_write")
  .setCategory(SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "serial"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const content =
      generator.valueToCode(block, "CONTENT", generator.ORDER_ATOMIC) || "0";
    return `Serial.write(${content});\n`;
  })
  .build();

serialWriteBlock.init = function (this: Blockly.Block) {
  this.appendValueInput("CONTENT")
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SERIAL_Write", "serial write"));
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const SERIAL_BLOCKS = [
  serialInitBlock,
  serialAvailableBlock,
  serialReadBlock,
  serialReadStringBlock,
  serialReadNumberBlock,
  serialPrintForBlock,
  serialPrintBlock,
  serialPrintlnBlock,
  serialWriteBlock,
].map((block) => {
  applyCommColour(block);
  return block;
});
