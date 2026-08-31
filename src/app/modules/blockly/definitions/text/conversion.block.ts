import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

function createConversionBlock(
  type: string,
  labelKey: string,
  generatorFn: (block: Blockly.Block, generator: any) => [string, number]
) {
  const blockDef = new BlockBuilder(type)
    .setCategory(CATEGORY_NAME)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["text", "conversion"])
    .addValueInput("NAME")
    .setOutput("String")
    .setArduinoGenerator(generatorFn)
    .build();

  blockDef.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendValueInput("NAME").appendField(Blockly.Msg[labelKey] || labelKey);
    this.setOutput(true, "String");
    this.setTooltip("Converts a value to a text type.");
    this.setHelpUrl("https://www.arduino.cc/en/Reference/StringConstructor");
  };

  return blockDef;
}

export const toCharBlock = createConversionBlock(
  "conversion_tochar",
  "CONV_tochar",
  (block, generator) => {
    const value =
      generator.valueToCode(block, "NAME", generator.ORDER_ATOMIC) || "0";
    return [`char(${value})`, generator.ORDER_ATOMIC];
  }
);

export const toStringBlock = createConversionBlock(
  "conversion_toString",
  "CONV_toString",
  (block, generator) => {
    const value =
      generator.valueToCode(block, "NAME", generator.ORDER_ATOMIC) || '""';
    return [`String(${value})`, generator.ORDER_ATOMIC];
  }
);

export const toString2Block = new BlockBuilder("conversion_toString2")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["text", "conversion"])
  .setOutput("String")
  .setArduinoGenerator((block, generator) => {
    const value =
      generator.valueToCode(block, "NAME", generator.ORDER_ATOMIC) || '""';
    const decimals =
      generator.valueToCode(block, "Decimals", generator.ORDER_ATOMIC) || "2";
    return [`String(${value},${decimals})`, generator.ORDER_ATOMIC];
  })
  .build();

toString2Block.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendValueInput("NAME").appendField(
    Blockly.Msg["CONV_toString"] || "to String"
  );
  this.appendValueInput("Decimals")
    .setCheck("Number")
    .appendField(Blockly.Msg["CONV_decimal"] || "decimals");
  this.setInputsInline(true);
  this.setOutput(true, "String");
  this.setTooltip("Converts a value to String with decimal places.");
  this.setHelpUrl("https://www.arduino.cc/en/Reference/StringConstructor");
};
