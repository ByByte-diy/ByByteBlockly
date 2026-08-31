import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const lengthBlock = new BlockBuilder("text_length")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["text"])
  .setMessage("%{BKY_TEXT_LENGTH_TITLE}")
  .addValueInput("VALUE", null, ["String", "Array"])
  .setOutput("Number")
  .setTooltip("%{BKY_TEXT_LENGTH_TOOLTIP}")
  .setHelpUrl("https://www.arduino.cc/en/Reference/StringLength")
  .setArduinoGenerator((block, generator) => {
    const value =
      generator.valueToCode(block, "VALUE", generator.ORDER_UNARY_POSTFIX) ||
      '""';
    return [`${value}.length()`, generator.ORDER_UNARY_POSTFIX];
  })
  .build();

export const isEmptyBlock = new BlockBuilder("text_isEmpty")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["text"])
  .setMessage("%{BKY_TEXT_ISEMPTY_TITLE}")
  .addValueInput("VALUE", null, ["String", "Array"])
  .setOutput("Boolean")
  .setTooltip("%{BKY_TEXT_ISEMPTY_TOOLTIP}")
  .setHelpUrl("https://www.arduino.cc/en/Reference/StringLength")
  .setArduinoGenerator((block, generator) => {
    const gen = generator as any;
    const funcName = gen.addFunction(
      "isStringEmpty",
      [
        "boolean FUNCTION_NAME_PLACEHOLDER_(String msg) {",
        "  if (msg.length() == 0) {",
        "    return true;",
        "  } else {",
        "    return false;",
        "  }",
        "}",
      ].join("\n")
    );

    let argument =
      generator.valueToCode(block, "VALUE", generator.ORDER_UNARY_POSTFIX) ||
      '""';
    if (argument !== '""') {
      argument = `String(${argument})`;
    }

    return [`${funcName}(${argument})`, generator.ORDER_UNARY_POSTFIX];
  })
  .build();

export const appendBlock = new BlockBuilder("text_append")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["text"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setHelpUrl("https://www.arduino.cc/en/Reference/StringConstructor")
  .setArduinoGenerator((block, generator) => {
    const variableId = block.getFieldValue("VAR");
    const varName = generator.getVariableName(variableId);
    let argument =
      generator.valueToCode(block, "TEXT", generator.ORDER_UNARY_POSTFIX) ||
      '""';
    if (argument !== '""') {
      argument = `String(${argument})`;
    }
    return `${varName} += ${argument};\n`;
  })
  .build();

appendBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendValueInput("TEXT")
    .appendField(Blockly.Msg["TEXT_APPEND_TO"] || "to")
    .appendField(
      new Blockly.FieldVariable(
        Blockly.Msg["TEXT_APPEND_VARIABLE"] || "item"
      ),
      "VAR"
    )
    .appendField(Blockly.Msg["TEXT_APPEND_APPENDTEXT"] || "append text");
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setHelpUrl("https://www.arduino.cc/en/Reference/StringConstructor");

  const thisBlock = this;
  this.setTooltip(function () {
    return (
      Blockly.Msg["TEXT_APPEND_TOOLTIP"] || "Append text to variable."
    ).replace("%1", thisBlock.getFieldValue("VAR"));
  });
};

export const trimBlock = new BlockBuilder("text_trim")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["text"])
  .addValueInput("TEXT", "%{BKY_TEXT_TRIM}", "String")
  .setOutput("String")
  .setTooltip("%{BKY_TEXT_TRIM_TOOLTIP}")
  .setHelpUrl("https://www.arduino.cc/en/Tutorial/StringLengthTrim")
  .setArduinoGenerator((block, generator) => {
    const gen = generator as any;
    const funcName = gen.addFunction(
      "TrimString",
      [
        "String FUNCTION_NAME_PLACEHOLDER_(String Source) {",
        "  Source.trim();",
        "  return(Source);",
        "}",
      ].join("\n")
    );

    let argument =
      generator.valueToCode(block, "TEXT", generator.ORDER_UNARY_POSTFIX) ||
      '""';
    if (argument !== '""') {
      argument = `String(${argument})`;
    }
    return [`${funcName}(${argument})`, generator.ORDER_UNARY_POSTFIX];
  })
  .build();

export const changeCaseBlock = new BlockBuilder("text_changeCase")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["text"])
  .addValueInput("TEXT", null, "String")
  .addDropdownField(
    "CASE",
    [
      ["%{BKY_TEXT_CHANGECASE_OPERATOR_UPPERCASE}", "UPPERCASE"],
      ["%{BKY_TEXT_CHANGECASE_OPERATOR_LOWERCASE}", "LOWERCASE"],
    ],
    "UPPERCASE",
    "TEXT"
  )
  .setOutput("String")
  .setTooltip("%{BKY_TEXT_CHANGECASE_TOOLTIP}")
  .setHelpUrl("https://www.arduino.cc/en/Reference/StringMethods")
  .setArduinoGenerator((block, generator) => {
    const gen = generator as any;
    const funcName = gen.addFunction(
      "UpperLowerString",
      [
        "String FUNCTION_NAME_PLACEHOLDER_(String Source, boolean ToUpper) {",
        "  if (ToUpper == true) Source.toUpperCase();",
        "  else Source.toLowerCase();",
        "  return(Source);",
        "}",
      ].join("\n")
    );

    const text =
      generator.valueToCode(block, "TEXT", generator.ORDER_UNARY_POSTFIX) ||
      '""';
    const isUpper =
      block.getFieldValue("CASE") === "UPPERCASE" ? "true" : "false";
    return [`${funcName}(${text}, ${isUpper})`, generator.ORDER_UNARY_POSTFIX];
  })
  .build();
