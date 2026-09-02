import * as Blockly from "blockly";
import { getDigitalPins } from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import { BlockDefinition } from "../../../types/block.types";
import {
  CATEGORY_COLOUR,
  CATEGORY_PLATFORMS,
  commBlockLabel,
  createBaudDropdownField,
  createBlockIconField,
  PRINT_FORMAT_OPTIONS,
  SOFT_SERIAL_CATEGORY,
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

function ensureSoftSerial(generator: any, rx: string, tx: string): void {
  registerInclude(
    generator,
    "SoftwareSerial.h",
    "SoftwareSerial library — UART on digital pins."
  );
  registerGlobalVariable(
    generator,
    "define_ss_definition",
    `SoftwareSerial mySerial(${rx}, ${tx});`,
    `SoftwareSerial object (RX=${rx}, TX=${tx}).`
  );
}

export const softInitBlock = new BlockBuilder("soft_init")
  .setCategory(SOFT_SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "soft-serial", "init"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const rx = block.getFieldValue("PIN_RX");
    const tx = block.getFieldValue("PIN_TX");
    const baud = block.getFieldValue("PINBAUDIOS");
    ensureSoftSerial(generator, rx, tx);
    return `mySerial.begin(${baud});\n`;
  })
  .build();

softInitBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(
      commBlockLabel("COMM_SOFT_SERIAL_INIT", "Initialize software serial")
    )
    .appendField(msg("SSERIAL_TX", "TX"))
    .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN_TX")
    .appendField(msg("SSERIAL_RX", "RX"))
    .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN_RX")
    .appendField(msg("SSERIAL_BAUD", "bauds"))
    .appendField(createBaudDropdownField(), "PINBAUDIOS");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
};

export const softAvailableBlock = new BlockBuilder("soft_available")
  .setCategory(SOFT_SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "soft-serial"])
  .setOutput("Boolean")
  .setArduinoGenerator((_block, generator) => [
    "mySerial.available()",
    generator.ORDER_ATOMIC,
  ])
  .build();

softAvailableBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SSERIAL_Avai", "software serial available?"));
  this.setOutput(true, "Boolean");
};

export const softReadBlock = new BlockBuilder("soft_read")
  .setCategory(SOFT_SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "soft-serial"])
  .setOutput("Number")
  .setArduinoGenerator((_block, generator) => [
    "(mySerial.read())",
    generator.ORDER_ATOMIC,
  ])
  .build();

softReadBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SSERIAL_Read", "software serial read byte"));
  this.setOutput(true, "Number");
};

export const softReadStringBlock = new BlockBuilder("soft_read_string")
  .setCategory(SOFT_SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "soft-serial"])
  .setOutput("String")
  .setArduinoGenerator((block, generator) => {
    const untilNewline = block.getFieldValue("LOGIC") === "TRUE";
    const code = untilNewline
      ? "mySerial.readStringUntil('\\n')"
      : "mySerial.readString()";
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

softReadStringBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SSERIAL_ReadString", "software serial read string"))
    .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC")
    .appendField(msg("SSERIAL_Readlf", "until line feed"));
  this.setOutput(true, "String");
};

export const softReadNumberBlock = new BlockBuilder("soft_read_number")
  .setCategory(SOFT_SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "soft-serial"])
  .setOutput("Number")
  .setArduinoGenerator((block, generator) => {
    const untilNewline = block.getFieldValue("LOGIC") === "TRUE";
    const code = untilNewline
      ? "atof((mySerial.readStringUntil('\\n')).c_str())"
      : "mySerial.parseFloat()";
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

softReadNumberBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SSERIAL_ReadNum", "software serial read as number"))
    .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC")
    .appendField(msg("SSERIAL_Readlf", "until line feed"));
  this.setOutput(true, "Number");
};

export const softPrintForBlock = new BlockBuilder("soft_printfor")
  .setCategory(SOFT_SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "soft-serial"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const content =
      generator.valueToCode(block, "CONTENT", generator.ORDER_NONE) || "0";
    const type = block.getFieldValue("TYPE");
    return `mySerial.print(${content}, ${type});\n`;
  })
  .build();

softPrintForBlock.init = function (this: Blockly.Block) {
  this.appendValueInput("CONTENT")
    .setCheck("Number")
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SSerial_Print_Format", "software serial print format"))
    .appendField(new Blockly.FieldDropdown(PRINT_FORMAT_OPTIONS), "TYPE");
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const softPrintBlock = new BlockBuilder("soft_print")
  .setCategory(SOFT_SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "soft-serial"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const content =
      generator.valueToCode(block, "CONTENT", generator.ORDER_ATOMIC) || "0";
    return `mySerial.print(${content});\n`;
  })
  .build();

softPrintBlock.init = function (this: Blockly.Block) {
  this.appendValueInput("CONTENT")
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SSERIAL_Print", "software serial print on same line"));
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const softPrintlnBlock = new BlockBuilder("soft_println")
  .setCategory(SOFT_SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "soft-serial"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const content =
      generator.valueToCode(block, "CONTENT", generator.ORDER_ATOMIC) || "0";
    return `mySerial.println(${content});\n`;
  })
  .build();

softPrintlnBlock.init = function (this: Blockly.Block) {
  this.appendValueInput("CONTENT")
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SSERIAL_Println", "software serial print on new line"));
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const softWriteBlock = new BlockBuilder("soft_write")
  .setCategory(SOFT_SERIAL_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "soft-serial"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const content =
      generator.valueToCode(block, "CONTENT", generator.ORDER_ATOMIC) || "0";
    return `mySerial.write(${content});\n`;
  })
  .build();

softWriteBlock.init = function (this: Blockly.Block) {
  this.appendValueInput("CONTENT")
    .appendField(createBlockIconField("serie.png", "serial"))
    .appendField(msg("SSERIAL_Write", "software serial write"));
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const SOFT_SERIAL_BLOCKS = [
  softInitBlock,
  softAvailableBlock,
  softReadBlock,
  softReadStringBlock,
  softReadNumberBlock,
  softPrintForBlock,
  softPrintBlock,
  softPrintlnBlock,
  softWriteBlock,
].map((block) => {
  applyCommColour(block);
  return block;
});
